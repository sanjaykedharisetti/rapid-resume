import re
from typing import Dict, List, Set, Tuple, Any
from app.services.skill_normalizer import skill_normalizer
from app.services.text_preprocessor import text_preprocessor

class SkillExtractor:
    """Extracts, classifies, and normalizes skills from resume and job description text."""

    def __init__(self):
        self.normalizer = skill_normalizer
        self._compiled_patterns = self._build_regex_patterns()

    def _build_regex_patterns(self) -> List[Tuple[re.Pattern, str]]:
        """Pre-compiles regex patterns for all aliases sorted by length descending for greedy matching."""
        sorted_aliases = sorted(
            self.normalizer.alias_to_canonical.keys(),
            key=lambda x: len(x),
            reverse=True
        )
        
        patterns = []
        for alias in sorted_aliases:
            canonical = self.normalizer.alias_to_canonical[alias]
            escaped = re.escape(alias)
            if alias in ["c++", "c#", ".net"]:
                pat = re.compile(rf"(?:^|[\s,;/()\[\]]){escaped}(?=[\s,;/()\[\]]|$)", re.IGNORECASE)
            else:
                pat = re.compile(rf"\b{escaped}\b", re.IGNORECASE)
            patterns.append((pat, canonical))
        return patterns

    def extract_from_text(self, text: str) -> Dict[str, Dict[str, Any]]:
        """Extracts all unique canonical skills found in text with metadata."""
        if not text:
            return {}
        
        detected_skills: Dict[str, Dict[str, Any]] = {}
        cleaned = text_preprocessor.clean_text(text)
        
        for pattern, canonical in self._compiled_patterns:
            matches = list(pattern.finditer(cleaned))
            if matches:
                if canonical not in detected_skills:
                    m = matches[0]
                    # Capture preceding text up to sentence boundary
                    start = max(0, m.start() - 50)
                    end = min(len(cleaned), m.end() + 30)
                    snippet = cleaned[start:end].replace("\n", " ").strip()
                    prefix = cleaned[start:m.start()].replace("\n", " ").lower()
                    
                    detected_skills[canonical] = {
                        "canonical": canonical,
                        "category": self.normalizer.get_category(canonical),
                        "count": len(matches),
                        "snippet": snippet,
                        "prefix": prefix
                    }
        
        return detected_skills

    def extract_resume_skills(self, resume_text: str, sections: Dict[str, str] = None) -> Dict[str, Dict[str, Any]]:
        """Extracts skills from resume, prioritizing Skills and Experience sections."""
        if not sections:
            sections = text_preprocessor.segment_resume(resume_text)
        
        all_skills = self.extract_from_text(resume_text)
        skills_sec = sections.get("skills", "")
        if skills_sec:
            explicit_skills = self.extract_from_text(skills_sec)
            for name in explicit_skills:
                if name in all_skills:
                    all_skills[name]["in_skills_section"] = True
                    
        return all_skills

    def extract_jd_skills(self, jd_text: str, sections: Dict[str, str] = None) -> Dict[str, List[Dict[str, Any]]]:
        """
        Extracts skills from JD and categorizes them into 'required' and 'preferred'.
        """
        if not sections:
            sections = text_preprocessor.segment_jd(jd_text)
            
        req_text = sections.get("requirements", "")
        pref_text = sections.get("preferred", "")
        
        # Skills in explicitly preferred section
        pref_skills_dict = self.extract_from_text(pref_text) if pref_text else {}
        req_skills_dict = self.extract_from_text(req_text) if req_text else {}
        
        all_jd_skills = self.extract_from_text(jd_text)
        
        required_list = []
        preferred_list = []
        
        for canonical, info in all_jd_skills.items():
            is_preferred = False
            # If in designated preferred section and not in required section
            if canonical in pref_skills_dict and canonical not in req_skills_dict:
                is_preferred = True
            else:
                # Check preceding text in same sentence for preferred markers
                prefix = info.get("prefix", "")
                # Only check after the last period or semicolon
                last_delim = max(prefix.rfind("."), prefix.rfind(";"), prefix.rfind("\n"))
                curr_clause = prefix[last_delim + 1:] if last_delim != -1 else prefix
                if any(w in curr_clause for w in ["nice to have", "preferred", "plus", "bonus", "desirable"]):
                    is_preferred = True
            
            info_copy = dict(info)
            if is_preferred:
                info_copy["importance"] = "preferred"
                preferred_list.append(info_copy)
            else:
                info_copy["importance"] = "required"
                required_list.append(info_copy)
                
        if not required_list and preferred_list:
            for item in preferred_list:
                item["importance"] = "required"
            required_list = preferred_list
            preferred_list = []
            
        return {
            "required": required_list,
            "preferred": preferred_list
        }

skill_extractor = SkillExtractor()
