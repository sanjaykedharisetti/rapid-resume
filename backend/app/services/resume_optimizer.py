import re
from typing import Dict, List, Any, Tuple
from app.services.text_preprocessor import text_preprocessor
from app.services.scoring_engine import scoring_engine
from app.services.skill_normalizer import skill_normalizer

class ResumeOptimizer:
    """Intelligently enhances resume content to maximize ATS score and quantify impact."""

    ACTION_VERBS = [
        "Architected", "Engineered", "Spearheaded", "Optimized", "Implemented",
        "Streamlined", "Deployed", "Developed", "Pioneered", "Automated"
    ]

    METRIC_TEMPLATES = [
        "boosting throughput by 42% and reducing endpoint latency under 35ms",
        "improving system reliability and scaling to 1.2M daily active transactions",
        "increasing model prediction accuracy by 16% across production datasets",
        "reducing infrastructure cloud costs by 28% through automated provisioning",
        "accelerating deployment frequency by 3.5x with automated CI/CD validation",
        "achieving 99.95% service uptime across distributed microservice clusters"
    ]

    def optimize(
        self,
        original_resume_text: str,
        jd_text: str,
        original_analysis: Dict[str, Any],
        resume_filename: str = "Resume.pdf",
        jd_title: str = "Target Position"
    ) -> Dict[str, Any]:
        sections = text_preprocessor.segment_resume(original_resume_text)
        jd_sections = text_preprocessor.segment_jd(jd_text)

        missing_skills = original_analysis.get("missing_skills", [])
        partial_skills = original_analysis.get("partial_skills", [])
        matched_skills = original_analysis.get("matched_skills", [])

        # 1. Collect skills to inject
        skills_to_inject: List[Dict[str, str]] = []
        injected_names = set()

        for s in missing_skills:
            name = s["name"]
            if name not in injected_names:
                category = s.get("category", skill_normalizer.get_category(name))
                skills_to_inject.append({"name": name, "category": category, "importance": s.get("importance", "required")})
                injected_names.add(name)

        for s in partial_skills:
            name = s["name"]
            if name not in injected_names:
                category = s.get("category", skill_normalizer.get_category(name))
                skills_to_inject.append({"name": name, "category": category, "importance": s.get("importance", "required")})
                injected_names.add(name)

        # 2. Refine Professional Summary
        summary_before = sections.get("summary", "").strip()
        top_skills = [s["name"] for s in matched_skills[:4]] + [s["name"] for s in skills_to_inject[:3]]
        skills_str = ", ".join(list(dict.fromkeys(top_skills))[:6])
        
        years_exp = original_analysis.get("experience", {}).get("detected") or 3.0
        summary_after = (
            f"Results-driven and highly technical professional with ~{years_exp} years of specialized experience "
            f"aligned with the {jd_title} domain. Proven track record architecting and shipping production-grade "
            f"solutions with expertise in {skills_str}. Experienced in building scalable, reliable architectures, "
            f"optimizing end-to-end performance, and driving measurable business outcomes in collaborative engineering environments."
        )

        # 3. Enhance Skills Section
        skills_before = sections.get("skills", "").strip()
        # Group injected skills by category
        grouped_new_skills: Dict[str, List[str]] = {}
        for s in skills_to_inject:
            cat = s["category"]
            if cat not in grouped_new_skills:
                grouped_new_skills[cat] = []
            grouped_new_skills[cat].append(s["name"])

        added_skills_lines = []
        for cat, skl_list in grouped_new_skills.items():
            added_skills_lines.append(f"{cat} (Target Alignment): {', '.join(skl_list)}")

        skills_after = skills_before
        if added_skills_lines:
            skills_after += "\n" + "\n".join(added_skills_lines)

        # 4. Transform Weak Bullet Points (Google X-Y-Z Metric Enhancement)
        exp_before = sections.get("experience", "").strip()
        bullet_improvements: List[Dict[str, Any]] = []
        
        exp_lines = exp_before.split("\n")
        optimized_exp_lines = []
        metric_idx = 0

        for line in exp_lines:
            clean_l = line.strip()
            # Check if it is a bullet point that looks weak or lacks metrics
            is_bullet = clean_l.startswith(("-", "*", "•")) or (len(clean_l) > 25 and not clean_l.startswith("<b>") and not re.search(r"\b(19|20)\d{2}\b", clean_l))
            has_metric = bool(re.search(r"\d+%", clean_l) or re.search(r"\b\d+\s*(?:x|ms|req|k|m)\b", clean_l, re.IGNORECASE))
            
            if is_bullet and not has_metric and len(bullet_improvements) < 3:
                raw_text = clean_l.lstrip("-*•▪ ").strip()
                action_verb = self.ACTION_VERBS[len(bullet_improvements) % len(self.ACTION_VERBS)]
                metric_clause = self.METRIC_TEMPLATES[metric_idx % len(self.METRIC_TEMPLATES)]
                metric_idx += 1
                
                # Contextually enhance
                enhanced_text = f"{action_verb} core workflows for {raw_text.lower().rstrip('.')}, {metric_clause}."
                optimized_line = f"- {enhanced_text}"
                optimized_exp_lines.append(optimized_line)
                
                bullet_improvements.append({
                    "original": raw_text,
                    "optimized": enhanced_text,
                    "rationale": "Quantified impact using Google X-Y-Z achievement formula and active leadership verb."
                })
            else:
                optimized_exp_lines.append(line)

        exp_after = "\n".join(optimized_exp_lines)

        # 5. Assemble Full Optimized Resume Text
        optimized_resume_text = (
            f"{sections.get('other', '').strip()}\n\n"
            f"Professional Summary\n{summary_after}\n\n"
            f"Technical Skills\n{skills_after}\n\n"
            f"Work Experience\n{exp_after}\n\n"
            f"Education\n{sections.get('education', '').strip()}"
        ).strip()

        # 6. Re-score Optimized Resume with Smart Match Engine
        optimized_analysis = scoring_engine.analyze(
            resume_text=optimized_resume_text,
            jd_text=jd_text,
            resume_filename=f"Optimized_{resume_filename}",
            jd_title=jd_title
        )

        original_score = original_analysis.get("overall_score", 0)
        optimized_score = optimized_analysis.get("overall_score", 0)
        score_boost = round(max(0, optimized_score - original_score), 1)

        return {
            "original_score": original_score,
            "optimized_score": optimized_score,
            "score_boost": score_boost,
            "original_scores": original_analysis.get("scores", {}),
            "optimized_scores": optimized_analysis.get("scores", {}),
            "summary_changes": {
                "before": summary_before[:300] + ("..." if len(summary_before) > 300 else ""),
                "after": summary_after
            },
            "skills_added": skills_to_inject,
            "bullet_improvements": bullet_improvements,
            "optimized_resume_text": optimized_resume_text,
            "optimized_analysis": optimized_analysis
        }

resume_optimizer = ResumeOptimizer()
