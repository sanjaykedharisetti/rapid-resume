import React from "react";
import {
  Brain,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FileText,
  Calculator,
  Compass
} from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 inline-block mb-3">
          Architecture &amp; Methodology
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How Matchly AI Evaluates Compatibility
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
          Unlike primitive keyword-counting tools, Matchly AI uses a multi-tiered hybrid NLP pipeline combining semantic embeddings, canonical alias normalization, and experience validation.
        </p>
      </div>

      {/* Formula & Weights Callout */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2.5 mb-4">
          <Calculator className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            The Smart Match Engine Weighted Formula
          </h2>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 font-mono text-xs sm:text-sm text-blue-200 overflow-x-auto leading-relaxed mb-6">
          Score = (0.40 × Required Skills) + (0.25 × Semantic Similarity) + (0.20 × Experience Match) + (0.10 × Preferred Skills) + (0.05 × Education Match)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xl font-extrabold text-blue-400 block">40%</span>
            <span className="text-slate-300 font-semibold">Required Skills</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xl font-extrabold text-purple-400 block">25%</span>
            <span className="text-slate-300 font-semibold">Semantic Match</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xl font-extrabold text-emerald-400 block">20%</span>
            <span className="text-slate-300 font-semibold">Experience</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xl font-extrabold text-amber-400 block">10%</span>
            <span className="text-slate-300 font-semibold">Preferred Skills</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <span className="text-xl font-extrabold text-cyan-400 block">5%</span>
            <span className="text-slate-300 font-semibold">Education</span>
          </div>
        </div>
      </div>

      {/* 4 Deep Dives */}
      <div className="space-y-6">
        {/* Tier 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Multi-token Skill Normalization
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Candidate resumes use hundreds of abbreviations and variations for identical concepts. Matchly AI normalizes variations into authoritative canonical skills:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">RAW STRING</span>
              <span className="font-semibold text-slate-800">ML / Machine Learning</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">RAW STRING</span>
              <span className="font-semibold text-slate-800">React.js → React</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">RAW STRING</span>
              <span className="font-semibold text-slate-800">Postgres → PostgreSQL</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">RAW STRING</span>
              <span className="font-semibold text-slate-800">AWS Cloud → AWS</span>
            </div>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Dense Vector Semantic Embeddings (<code className="font-mono text-purple-600">all-MiniLM-L6-v2</code>)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Traditional keyword search fails when candidates express relevant background in varied phrasing. Matchly AI projects text segments into 384-dimensional dense vector embeddings:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
            <li><b>Resume Summary vs. JD Overview:</b> Measures foundational domain and mission alignment.</li>
            <li><b>Resume Experience vs. JD Responsibilities:</b> Measures day-to-day workflow harmony.</li>
            <li><b>Resume Competencies vs. Unmatched Skills:</b> Identifies partial semantic credit (e.g., <i>"predictive modeling with Scikit-learn"</i> crediting <i>"Machine Learning"</i>).</li>
          </ul>
        </div>

        {/* Tier 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Experience &amp; Education Verification
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Extracts tenure intervals (e.g. <i>"2020 - Present"</i>) and explicit declarations (e.g. <i>"4+ years of professional experience"</i>). If the JD targets 3 years and the candidate has 4 years, full experience credit (100%) is awarded. If experience cannot be confidently verified, the system returns an honest <i>"Experience could not be confidently determined"</i> status rather than inventing fabricated scores.
          </p>
        </div>

        {/* Tier 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Actionable Gap-Based Recommendations
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recommendations are generated solely from genuine gaps detected during execution. Missing required skills are highlighted with guidance on how to represent relevant projects, and vague bullet points lacking metrics are flagged to be rewritten using quantifiable achievement formulas.
          </p>
        </div>
      </div>
    </div>
  );
};
