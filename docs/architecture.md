# Matchly AI Architecture & NLP Pipeline

Matchly AI is designed with clean modular service architecture to ensure explainability, high precision, and fast inference.

## 1. Pipeline Stages

1. **Document Ingestion (`DocumentParser`)**:
   - Native binary parsing of `.pdf` files via PyMuPDF (`fitz`).
   - Native parsing of `.docx` documents via `python-docx`, extracting paragraph and table contents.
   - Rejection of files larger than 15 MB or encrypted documents.

2. **Text Normalization & Segmentation (`TextPreprocessor`)**:
   - Regex-based header identification to parse resumes into:
     - `summary`
     - `experience`
     - `skills`
     - `education`
     - `projects`
   - Parses Job Descriptions into:
     - `overview`
     - `responsibilities`
     - `requirements`
     - `preferred`

3. **Taxonomy & Skill Normalization (`SkillNormalizer`)**:
   - Maps 100+ aliases and multi-token acronyms into canonical standards.
   - Categorized into 14 distinct disciplines: Programming, Frontend, Backend, Database, Machine Learning, Deep Learning, NLP, Data Science, Cloud, DevOps, Testing, Tools, Soft Skills.

4. **Skill Extraction & Classification (`SkillExtractor`)**:
   - Discovers skills using length-prioritized regex boundary matching.
   - Classifies JD skills into **Required** (found in requirements or preceded by must-have clauses) and **Preferred** (found in nice-to-have or bonus clauses).

5. **Dense Vector Embeddings (`SemanticMatcher`)**:
   - Utilizes `sentence-transformers/all-MiniLM-L6-v2`.
   - Produces 384-dimensional normalized vectors.
   - Cosine similarity comparisons:
     - Resume Experience vs. JD Responsibilities
     - Resume Summary vs. JD Overview
     - Candidate Competencies vs. Unmatched Skills (granting partial/semantic credit).

6. **Experience & Education Validation (`ExperienceAnalyzer` & `EducationAnalyzer`)**:
   - Extracts explicit tenure statements and employment year intervals.
   - Evaluates degree levels (Doctorate, Masters, Bachelors, Associate) and fields of study against role requirements.

7. **Smart Match Engine Scoring (`ScoringEngine`)**:
   - Combines the 5 weighted dimensions.
   - Synthesizes explainable AI Match Insight paragraphs.

8. **Gap-based Recommendations (`RecommendationEngine`)**:
   - Detects missing required skills, absent infrastructure tools, and bullet points lacking quantifiable metrics.

9. **Reporting (`ReportGenerator`)**:
   - Builds publication-quality PDF reports via ReportLab.
