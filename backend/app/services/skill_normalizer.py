import json
import re
from typing import Dict, List, Optional, Set, Tuple
from app.config import settings

class SkillNormalizer:
    """Provides canonical skill resolution, alias normalization, and category lookups."""

    def __init__(self, skills_file_path=None):
        self.skills_path = skills_file_path or settings.SKILLS_FILE_PATH
        self.alias_to_canonical: Dict[str, str] = {}
        self.canonical_to_category: Dict[str, str] = {}
        self.canonical_to_aliases: Dict[str, List[str]] = {}
        self.canonical_skills: Set[str] = set()
        self.categories: Dict[str, List[str]] = {}
        self.load_skills()

    def load_skills(self):
        try:
            with open(self.skills_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            categories_data = data.get("categories", {})
            self.categories = {}
            
            for category, skills_list in categories_data.items():
                self.categories[category] = []
                for skill_obj in skills_list:
                    canonical_name = skill_obj["name"]
                    aliases = skill_obj.get("aliases", [])
                    
                    self.canonical_skills.add(canonical_name)
                    self.canonical_to_category[canonical_name] = category
                    self.canonical_to_aliases[canonical_name] = aliases
                    self.categories[category].append(canonical_name)
                    
                    # Map canonical lowercase
                    self.alias_to_canonical[canonical_name.lower().strip()] = canonical_name
                    
                    # Map each alias lowercase
                    for alias in aliases:
                        self.alias_to_canonical[alias.lower().strip()] = canonical_name
                        
        except Exception as e:
            print(f"Warning: Failed to load skills dictionary from {self.skills_path}: {e}")

    def normalize(self, raw_skill: str) -> str:
        """Converts raw or abbreviated skill name to its canonical representation."""
        if not raw_skill:
            return ""
            
        cleaned = raw_skill.strip().lower()
        cleaned = re.sub(r"[\(\)\[\],;]", " ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        
        # Exact alias match
        if cleaned in self.alias_to_canonical:
            return self.alias_to_canonical[cleaned]
        
        # Check without punctuation dots/hyphens e.g. "react.js" -> "reactjs"
        stripped_punct = re.sub(r"[\.-]", "", cleaned)
        if stripped_punct in self.alias_to_canonical:
            return self.alias_to_canonical[stripped_punct]
            
        # Fallback: title casing if not in dictionary
        return raw_skill.strip().title()

    def get_category(self, canonical_name: str) -> str:
        """Returns the high-level category for a canonical skill."""
        return self.canonical_to_category.get(canonical_name, "General")

    def is_known_skill(self, skill_name: str) -> bool:
        norm = self.normalize(skill_name)
        return norm in self.canonical_skills

skill_normalizer = SkillNormalizer()
