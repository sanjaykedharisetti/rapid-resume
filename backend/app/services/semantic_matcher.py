from typing import Dict, List, Tuple, Any, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from app.config import settings

class SemanticMatcher:
    """Computes dense vector semantic similarities using Sentence Transformers."""

    _model: Optional[SentenceTransformer] = None

    @classmethod
    def get_model(cls) -> SentenceTransformer:
        if cls._model is None:
            cls._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        return cls._model

    def encode(self, texts: List[str]) -> np.ndarray:
        model = self.get_model()
        return model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

    def compute_similarity(self, text1: str, text2: str) -> float:
        """Computes normalized cosine similarity (0.0 to 1.0) between two text strings."""
        if not text1.strip() or not text2.strip():
            return 0.0
        
        embeddings = self.encode([text1[:2000], text2[:2000]])
        sim = float(cosine_similarity([embeddings[0]], [embeddings[1]])[0][0])
        return max(0.0, min(1.0, sim))

    def compute_section_similarities(
        self,
        resume_sections: Dict[str, str],
        jd_sections: Dict[str, str]
    ) -> Dict[str, float]:
        """Compares resume summary, experience, and skills against corresponding JD sections."""
        res_summary = resume_sections.get("summary", "") or resume_sections.get("other", "")
        jd_summary = jd_sections.get("overview", "") or jd_sections.get("requirements", "")
        
        res_exp = resume_sections.get("experience", "")
        jd_resp = jd_sections.get("responsibilities", "") or jd_sections.get("requirements", "")
        
        res_skills = resume_sections.get("skills", "")
        jd_req = jd_sections.get("requirements", "")
        
        if not res_summary.strip():
            res_summary = res_exp[:500]
        if not jd_summary.strip():
            jd_summary = jd_resp[:500]

        summary_sim = self.compute_similarity(res_summary, jd_summary) if (res_summary and jd_summary) else 0.5
        exp_sim = self.compute_similarity(res_exp, jd_resp) if (res_exp and jd_resp) else 0.5
        skills_sim = self.compute_similarity(res_skills, jd_req) if (res_skills and jd_req) else 0.5
        
        # Scale similarities slightly for human readability since typical sentence cosine similarities span 0.3-0.8
        def scale_sim(val: float) -> float:
            return min(1.0, max(0.0, (val - 0.15) / 0.70))

        scaled_exp = scale_sim(exp_sim)
        scaled_skills = scale_sim(skills_sim)
        scaled_summary = scale_sim(summary_sim)

        composite = (scaled_exp * 0.40) + (scaled_skills * 0.35) + (scaled_summary * 0.25)
        
        return {
            "summary_similarity": round(scaled_summary * 100, 1),
            "experience_similarity": round(scaled_exp * 100, 1),
            "skills_similarity": round(scaled_skills * 100, 1),
            "overall_semantic_score": round(composite * 100, 1)
        }

    def evaluate_semantic_skill_matches(
        self,
        unmatched_jd_skills: List[Dict[str, Any]],
        detected_resume_skills: List[str],
        resume_sentences: List[str]
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Classifies unmatched JD skills into:
        1. Newly MATCHED (high semantic similarity >= 0.70)
        2. PARTIAL matches (similarity between 0.35 and 0.70)
        3. MISSING (similarity < 0.35)
        """
        if not unmatched_jd_skills:
            return [], [], []

        candidate_pool = list(detected_resume_skills)
        for s in resume_sentences[:25]:
            clean_s = s.strip()
            if len(clean_s) > 15:
                candidate_pool.append(clean_s)

        if not candidate_pool:
            missing = []
            for s in unmatched_jd_skills:
                missing.append({
                    "name": s["canonical"],
                    "category": s.get("category", "General"),
                    "importance": s.get("importance", "required"),
                    "reason": f"{s.get('importance', 'required').capitalize()} in JD but not found in resume."
                })
            return [], [], missing

        jd_skill_names = [s["canonical"] for s in unmatched_jd_skills]
        jd_embeddings = self.encode(jd_skill_names)
        cand_embeddings = self.encode(candidate_pool)

        sim_matrix = cosine_similarity(jd_embeddings, cand_embeddings)

        newly_matched = []
        partial_matched = []
        still_missing = []

        for i, skill_item in enumerate(unmatched_jd_skills):
            skill_name = skill_item["canonical"]
            best_idx = int(np.argmax(sim_matrix[i]))
            best_sim = float(sim_matrix[i][best_idx])
            matched_candidate = candidate_pool[best_idx]

            importance = skill_item.get("importance", "required")
            category = skill_item.get("category", "General")

            if best_sim >= settings.SEMANTIC_MATCH_HIGH_THRESHOLD:
                newly_matched.append({
                    "name": skill_name,
                    "category": category,
                    "match_type": "semantic",
                    "importance": importance,
                    "similarity": round(best_sim, 2),
                    "related_resume_skill": matched_candidate,
                    "reason": f"Strong semantic equivalence to '{matched_candidate}' in resume ({int(best_sim*100)}% similarity)."
                })
            elif best_sim >= settings.SEMANTIC_MATCH_PARTIAL_THRESHOLD:
                partial_matched.append({
                    "name": skill_name,
                    "category": category,
                    "match_type": "semantic",
                    "importance": importance,
                    "similarity": round(best_sim, 2),
                    "related_resume_skill": matched_candidate,
                    "reason": f"Partially aligned with related skill/experience in resume ({int(best_sim*100)}% semantic score)."
                })
            else:
                still_missing.append({
                    "name": skill_name,
                    "category": category,
                    "importance": importance,
                    "reason": f"{importance.capitalize()} skill in JD with no corresponding or related competencies in resume."
                })

        return newly_matched, partial_matched, still_missing

semantic_matcher = SemanticMatcher()
