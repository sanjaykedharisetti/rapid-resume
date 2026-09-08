import re
from typing import Dict, Any, List, Optional, Tuple

class EducationAnalyzer:
    """Extracts degree levels and fields of study from resumes and validates against JD requirements."""

    DEGREE_HIERARCHY = {
        "doctorate": 4,
        "masters": 3,
        "bachelors": 2,
        "associate": 1,
        "none": 0
    }

    DEGREE_PATTERNS = {
        "doctorate": [
            r"\bph\.?d\b",
            r"\bdoctorate\b",
            r"\bdoctor\s+of\s+philosophy\b"
        ],
        "masters": [
            r"\bm\.?s\.?\b(?:\s+in)?",
            r"\bm\.?sc\.?\b",
            r"\bm\.?tech\b",
            r"\bmca\b",
            r"\bmba\b",
            r"\bmaster(?:'s)?\s+(?:degree|of\s+science|of\s+technology|of\s+computer|of\s+engineering)?\b"
        ],
        "bachelors": [
            r"\bb\.?s\.?\b(?:\s+in)?",
            r"\bb\.?sc\.?\b",
            r"\bb\.?tech\b",
            r"\bb\.?e\.?\b",
            r"\bbca\b",
            r"\bbachelor(?:'s)?\s+(?:degree|of\s+science|of\s+technology|of\s+computer|of\s+engineering)?\b"
        ],
        "associate": [
            r"\bassociate(?:'s)?\s+(?:degree)?\b",
            r"\bdiploma\b"
        ]
    }

    FIELDS_OF_STUDY = [
        "computer science", "data science", "information technology",
        "software engineering", "electrical engineering", "mathematics",
        "statistics", "artificial intelligence", "machine learning",
        "computer engineering", "physics", "economics"
    ]

    def extract_degrees(self, text: str) -> List[Dict[str, Any]]:
        """Extracts detected degree types, fields, and snippets from text."""
        detected = []
        cleaned = text.lower()
        
        for deg_type, patterns in self.DEGREE_PATTERNS.items():
            for pat in patterns:
                matches = list(re.finditer(pat, cleaned, re.IGNORECASE))
                if matches:
                    # Look for field in neighborhood
                    m = matches[0]
                    window = cleaned[max(0, m.start() - 30): min(len(cleaned), m.end() + 60)]
                    
                    found_field = None
                    for field in self.FIELDS_OF_STUDY:
                        if field in window:
                            found_field = field.title()
                            break
                            
                    detected.append({
                        "level": deg_type,
                        "title": deg_type.title(),
                        "field": found_field or "Technical Field",
                        "weight": self.DEGREE_HIERARCHY[deg_type]
                    })
                    break  # One match per level
        return detected

    def extract_jd_requirement(self, jd_text: str) -> Tuple[str, Optional[str]]:
        """Extracts target degree level and preferred field from JD."""
        cleaned = jd_text.lower()
        
        target_level = "none"
        highest_weight = 0
        
        for deg_type, patterns in self.DEGREE_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, cleaned, re.IGNORECASE):
                    weight = self.DEGREE_HIERARCHY[deg_type]
                    if weight > highest_weight:
                        highest_weight = weight
                        target_level = deg_type
        
        target_field = None
        for field in self.FIELDS_OF_STUDY:
            if field in cleaned:
                target_field = field.title()
                break
                
        return target_level, target_field

    def evaluate(self, resume_text: str, jd_text: str, edu_section: str = "") -> Dict[str, Any]:
        combined_resume_edu = (edu_section + "\n" + resume_text)
        res_degrees = self.extract_degrees(combined_resume_edu)
        jd_level, jd_field = self.extract_jd_requirement(jd_text)

        detected_deg_names = [f"{d['title']} in {d['field']}" for d in res_degrees]
        req_deg_names = [f"{jd_level.title()}" + (f" in {jd_field}" if jd_field else "")] if jd_level != "none" else []

        if jd_level == "none":
            return {
                "status": "not_specified",
                "score": 100.0,
                "detected_degrees": detected_deg_names,
                "required_degrees": ["No specific degree mandated"],
                "details": "Job description does not mandate a specific degree."
            }

        if not res_degrees:
            return {
                "status": "undetermined",
                "score": 70.0,
                "detected_degrees": [],
                "required_degrees": req_deg_names,
                "details": "Education credentials could not be explicitly confirmed from the resume text."
            }

        highest_res_weight = max(d["weight"] for d in res_degrees)
        jd_weight = self.DEGREE_HIERARCHY[jd_level]

        if highest_res_weight >= jd_weight:
            return {
                "status": "satisfied",
                "score": 100.0,
                "detected_degrees": detected_deg_names,
                "required_degrees": req_deg_names,
                "details": f"Candidate education ({', '.join(detected_deg_names)}) satisfies the requirement for {jd_level.title()}."
            }
        else:
            return {
                "status": "partially_satisfied",
                "score": 75.0,
                "detected_degrees": detected_deg_names,
                "required_degrees": req_deg_names,
                "details": f"Candidate holds {', '.join(detected_deg_names)}, while JD prefers {jd_level.title()}."
            }

education_analyzer = EducationAnalyzer()
