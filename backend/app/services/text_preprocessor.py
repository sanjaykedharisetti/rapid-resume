import re
from typing import Dict, List, Any

class TextPreprocessor:
    """Preprocesses resume and job description text and extracts semantic sections."""

    RESUME_SECTION_PATTERNS = {
        "summary": [
            r"(?:executive\s+)?summary",
            r"professional\s+summary",
            r"profile",
            r"about\s+me",
            r"career\s+objective",
            r"objective"
        ],
        "experience": [
            r"work\s+experience",
            r"professional\s+experience",
            r"employment\s+history",
            r"experience",
            r"work\s+history"
        ],
        "skills": [
            r"technical\s+skills",
            r"skills\s*(?:&|and)?\s*competencies",
            r"core\s+competencies",
            r"skills\s*(?:&|and)?\s*technologies",
            r"skills",
            r"technologies",
            r"tools\s*(?:&|and)?\s*frameworks"
        ],
        "education": [
            r"education(?:\s*(?:&|and)?\s*certifications)?",
            r"academic\s+background",
            r"academic\s+history",
            r"qualifications"
        ],
        "projects": [
            r"projects",
            r"personal\s+projects",
            r"key\s+projects",
            r"selected\s+projects"
        ]
    }

    JD_SECTION_PATTERNS = {
        "overview": [
            r"about\s+(?:the\s+)?(?:role|job|company|team)",
            r"job\s+(?:overview|summary|description)",
            r"position\s+summary",
            r"who\s+we\s+are",
            r"role\s+overview"
        ],
        "responsibilities": [
            r"responsibilities",
            r"what\s+you('ll|\swill)\s+do",
            r"key\s+responsibilities",
            r"duties",
            r"your\s+role",
            r"what\s+you\s+will\s+be\s+doing"
        ],
        "requirements": [
            r"requirements",
            r"required\s+skills",
            r"required\s+qualifications",
            r"what\s+you('ll|\swill)\s+need",
            r"minimum\s+qualifications",
            r"must\s+have(?:s)?"
        ],
        "preferred": [
            r"preferred\s+qualifications",
            r"preferred\s+skills",
            r"nice\s+to\s+have(?:s)?",
            r"bonus\s+(?:points|qualifications)",
            r"desired\s+qualifications",
            r"what\s+would\s+be\s+a\s+plus"
        ]
    }

    @staticmethod
    def clean_text(text: str) -> str:
        """Removes unusual characters, normalizes linebreaks and excess spaces."""
        if not text:
            return ""
        # Normalize non-standard whitespace/quotes/dashes
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = re.sub(r"[‘’]", "'", text)
        text = re.sub(r"[“”]", '"', text)
        text = re.sub(r"[—–]", "-", text)
        text = re.sub(r"[•·▪●►★✔✓]", "\n- ", text)
        # Collapse multiple blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    @classmethod
    def segment_resume(cls, text: str) -> Dict[str, str]:
        """Segments resume into structured sections (summary, experience, skills, education, projects)."""
        cleaned = cls.clean_text(text)
        lines = cleaned.split("\n")
        
        sections = {
            "summary": "",
            "experience": "",
            "skills": "",
            "education": "",
            "projects": "",
            "other": ""
        }
        
        current_section = "summary"  # default opening text to summary
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            
            # Check if line matches a header pattern
            detected = None
            if len(stripped) < 60 and not stripped.endswith((".", ",")):
                for section_name, patterns in cls.RESUME_SECTION_PATTERNS.items():
                    for pattern in patterns:
                        if re.match(rf"^(?:#+\s*)?{pattern}(?:\s*:)?$", stripped, re.IGNORECASE):
                            detected = section_name
                            break
                    if detected:
                        break
            
            if detected:
                current_section = detected
            else:
                sections[current_section] += line + "\n"
        
        # Clean section texts
        for k in sections:
            sections[k] = sections[k].strip()
        
        # If experience is empty, try fallback search
        if not sections["experience"]:
            sections["experience"] = cleaned
        if not sections["skills"]:
            sections["skills"] = cleaned
            
        return sections

    @classmethod
    def segment_jd(cls, text: str) -> Dict[str, str]:
        """Segments job description into overview, responsibilities, requirements, preferred."""
        cleaned = cls.clean_text(text)
        lines = cleaned.split("\n")
        
        sections = {
            "overview": "",
            "responsibilities": "",
            "requirements": "",
            "preferred": "",
            "other": ""
        }
        
        current_section = "overview"
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            
            detected = None
            if len(stripped) < 60 and not stripped.endswith((".", ",")):
                for section_name, patterns in cls.JD_SECTION_PATTERNS.items():
                    for pattern in patterns:
                        if re.match(rf"^(?:#+\s*)?{pattern}(?:\s*:)?$", stripped, re.IGNORECASE):
                            detected = section_name
                            break
                    if detected:
                        break
            
            if detected:
                current_section = detected
            else:
                sections[current_section] += line + "\n"
        
        for k in sections:
            sections[k] = sections[k].strip()
            
        if not sections["requirements"]:
            sections["requirements"] = cleaned
            
        return sections

text_preprocessor = TextPreprocessor()
