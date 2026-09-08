import re
from typing import List, Dict, Any

class RecommendationEngine:
    """Generates targeted, gap-based resume improvement recommendations."""

    VAGUE_ACTION_VERBS = [
        r"\bworked on\b",
        r"\bhelped with\b",
        r"\bresponsible for\b",
        r"\bassisted in\b",
        r"\binvolved in\b",
        r"\bparticipated in\b"
    ]

    METRIC_PATTERNS = [
        r"\d+%",
        r"\$\d+",
        r"\b\d+\s*(?:x|times)\b",
        r"\breduced\s+by\s+\d+",
        r"\bincreased\s+by\s+\d+",
        r"\bimproved\s+by\s+\d+",
        r"\b(?:saved|generated|scaled\s+to)\s+\d+"
    ]

    def analyze_bullet_points(self, exp_section: str) -> List[str]:
        """Detects weak bullet points lacking measurable metrics or using passive verbs."""
        lines = exp_section.split("\n")
        weak_points = []

        for line in lines:
            line_clean = line.strip().lstrip("-*•▪ ").strip()
            if len(line_clean) > 20 and len(line_clean) < 180:
                # Check for vague verbs
                has_vague = any(re.search(pat, line_clean, re.IGNORECASE) for pat in self.VAGUE_ACTION_VERBS)
                # Check for absence of metrics
                has_metrics = any(re.search(pat, line_clean, re.IGNORECASE) for pat in self.METRIC_PATTERNS)
                
                if has_vague or not has_metrics:
                    weak_points.append(line_clean)
                    if len(weak_points) >= 3:
                        break
        return weak_points

    def generate(
        self,
        missing_skills: List[Dict[str, Any]],
        partial_skills: List[Dict[str, Any]],
        experience_eval: Dict[str, Any],
        education_eval: Dict[str, Any],
        resume_exp_section: str
    ) -> List[Dict[str, Any]]:
        """Synthesizes recommendations based on verified gaps."""
        recs: List[Dict[str, Any]] = []
        rec_id = 1

        # 1. Missing Required Skills
        missing_required = [s for s in missing_skills if s.get("importance") == "required"]
        if missing_required:
            top_skills = [s["name"] for s in missing_required[:4]]
            categories = list(set(s.get("category", "Technical") for s in missing_required[:4]))
            cat_str = ", ".join(categories) if categories else "Technical"
            
            recs.append({
                "id": rec_id,
                "title": f"Address Core Missing Skills ({cat_str})",
                "type": "skill_gap",
                "description": f"The job description designates {', '.join(top_skills)} as essential requirements, but these were not detected in your resume.",
                "action": f"If you have academic, project, or professional experience with {', '.join(top_skills)}, feature them prominently in your Skills and Work Experience sections with concrete examples."
            })
            rec_id += 1

        # 2. Missing Cloud / Infrastructure / DevOps Skills
        cloud_or_devops_missing = [
            s for s in missing_skills 
            if s.get("category") in ["Cloud", "DevOps"] and s["name"] not in [m["name"] for m in missing_required[:4]]
        ]
        if cloud_or_devops_missing:
            names = [s["name"] for s in cloud_or_devops_missing[:3]]
            recs.append({
                "id": rec_id,
                "title": "Highlight Cloud & Deployment Infrastructure",
                "type": "skill_gap",
                "description": f"The employer prioritizes infrastructure competencies like {', '.join(names)}, which are missing from your profile.",
                "action": f"Consider detailing specific cloud services, container setups, or CI/CD pipelines you have built or configured in your previous positions or side projects."
            })
            rec_id += 1

        # 3. Partial Semantic Matches (Opportunity to Clarify)
        if partial_skills:
            top_partial = partial_skills[0]
            related = top_partial.get("related_resume_skill", "related technologies")
            recs.append({
                "id": rec_id,
                "title": f"Explicitly Name '{top_partial['name']}'",
                "type": "skill_gap",
                "description": f"You have relevant experience mentioning '{related}', which our NLP engine recognized as partially matching '{top_partial['name']}'.",
                "action": f"Explicitly add '{top_partial['name']}' alongside '{related}' to ensure both automated ATS scanners and hiring managers recognize your competency directly."
            })
            rec_id += 1

        # 4. Weak / Unquantified Experience Bullets
        weak_bullets = self.analyze_bullet_points(resume_exp_section)
        if weak_bullets:
            example_bullet = weak_bullets[0]
            recs.append({
                "id": rec_id,
                "title": "Quantify Impact with Measurable Outcomes",
                "type": "metrics",
                "description": f"Some experience descriptions lack quantifiable achievements. For instance: \"{example_bullet[:90]}...\"",
                "action": "Strengthen bullet points by following the Google X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Add metrics like latency reduction %, revenue impact, users served, or dataset sizes."
            })
            rec_id += 1

        # 5. Experience Duration Gaps
        if experience_eval.get("status") == "below_requirement":
            req_yrs = experience_eval.get("required")
            det_yrs = experience_eval.get("detected")
            recs.append({
                "id": rec_id,
                "title": "Emphasize Project Scope & Accelerated Growth",
                "type": "experience_weakness",
                "description": f"Role specifies {req_yrs}+ years of experience while your resume explicitly denotes ~{det_yrs} years.",
                "action": "Offset the tenure gap by showcasing high-impact leadership responsibilities, complex end-to-end architectures, and production ownership to demonstrate senior-level capability."
            })
            rec_id += 1

        # 6. Fallback General Best Practice if few recs
        if len(recs) < 3:
            recs.append({
                "id": rec_id,
                "title": "Tailor Summary to Job Responsibilities",
                "type": "formatting",
                "description": "Align your opening professional summary closely with the primary mission statement and core challenges mentioned in the job description.",
                "action": "Ensure the first 3 lines of your resume clearly pitch your relevant strengths for this exact title and domain."
            })

        return recs

recommendation_engine = RecommendationEngine()
