export interface SkillDetail {
  name: string;
  category: string;
  match_type: "exact" | "normalized" | "semantic";
  importance: "required" | "preferred";
  similarity?: number;
  related_resume_skill?: string;
  reason?: string;
}

export interface MissingSkillDetail {
  name: string;
  category: string;
  importance: "required" | "preferred";
  reason: string;
}

export interface ExperienceAnalysis {
  required: number | null;
  detected: number | null;
  status: "meets_requirement" | "exceeds_requirement" | "below_requirement" | "undetermined" | "not_specified";
  details: string;
}

export interface EducationAnalysis {
  status: "satisfied" | "partially_satisfied" | "undetermined" | "not_specified";
  detected_degrees: string[];
  required_degrees: string[];
  details: string;
}

export interface RecommendationItem {
  id: number;
  title: string;
  type: "skill_gap" | "experience_weakness" | "formatting" | "metrics";
  description: string;
  action: string;
}

export interface ScoreBreakdown {
  required_skills: number;
  semantic_similarity: number;
  experience: number;
  education: number;
  preferred_skills: number;
}

export interface MatchAnalysisResponse {
  id: number;
  resume_filename: string;
  jd_title: string;
  overall_score: number;
  match_level: string;
  scores: ScoreBreakdown;
  weights: {
    required_skills: number;
    semantic_similarity: number;
    experience: number;
    preferred_skills: number;
    education: number;
  };
  matched_skills: SkillDetail[];
  partial_skills: SkillDetail[];
  missing_skills: MissingSkillDetail[];
  experience: ExperienceAnalysis;
  education: EducationAnalysis;
  insight: string;
  recommendations: RecommendationItem[];
  breakdown?: {
    total_required_skills: number;
    matched_required_skills: number;
    partial_required_skills: number;
    total_preferred_skills: number;
    matched_preferred_skills: number;
    partial_preferred_skills: number;
    sections_compared: {
      summary_similarity: number;
      experience_similarity: number;
      skills_similarity: number;
    };
  };
  is_optimized?: boolean;
  optimized_score?: number | null;
  optimization_data?: any;
  optimized_resume_text?: string | null;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  resume_filename: string;
  jd_title: string;
  overall_score: number;
  match_level: string;
  is_optimized?: boolean;
  optimized_score?: number | null;
  created_at: string;
}

export interface HistoryListResponse {
  total: number;
  items: HistoryItem[];
}

export interface OptimizationResponse {
  analysis_id: number;
  original_score: number;
  optimized_score: number;
  score_boost: number;
  original_scores: ScoreBreakdown;
  optimized_scores: ScoreBreakdown;
  summary_changes: {
    before: string;
    after: string;
  };
  skills_added: Array<{
    name: string;
    category: string;
    importance: string;
  }>;
  bullet_improvements: Array<{
    original: string;
    optimized: string;
    rationale: string;
  }>;
  optimized_resume_text: string;
  optimized_analysis: MatchAnalysisResponse;
}
