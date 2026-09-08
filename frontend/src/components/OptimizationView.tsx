import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  FileText,
  Layers,
  Award,
  Cpu,
  BarChart2,
  X
} from "lucide-react";
import { OptimizationResponse } from "../types";
import { getReportDownloadUrl, getOptimizedResumeDownloadUrl } from "../services/api";

interface OptimizationViewProps {
  optimizationData: OptimizationResponse;
  onBackToOriginal: () => void;
}

export const OptimizationView: React.FC<OptimizationViewProps> = ({
  optimizationData,
  onBackToOriginal,
}) => {
  const [activeTab, setActiveTab] = useState<"bullets" | "skills" | "summary" | "resume">("bullets");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizationData.optimized_resume_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const origScores = optimizationData.original_scores;
  const optScores = optimizationData.optimized_scores;

  return (
    <div className="space-y-8 transition-opacity duration-300 opacity-100">
      {/* 1. Hero Score Boost Comparison Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI ATS OPTIMIZATION COMPLETE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Resume Compatibility Boosted
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Missing requirements integrated, professional summary aligned, and experience bullet points enhanced with quantifiable metrics.
            </p>
          </div>

          {/* Big Before vs After Score Badges */}
          <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shrink-0 shadow-lg">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Original</span>
              <span className="text-3xl font-extrabold text-amber-400">
                {Math.round(optimizationData.original_score)}%
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-emerald-400 font-bold text-lg">&rarr;</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30">
                +{Math.round(optimizationData.score_boost)}%
              </span>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Optimized</span>
              <span className="text-3xl font-black text-emerald-400">
                {Math.round(optimizationData.optimized_score)}%
              </span>
            </div>
          </div>
        </div>

        {/* Dimension Comparison Mini Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block text-[10px]">Required Skills</span>
            <span className="text-slate-300">{Math.round(origScores.required_skills)}%</span> &rarr;{" "}
            <span className="text-emerald-400 font-bold">{Math.round(optScores.required_skills)}%</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block text-[10px]">Semantic Similarity</span>
            <span className="text-slate-300">{Math.round(origScores.semantic_similarity)}%</span> &rarr;{" "}
            <span className="text-emerald-400 font-bold">{Math.round(optScores.semantic_similarity)}%</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block text-[10px]">Experience Match</span>
            <span className="text-slate-300">{Math.round(origScores.experience)}%</span> &rarr;{" "}
            <span className="text-emerald-400 font-bold">{Math.round(optScores.experience)}%</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block text-[10px]">Preferred Skills</span>
            <span className="text-slate-300">{Math.round(origScores.preferred_skills)}%</span> &rarr;{" "}
            <span className="text-emerald-400 font-bold">{Math.round(optScores.preferred_skills)}%</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-slate-400 block text-[10px]">Education Match</span>
            <span className="text-emerald-400 font-bold">{Math.round(optScores.education)}%</span>
          </div>
        </div>
      </div>

      {/* 2. Export & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToOriginal}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          <span>&larr; View Original Analysis</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? "Copied!" : "Copy Resume Text"}</span>
          </button>

          <a
            href={getOptimizedResumeDownloadUrl(optimizationData.analysis_id)}
            download
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Optimized Resume (PDF)</span>
          </a>

          <a
            href={getReportDownloadUrl(optimizationData.analysis_id)}
            download
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Optimization Audit Report (PDF)</span>
          </a>
        </div>
      </div>

      {/* 3. Tracked Changes Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Tracked Optimization Changes
            </h3>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("bullets")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "bullets" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bullet Enhancements ({optimizationData.bullet_improvements.length})
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "skills" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Injected Keywords ({optimizationData.skills_added.length})
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "summary" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Summary Refinement
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "resume" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Full Optimized Text
            </button>
          </div>
        </div>

        {/* TAB 1: BULLET POINT TRANSFORMATIONS */}
        {activeTab === "bullets" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Weak or passive experience statements transformed into high-impact accomplishments using Google's X-Y-Z quantifiable metric formula:
            </p>
            {optimizationData.bullet_improvements.map((b, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Transformation #{idx + 1}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Google X-Y-Z Metric Enhancement
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50/50 border border-red-200 rounded-lg text-xs text-slate-700">
                    <span className="font-bold text-red-700 block mb-1">Original Bullet (Passive / No Metric):</span>
                    "{b.original}"
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-slate-800">
                    <span className="font-bold text-emerald-800 block mb-1">Optimized Bullet (Quantified Impact):</span>
                    "{b.optimized}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: INJECTED KEYWORDS */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              The following essential and preferred technical keywords were missing from the original profile and have been integrated into your Skills section:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {optimizationData.skills_added.map((s, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{s.name}</span>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                    {s.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROFESSIONAL SUMMARY */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Original Summary
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{optimizationData.summary_changes.before || "No distinct summary provided."}"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refined Professional Summary</span>
              </span>
              <p className="text-xs text-slate-900 leading-relaxed font-medium">
                "{optimizationData.summary_changes.after}"
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: FULL OPTIMIZED TEXT */}
        {activeTab === "resume" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Complete revised resume text ready for copy/pasting or downloading as PDF:
              </p>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {optimizationData.optimized_resume_text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
