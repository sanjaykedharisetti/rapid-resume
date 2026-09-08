import re
from datetime import datetime
from typing import Dict, Any, Optional, Tuple, List

class ExperienceAnalyzer:
    """Extracts required experience from JD and detected experience from resume."""

    # Patterns for extracting years of experience
    EXP_PATTERNS = [
        r"(?:at\s+least|minimum|min\.?)\s*(?:of\s*)?(\d+(?:\.\d+)?)\+?\s*(?:-\s*\d+)?\s*(?:years?|yrs?)",
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:to\s*\d+\s*)?(?:years?|yrs?)(?:\s+of)?(?:\s+hands-on|\s+relevant|\s+work|\s+professional|\s+industry)?\s+experience",
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)(?:\s+in|\s+with)?\s+[A-Za-z0-9\s,\-_]+",
        r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\s+background"
    ]

    YEAR_RANGE_PATTERN = r"(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(20\d{2}|19\d{2})\s*(?:-|–|—|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(20\d{2}|19\d{2}|Present|Current|Now)"

    def extract_jd_required_experience(self, jd_text: str) -> Optional[float]:
        """Extracts required minimum years of experience from job description."""
        cleaned = jd_text.lower()
        candidates = []
        
        for pat in self.EXP_PATTERNS:
            matches = re.finditer(pat, cleaned, re.IGNORECASE)
            for m in matches:
                try:
                    val = float(m.group(1))
                    if 0 < val <= 25:  # Realistic experience range
                        candidates.append(val)
                except (ValueError, IndexError):
                    pass
        
        if candidates:
            # Return the minimum stated required years (or median if multiple)
            return min(candidates)
        return None

    def extract_resume_experience(self, resume_text: str, exp_section: str = "") -> Tuple[Optional[float], bool]:
        """
        Extracts years of experience from resume.
        Returns (years, is_confident).
        """
        combined = (exp_section + "\n" + resume_text).lower()
        explicit_candidates = []

        # 1. Search for explicit overall experience statements
        explicit_patterns = [
            r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:overall|total|professional|work|industry)?\s*experience",
            r"(?:overall|total)\s+(?:of\s*)?(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)",
            r"over\s+(\d+(?:\.\d+)?)\s+years"
        ]
        
        for pat in explicit_patterns:
            matches = re.finditer(pat, combined, re.IGNORECASE)
            for m in matches:
                try:
                    val = float(m.group(1))
                    if 0.5 <= val <= 35:
                        explicit_candidates.append(val)
                except (ValueError, IndexError):
                    pass
                    
        if explicit_candidates:
            # If explicit statement found like "5+ years of experience", use highest mentioned overall
            return max(explicit_candidates), True

        # 2. Extract date ranges from experience section
        current_year = datetime.now().year
        ranges = re.findall(self.YEAR_RANGE_PATTERN, exp_section or resume_text, re.IGNORECASE)
        
        total_months = 0
        intervals = []
        
        for start_str, end_str in ranges:
            try:
                start_yr = int(start_str)
                if end_str.lower() in ["present", "current", "now"]:
                    end_yr = current_year
                else:
                    end_yr = int(end_str)
                
                if 1985 <= start_yr <= current_year and start_yr <= end_yr <= current_year + 1:
                    span_years = max(0.5, end_yr - start_yr)
                    intervals.append((start_yr, end_yr, span_years))
            except Exception:
                continue

        if intervals:
            # Merge overlapping intervals or sum spans
            total_years = sum(span for _, _, span in intervals)
            # Cap at realistic span from earliest start to latest end
            earliest = min(start for start, _, _ in intervals)
            latest = max(end for _, end, _ in intervals)
            span_cap = max(1.0, float(latest - earliest))
            final_years = min(total_years, span_cap)
            return round(final_years, 1), True

        # Could not confidently determine
        return None, False

    def evaluate(self, resume_text: str, jd_text: str, resume_exp_section: str = "") -> Dict[str, Any]:
        required = self.extract_jd_required_experience(jd_text)
        detected, is_confident = self.extract_resume_experience(resume_text, resume_exp_section)

        if not is_confident or detected is None:
            if required is not None:
                return {
                    "required": required,
                    "detected": None,
                    "status": "undetermined",
                    "score": 75.0,  # Neutral default when experience is not explicitly stated
                    "details": "Experience could not be confidently determined from resume text."
                }
            else:
                return {
                    "required": None,
                    "detected": None,
                    "status": "not_specified",
                    "score": 100.0,
                    "details": "No specific years of experience explicitly required in job description."
                }

        if required is None:
            return {
                "required": None,
                "detected": detected,
                "status": "meets_requirement",
                "score": 100.0,
                "details": f"Candidate demonstrates ~{detected} years of relevant experience."
            }

        # Both required and detected exist
        if detected >= required:
            status = "exceeds_requirement" if detected >= required + 2 else "meets_requirement"
            score = 100.0
            details = f"Resume demonstrates ~{detected} years of experience, meeting the required {required} years."
        else:
            status = "below_requirement"
            ratio = detected / required
            score = round(max(20.0, min(95.0, ratio * 100)), 1)
            details = f"Resume shows ~{detected} years of experience, which is below the target requirement of {required} years."

        return {
            "required": required,
            "detected": detected,
            "status": status,
            "score": score,
            "details": details
        }

experience_analyzer = ExperienceAnalyzer()
