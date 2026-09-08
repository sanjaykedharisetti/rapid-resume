from typing import Dict, List, Any, Tuple
from app.config import settings
from app.services.text_preprocessor import text_preprocessor
from app.services.skill_extractor import skill_extractor
from app.services.semantic_matcher import semantic_matcher
from app.services.experience_analyzer import experience_analyzer
from app.services.education_analyzer import education_analyzer
from app.services.recommendation_engine import recommendation_engine

class ScoringEngine:
    """Core Smart Match Engine implementing hybrid weighted multi-tiered matching."""

    def analyze(
        self,
        resume_text: str,
        jd_text: str,
        resume_filename: str = "Uploaded Resume",
        jd_title: str = "Target Position"
    ) -> Dict[str, Any]:
        # 1. Text Segmentation
        res_sections = text_preprocessor.segment_resume(resume_text)
        jd_sections = text_preprocessor.segment_jd(jd_text)

        # 2. Extract Skills
        res_skills_dict = skill_extractor.extract_resume_skills(resume_text, res_sections)
        jd_skills_classified = skill_extractor.extract_jd_skills(jd_text, jd_sections)

        jd_required = jd_skills_classified["required"]
        jd_preferred = jd_skills_classified["preferred"]

        # 3. Direct & Normalized Matching
        matched_skills: List[Dict[str, Any]] = []
        unmatched_jd_skills: List[Dict[str, Any]] = []

        res_canonical_set = set(res_skills_dict.keys())

        # Process Required JD skills
        for item in jd_required:
            canonical = item["canonical"]
            if canonical in res_canonical_set:
                matched_skills.append({
                    "name": canonical,
                    "category": item.get("category", "General"),
                    "match_type": "exact",
                    "importance": "required",
                    "similarity": 1.0,
                    "related_resume_skill": canonical,
                    "reason": f"Exact match for required skill '{canonical}' detected in candidate profile."
                })
            else:
                unmatched_jd_skills.append(item)

        # Process Preferred JD skills
        for item in jd_preferred:
            canonical = item["canonical"]
            if canonical in res_canonical_set:
                matched_skills.append({
                    "name": canonical,
                    "category": item.get("category", "General"),
                    "match_type": "exact",
                    "importance": "preferred",
                    "similarity": 1.0,
                    "related_resume_skill": canonical,
                    "reason": f"Exact match for preferred skill '{canonical}' detected in candidate profile."
                })
            else:
                unmatched_jd_skills.append(item)

        # 4. Semantic Matching for Unmatched Skills
        # Get resume sentences for contextual embedding matching
        resume_sentences = [
            s.strip() for s in resume_text.split("\n")
            if len(s.strip()) > 15
        ]
        
        sem_matched, partial_skills, missing_skills = semantic_matcher.evaluate_semantic_skill_matches(
            unmatched_jd_skills,
            list(res_canonical_set),
            resume_sentences
        )

        matched_skills.extend(sem_matched)

        # 5. Calculate Required & Preferred Skill Scores
        # Total counts
        total_req_count = len(jd_required)
        total_pref_count = len(jd_preferred)

        matched_req = [s for s in matched_skills if s.get("importance") == "required"]
        partial_req = [s for s in partial_skills if s.get("importance") == "required"]

        matched_pref = [s for s in matched_skills if s.get("importance") == "preferred"]
        partial_pref = [s for s in partial_skills if s.get("importance") == "preferred"]

        if total_req_count > 0:
            req_score = ((len(matched_req) + 0.5 * len(partial_req)) / total_req_count) * 100.0
            req_score = min(100.0, max(0.0, req_score))
        else:
            req_score = 85.0  # Default if no specific required skills parsed

        if total_pref_count > 0:
            pref_score = ((len(matched_pref) + 0.5 * len(partial_pref)) / total_pref_count) * 100.0
            pref_score = min(100.0, max(0.0, pref_score))
        else:
            pref_score = 100.0  # Perfect credit if no preferred skills mandated

        # 6. Semantic Similarity
        section_similarities = semantic_matcher.compute_section_similarities(res_sections, jd_sections)
        semantic_score = section_similarities["overall_semantic_score"]

        # 7. Experience Analysis
        exp_analysis = experience_analyzer.evaluate(resume_text, jd_text, res_sections["experience"])
        exp_score = exp_analysis["score"]

        # 8. Education Analysis
        edu_analysis = education_analyzer.evaluate(resume_text, jd_text, res_sections["education"])
        edu_score = edu_analysis["score"]

        # 9. Weighted Overall Composite Score
        overall = (
            (settings.WEIGHT_REQUIRED_SKILLS * req_score) +
            (settings.WEIGHT_SEMANTIC_SIMILARITY * semantic_score) +
            (settings.WEIGHT_EXPERIENCE * exp_score) +
            (settings.WEIGHT_PREFERRED_SKILLS * pref_score) +
            (settings.WEIGHT_EDUCATION * edu_score)
        )
        overall_score = round(min(100.0, max(0.0, overall)), 1)

        # Match Level
        if overall_score >= 80.0:
            match_level = "Strong Match"
        elif overall_score >= 60.0:
            match_level = "Good Match"
        elif overall_score >= 40.0:
            match_level = "Moderate Match"
        else:
            match_level = "Low Match"

        # 10. Generate Explanatory AI Insight
        insight = self._generate_ai_insight(
            overall_score=overall_score,
            match_level=match_level,
            matched_skills=matched_skills,
            partial_skills=partial_skills,
            missing_skills=missing_skills,
            exp_analysis=exp_analysis,
            edu_analysis=edu_analysis
        )

        # 11. Generate Actionable Recommendations
        recommendations = recommendation_engine.generate(
            missing_skills=missing_skills,
            partial_skills=partial_skills,
            experience_eval=exp_analysis,
            education_eval=edu_analysis,
            resume_exp_section=res_sections["experience"]
        )

        return {
            "resume_filename": resume_filename,
            "jd_title": jd_title,
            "overall_score": int(round(overall_score)),
            "match_level": match_level,
            "scores": {
                "required_skills": round(req_score, 1),
                "semantic_similarity": round(semantic_score, 1),
                "experience": round(exp_score, 1),
                "education": round(edu_score, 1),
                "preferred_skills": round(pref_score, 1)
            },
            "weights": {
                "required_skills": int(settings.WEIGHT_REQUIRED_SKILLS * 100),
                "semantic_similarity": int(settings.WEIGHT_SEMANTIC_SIMILARITY * 100),
                "experience": int(settings.WEIGHT_EXPERIENCE * 100),
                "preferred_skills": int(settings.WEIGHT_PREFERRED_SKILLS * 100),
                "education": int(settings.WEIGHT_EDUCATION * 100)
            },
            "matched_skills": matched_skills,
            "partial_skills": partial_skills,
            "missing_skills": missing_skills,
            "experience": exp_analysis,
            "education": edu_analysis,
            "insight": insight,
            "recommendations": recommendations,
            "breakdown": {
                "total_required_skills": total_req_count,
                "matched_required_skills": len(matched_req),
                "partial_required_skills": len(partial_req),
                "total_preferred_skills": total_pref_count,
                "matched_preferred_skills": len(matched_pref),
                "partial_preferred_skills": len(partial_pref),
                "sections_compared": {
                    "summary_similarity": section_similarities["summary_similarity"],
                    "experience_similarity": section_similarities["experience_similarity"],
                    "skills_similarity": section_similarities["skills_similarity"]
                }
            }
        }

    def _generate_ai_insight(
        self,
        overall_score: float,
        match_level: str,
        matched_skills: List[Dict[str, Any]],
        partial_skills: List[Dict[str, Any]],
        missing_skills: List[Dict[str, Any]],
        exp_analysis: Dict[str, Any],
        edu_analysis: Dict[str, Any]
    ) -> str:
        """Synthesizes dynamic, explainable insight text based on actual data."""
        top_matches = [s["name"] for s in matched_skills[:4]]
        matched_str = ", ".join(top_matches) if top_matches else "fundamental competencies"

        missing_req = [s["name"] for s in missing_skills if s.get("importance") == "required"]
        gap_str = ", ".join(missing_req[:3]) if missing_req else "minor tooling preferences"

        insight_parts = []
        if overall_score >= 80.0:
            insight_parts.append(f"You are a {match_level.lower()} ({int(overall_score)}%) for this position.")
            insight_parts.append(f"Your profile strongly aligns with the core requirements, displaying robust proficiency in {matched_str}.")
        elif overall_score >= 60.0:
            insight_parts.append(f"You present a competitive {match_level.lower()} ({int(overall_score)}%) for this role.")
            insight_parts.append(f"Your strengths in {matched_str} provide a solid foundation.")
        else:
            insight_parts.append(f"Your match score is currently {int(overall_score)}% ({match_level}).")
            insight_parts.append(f"While you show capability in {matched_str}, significant requirements remain unaddressed.")

        if missing_req:
            insight_parts.append(f"The most critical skill gaps to bridge are {gap_str}.")
        elif partial_skills:
            partial_names = ", ".join([s["name"] for s in partial_skills[:2]])
            insight_parts.append(f"You demonstrate related knowledge in {partial_names}, which could be made more explicit.")

        if exp_analysis.get("status") == "meets_requirement" and exp_analysis.get("detected"):
            insight_parts.append(f"Your ~{exp_analysis.get('detected')} years of background satisfies the targeted experience benchmark.")
        elif exp_analysis.get("status") == "below_requirement":
            insight_parts.append(f"The position targets {exp_analysis.get('required')}+ years of tenure; emphasize leadership and complex project delivery to offset this difference.")

        return " ".join(insight_parts)

scoring_engine = ScoringEngine()
