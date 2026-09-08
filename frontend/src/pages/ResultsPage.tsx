import React, { useState } from "react";
import {
  Download,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Cpu,
  Compass,
  CheckCircle2,
  FileText,
  Calendar,
  Wand2,
  Loader2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { MatchAnalysisResponse, OptimizationResponse } from "../types";
import { ScoreGauge } from "../components/ScoreGauge";
import { ScoreCard } from "../components/ScoreCard";
import { AIInsightCard } from "../components/AIInsightCard";
import { SkillCharts } from "../components/SkillCharts";
import { SkillBadgeGroup } from "../components/SkillBadgeGroup";
import { RecommendationsList } from "../components/RecommendationsList";
import { MatchBreakdownFlow } from "../components/MatchBreakdownFlow";
import { OptimizationView } from "../components/OptimizationView";
import { getReportDownloadUrl, optimizeMatch } from "../services/api";

interface ResultsPageProps {
  analysis: MatchAnalysisResponse;
  onNewAnalysis: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  analysis,
  onNewAnalysis,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationData, setOptimizationData] = useState<OptimizationResponse | null>(null);
  const [showOptimizedView, setShowOptimizedView] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (!analysis.id) return;
    setIsDownloading(true);
    try {
      const url = getReportDownloadUrl(analysis.id);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const prefix = (showOptimizedView || analysis.is_optimized) ? "Matchly_Optimized_Report_" : "Matchly_Report_";
      a.download = `${prefix}${analysis.resume_filename.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Failed to download PDF report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRunOptimize = async () => {
    if (!analysis.id) return;
    setErrorMessage(null);
    setIsOptimizing(true);
    try {
      const optResult = await optimizeMatch(analysis.id);
      setOptimizationData(optResult);
      setShowOptimizedView(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const weights = analysis.weights || {
    required_skills: 40,
    semantic_similarity: 25,
    experience: 20,
    preferred_skills: 10,
    education: 5,
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Navigation & Action Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <button
            onClick={onNewAnalysis}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors mt-0.5"
            title="Start New Analysis"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-100">
                Analysis #{analysis.id || "Live"}
              </span>
              {(showOptimizedView || analysis.is_optimized) && (
                <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>AI Optimized</span>
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {analysis.created_at
                  ? new Date(analysis.created_at).toLocaleDateString()
                  : "Just now"}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
              Match Radar: {analysis.jd_title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Resume: <b>{analysis.resume_filename}</b></span>
            </p>
          </div>
        </div>

        {/* Primary Actions: Optimize Score, Download PDF, Toggle Views */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* OPTIMIZE SCORE BUTTON */}
          {!optimizationData && !analysis.is_optimized ? (
            <button
              onClick={handleRunOptimize}
              disabled={isOptimizing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Optimizing Score...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-emerald-200" />
                  <span>Optimize Score with AI</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowOptimizedView(!showOptimizedView)}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showOptimizedView ? "View Original Analysis" : "View Optimized Audit"}</span>
            </button>
          )}

          {analysis.id && (
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Generating PDF..." : "Download Report (PDF)"}</span>
            </button>
          )}

          <button
            onClick={onNewAnalysis}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            New Match
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* IF OPTIMIZED VIEW IS ACTIVE, RENDER OPTIMIZATION VIEW */}
      {showOptimizedView && optimizationData ? (
        <OptimizationView
          optimizationData={optimizationData}
          onBackToOriginal={() => setShowOptimizedView(false)}
        />
      ) : (
        <>
          {/* OPTIMIZE CALLOUT BANNER (if not optimized yet) */}
          {!optimizationData && !analysis.is_optimized && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Want to increase this candidate's ATS Match Score?
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Our AI Optimizer automatically incorporates missing skills, aligns the professional summary, and quantifies experience bullet points.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunOptimize}
                disabled={isOptimizing}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-emerald-200" />
                    <span>Optimize Score with AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Primary Score & Breakdown Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Big Circular Gauge */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Match Score
              </span>
              <ScoreGauge
                score={analysis.overall_score}
                matchLevel={analysis.match_level}
                size={220}
              />
              <p className="text-xs text-slate-500 mt-4 max-w-xs leading-relaxed">
                Computed by the Smart Match Engine across 5 weighted dimensions
              </p>
            </div>

            {/* Right Column: 5 Score Metric Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ScoreCard
                title="Required Skills"
                score={analysis.scores.required_skills}
                weight={weights.required_skills}
                icon={CheckCircle2}
                accentColor="blue"
                description="Core mandatory skills matched against JD"
              />

              <ScoreCard
                title="Semantic Match"
                score={analysis.scores.semantic_similarity}
                weight={weights.semantic_similarity}
                icon={Compass}
                accentColor="purple"
                description="Sentence Transformers context similarity"
              />

              <ScoreCard
                title="Experience"
                score={analysis.scores.experience}
                weight={weights.experience}
                icon={Briefcase}
                accentColor="emerald"
                description={analysis.experience.details}
              />

              <ScoreCard
                title="Preferred Skills"
                score={analysis.scores.preferred_skills}
                weight={weights.preferred_skills}
                icon={Sparkles}
                accentColor="amber"
                description="Bonus qualifications and nice-to-haves"
              />

              <ScoreCard
                title="Education"
                score={analysis.scores.education}
                weight={weights.education}
                icon={GraduationCap}
                accentColor="indigo"
                description={analysis.education.details}
              />
            </div>
          </div>

          {/* AI Match Insight Banner */}
          <AIInsightCard
            insight={analysis.insight}
            matchLevel={analysis.match_level}
            overallScore={analysis.overall_score}
            experience={analysis.experience}
            education={analysis.education}
          />

          {/* Charts Visualization Section */}
          <SkillCharts
            scores={analysis.scores}
            matchedSkills={analysis.matched_skills}
            partialSkills={analysis.partial_skills}
            missingSkills={analysis.missing_skills}
          />

          {/* Skills Analysis Badges (Matched, Partial, Missing) */}
          <SkillBadgeGroup
            matchedSkills={analysis.matched_skills}
            partialSkills={analysis.partial_skills}
            missingSkills={analysis.missing_skills}
          />

          {/* Recommendations List */}
          <RecommendationsList recommendations={analysis.recommendations} />

          {/* Pipeline Visual Flowchart */}
          <MatchBreakdownFlow overallScore={analysis.overall_score} />
        </>
      )}
    </div>
  );
};
