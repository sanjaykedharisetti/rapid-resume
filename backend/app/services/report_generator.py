import io
from datetime import datetime
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class ReportGenerator:
    """Generates professional executive PDF match reports and optimization audits using ReportLab."""

    @staticmethod
    def generate_pdf(
        analysis_data: Dict[str, Any],
        optimization_data: Optional[Dict[str, Any]] = None
    ) -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        c_primary = colors.HexColor("#0f172a")     # Deep navy
        c_accent = colors.HexColor("#2563eb")      # Electric blue
        c_purple = colors.HexColor("#7c3aed")      # Purple
        c_success = colors.HexColor("#059669")     # Green
        c_warning = colors.HexColor("#d97706")     # Amber
        c_danger = colors.HexColor("#dc2626")      # Red
        c_gray_bg = colors.HexColor("#f8fafc")     # Light gray
        c_text_muted = colors.HexColor("#64748b")

        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontSize=20,
            leading=24,
            textColor=c_primary,
            fontName="Helvetica-Bold",
            spaceAfter=3
        )
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=c_text_muted,
            spaceAfter=10
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontSize=12,
            leading=16,
            textColor=c_primary,
            fontName="Helvetica-Bold",
            spaceBefore=8,
            spaceAfter=5
        )
        body_style = ParagraphStyle(
            "DocBody",
            parent=styles["Normal"],
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#1e293b")
        )
        card_text_style = ParagraphStyle(
            "CardText",
            parent=styles["Normal"],
            fontSize=8.5,
            leading=12,
            textColor=colors.HexColor("#0f172a")
        )

        elements = []

        is_optimized = optimization_data is not None

        # 1. Header
        doc_header = "MATCHLY AI – ATS OPTIMIZATION REPORT" if is_optimized else "MATCHLY AI"
        elements.append(Paragraph(doc_header, title_style))
        elements.append(Paragraph(
            f"Intelligent Resume &amp; Job Description Matching Report &bull; Generated on {datetime.now().strftime('%B %d, %Y')}",
            subtitle_style
        ))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=c_accent, spaceAfter=10))

        # 2. Metadata Banner
        meta_data = [
            [
                Paragraph(f"<b>Candidate Resume:</b> {analysis_data.get('resume_filename', 'Resume')}", body_style),
                Paragraph(f"<b>Target Role:</b> {analysis_data.get('jd_title', 'Job Description')}", body_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[270, 270])
        meta_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), c_gray_bg),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("PADDING", (0, 0), (-1, -1), 6),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 10))

        # 3. Before vs After Score Callout (if optimized) or Standard Callout
        if is_optimized:
            orig_score = optimization_data.get("original_score", analysis_data.get("overall_score", 0))
            opt_score = optimization_data.get("optimized_score", 95)
            score_boost = optimization_data.get("score_boost", opt_score - orig_score)
            
            opt_scores = optimization_data.get("optimized_scores", {})
            orig_scores = optimization_data.get("original_scores", analysis_data.get("scores", {}))

            score_comparison_table = Table([
                [
                    Paragraph(f"<font size=10 color='{c_text_muted.hexval()}'>ORIGINAL ATS SCORE</font><br/><font size=24 color='{c_warning.hexval()}'><b>{orig_score}%</b></font>", ParagraphStyle("ScoreOrig", alignment=1)),
                    Paragraph("<font size=20 color='#3b82f6'><b>&rarr;</b></font>", ParagraphStyle("Arrow", alignment=1)),
                    Paragraph(f"<font size=10 color='{c_text_muted.hexval()}'>OPTIMIZED ATS SCORE</font><br/><font size=24 color='{c_success.hexval()}'><b>{opt_score}%</b></font><br/><font size=9 color='{c_success.hexval()}'><b>(+{score_boost}% Boost)</b></font>", ParagraphStyle("ScoreOpt", alignment=1)),
                    Table([
                        [Paragraph("<b>Metric Dimension</b>", body_style), Paragraph("<b>Original</b>", body_style), Paragraph("<b>Optimized</b>", body_style)],
                        [Paragraph("Required Skills", body_style), Paragraph(f"{orig_scores.get('required_skills', 0)}%", body_style), Paragraph(f"<b>{opt_scores.get('required_skills', 0)}%</b>", body_style)],
                        [Paragraph("Semantic Similarity", body_style), Paragraph(f"{orig_scores.get('semantic_similarity', 0)}%", body_style), Paragraph(f"<b>{opt_scores.get('semantic_similarity', 0)}%</b>", body_style)],
                        [Paragraph("Experience Match", body_style), Paragraph(f"{orig_scores.get('experience', 0)}%", body_style), Paragraph(f"<b>{opt_scores.get('experience', 0)}%</b>", body_style)],
                        [Paragraph("Preferred Skills", body_style), Paragraph(f"{orig_scores.get('preferred_skills', 0)}%", body_style), Paragraph(f"<b>{opt_scores.get('preferred_skills', 0)}%</b>", body_style)],
                    ], colWidths=[130, 65, 65], style=[
                        ("LINEBELOW", (0, 0), (-1, 0), 1, c_accent),
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                        ("PADDING", (0, 0), (-1, -1), 3),
                    ])
                ]
            ], colWidths=[130, 40, 130, 240])
            score_comparison_table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#bfdbfe")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]))
            elements.append(score_comparison_table)
            elements.append(Spacer(1, 10))

            # 4. Optimization Audit Table: Specific changes made
            elements.append(Paragraph("AI Resume Optimization Audit &amp; Tracked Changes", section_heading))
            
            # Skills Added
            skills_added = [s["name"] for s in optimization_data.get("skills_added", [])]
            audit_rows = [
                [
                    Paragraph("<b>Keywords &amp; Skills Incorporated:</b>", body_style),
                    Paragraph(", ".join(skills_added) if skills_added else "Existing skills contextually aligned", body_style)
                ],
                [
                    Paragraph("<b>Professional Summary Refinement:</b>", body_style),
                    Paragraph(optimization_data.get("summary_changes", {}).get("after", "Aligned with target job responsibilities."), body_style)
                ]
            ]
            
            # Bullet point improvements
            bullet_improvements = optimization_data.get("bullet_improvements", [])
            for i, b in enumerate(bullet_improvements[:2]):
                audit_rows.append([
                    Paragraph(f"<b>Bullet #{i+1} Enhancement:</b>", body_style),
                    Paragraph(f"<i>Original:</i> \"{b.get('original', '')}\"<br/><font color='{c_success.hexval()}'><b>Optimized (Google X-Y-Z):</b> \"{b.get('optimized', '')}\"</font>", body_style)
                ])

            audit_table = Table(audit_rows, colWidths=[150, 390])
            audit_table.setStyle(TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("BACKGROUND", (0, 0), (0, -1), c_gray_bg),
                ("PADDING", (0, 0), (-1, -1), 5),
            ]))
            elements.append(audit_table)
            elements.append(Spacer(1, 10))

        else:
            # Standard single score table
            overall_score = analysis_data.get("overall_score", 0)
            match_level = analysis_data.get("match_level", "Match")
            score_color = c_success if overall_score >= 80 else (c_accent if overall_score >= 60 else (c_warning if overall_score >= 40 else c_danger))
            scores = analysis_data.get("scores", {})

            score_table = Table([
                [
                    Paragraph(f"<font size=28 color='{score_color.hexval()}'><b>{overall_score}%</b></font><br/><font size=11 color='{c_primary.hexval()}'><b>{match_level}</b></font><br/><font size=8 color='{c_text_muted.hexval()}'>Overall Match Score</font>", ParagraphStyle("ScoreCallout", alignment=1)),
                    Table([
                        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Weight</b>", body_style), Paragraph("<b>Score</b>", body_style)],
                        [Paragraph("Required Skills", body_style), Paragraph("40%", body_style), Paragraph(f"<b>{scores.get('required_skills', 0)}%</b>", body_style)],
                        [Paragraph("Semantic Similarity", body_style), Paragraph("25%", body_style), Paragraph(f"<b>{scores.get('semantic_similarity', 0)}%</b>", body_style)],
                        [Paragraph("Experience Match", body_style), Paragraph("20%", body_style), Paragraph(f"<b>{scores.get('experience', 0)}%</b>", body_style)],
                        [Paragraph("Preferred Skills", body_style), Paragraph("10%", body_style), Paragraph(f"<b>{scores.get('preferred_skills', 0)}%</b>", body_style)],
                        [Paragraph("Education Match", body_style), Paragraph("5%", body_style), Paragraph(f"<b>{scores.get('education', 0)}%</b>", body_style)],
                    ], colWidths=[150, 70, 70], style=[
                        ("LINEBELOW", (0, 0), (-1, 0), 1, c_accent),
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                        ("PADDING", (0, 0), (-1, -1), 4),
                    ])
                ]
            ], colWidths=[200, 340])
            score_table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("BACKGROUND", (0, 0), (0, 0), c_gray_bg),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]))
            elements.append(score_table)
            elements.append(Spacer(1, 10))

        # 5. AI Match Insight Box
        elements.append(Paragraph("AI Match Insight", section_heading))
        insight_text = analysis_data.get("insight", "Analysis complete.")
        insight_table = Table([[Paragraph(f"<i>\"{insight_text}\"</i>", card_text_style)]], colWidths=[540])
        insight_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eff6ff")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#bfdbfe")),
            ("PADDING", (0, 0), (-1, -1), 6),
        ]))
        elements.append(insight_table)
        elements.append(Spacer(1, 10))

        # 6. Skills Compatibility Breakdown
        elements.append(Paragraph("Skills Compatibility Breakdown", section_heading))
        matched = [s["name"] for s in analysis_data.get("matched_skills", [])]
        partial = [s["name"] for s in analysis_data.get("partial_skills", [])]
        missing = [s["name"] for s in analysis_data.get("missing_skills", [])]

        skills_summary_data = [
            [
                Paragraph(f"<font color='{c_success.hexval()}'><b>MATCHED ({len(matched)})</b></font>", body_style),
                Paragraph(", ".join(matched) if matched else "None", body_style)
            ],
            [
                Paragraph(f"<font color='{c_warning.hexval()}'><b>PARTIAL ({len(partial)})</b></font>", body_style),
                Paragraph(", ".join(partial) if partial else "None", body_style)
            ],
            [
                Paragraph(f"<font color='{c_danger.hexval()}'><b>MISSING ({len(missing)})</b></font>", body_style),
                Paragraph(", ".join(missing) if missing else "None", body_style)
            ]
        ]
        skills_table = Table(skills_summary_data, colWidths=[120, 420])
        skills_table.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("PADDING", (0, 0), (-1, -1), 5),
            ("BACKGROUND", (0, 0), (0, -1), c_gray_bg),
        ]))
        elements.append(skills_table)
        elements.append(Spacer(1, 10))

        # 7. Recommendations
        recs = analysis_data.get("recommendations", [])
        if recs:
            elements.append(Paragraph("Personalized Improvement Recommendations", section_heading))
            rec_rows = []
            for r in recs[:3]:
                rec_rows.append([
                    Paragraph(f"<b>{r.get('id', 1)}. {r.get('title', 'Recommendation')}</b><br/>{r.get('description', '')}<br/><font color='{c_accent.hexval()}'><b>Action:</b> {r.get('action', '')}</font>", body_style)
                ])
            rec_table = Table(rec_rows, colWidths=[540])
            rec_table.setStyle(TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ffffff")),
                ("PADDING", (0, 0), (-1, -1), 5),
            ]))
            elements.append(rec_table)

        doc.build(elements)
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_clean_resume_pdf(resume_text: str, candidate_name: str = "Candidate Resume") -> io.BytesIO:
        """Builds a formatted, submission-ready PDF of the newly optimized resume."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        styles = getSampleStyleSheet()

        h_style = ParagraphStyle(
            "ResHeading",
            parent=styles["Heading2"],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#1e3a8a"),
            fontName="Helvetica-Bold",
            spaceBefore=10,
            spaceAfter=4
        )
        b_style = ParagraphStyle(
            "ResBody",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#0f172a")
        )
        bullet_style = ParagraphStyle(
            "ResBullet",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#1e293b"),
            leftIndent=12
        )

        elements = []
        lines = resume_text.split("\n")
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                elements.append(Spacer(1, 3))
                continue
            
            # Check for section header
            if stripped.lower() in ["professional summary", "technical skills", "work experience", "education", "projects"]:
                elements.append(Paragraph(stripped, h_style))
                elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#93c5fd"), spaceAfter=4))
            elif stripped.startswith(("-", "*", "•")):
                elements.append(Paragraph(stripped, bullet_style))
            else:
                elements.append(Paragraph(stripped, b_style))

        doc.build(elements)
        buffer.seek(0)
        return buffer

report_generator = ReportGenerator()
