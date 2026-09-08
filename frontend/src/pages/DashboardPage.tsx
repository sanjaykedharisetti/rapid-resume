import React from "react";
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck2,
  BrainCircuit,
  Sliders,
  CheckCircle,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";

interface DashboardPageProps {
  onStartAnalyze: () => void;
  onHowItWorks: () => void;
  onLoadPreset: (presetKey: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartAnalyze,
  onHowItWorks,
  onLoadPreset,
}) => {
  const samplePresets = [
    { key: "ml", title: "ML Engineer Match", subtitle: "Senior ML Resume vs Cloud AI JD", scoreBadge: "~85-92% High Match" },
    { key: "backend", title: "Backend Developer Match", subtitle: "Junior Python Resume vs FinTech JD", scoreBadge: "~65-75% Moderate" },
    { key: "frontend", title: "Frontend React Match", subtitle: "React Dev DOCX vs PixelPulse JD", scoreBadge: "~88-95% High Match" },
    { key: "mismatch", title: "Cross-Domain Contrast", subtitle: "Frontend Dev DOCX vs ML Engineer JD", scoreBadge: "~35-45% Low Match" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white p-8 sm:p-16 border border-slate-800 shadow-2xl">
        {/* Glow circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRODUCTION-GRADE NLP HYBRID MATCH ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
            AI RESUME{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              MATCHING
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Discover how well your resume matches your dream job. Matchly AI employs Sentence Transformers and canonical skill normalization to compute transparent, explainable compatibility scores.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartAnalyze}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center space-x-2"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onHowItWorks}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center space-x-2 hover:text-white"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Pills */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800 text-xs">
          <div>
            <span className="font-extrabold text-white text-base block">40%</span>
            <span className="text-slate-400">Required Skills Weight</span>
          </div>
          <div>
            <span className="font-extrabold text-white text-base block">25%</span>
            <span className="text-slate-400">Semantic Embeddings</span>
          </div>
          <div>
            <span className="font-extrabold text-white text-base block">20%</span>
            <span className="text-slate-400">Experience Analysis</span>
          </div>
          <div>
            <span className="font-extrabold text-white text-base block">100%</span>
            <span className="text-slate-400">Explainable Scoring</span>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Engineered for Precision &amp; Transparency
          </h2>
          <p className="text-sm text-slate-500">
            No random percentages or simulated numbers. Every metric is computed by our real NLP pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              NLP Resume Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Extracts text from real PDF and DOCX documents with PyMuPDF and python-docx. Segmenting resumes into structured sections and normalizing 100+ canonical technical and soft skills.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Multi-token Alias Normalization</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Semantic AI Matching
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Embeddings powered by Sentence Transformers (<code className="font-mono text-purple-600">all-MiniLM-L6-v2</code>) recognize contextual similarity even when phrasing differs—granting partial credit for domain experience.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-purple-600 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Cosine Dense Embedding Similarity</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Personalized Recommendations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Generates constructive, actionable advice strictly based on detected gaps. Pinpoints missing required skills, unquantified bullets, and cloud infrastructure competencies.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Honest Gap-Based Optimization</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-Start 1-Click Presets */}
      <section className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                1-Click Preset Test Scenarios
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly evaluate the Smart Match Engine using our pre-built benchmark resumes and job postings
            </p>
          </div>
          <button
            onClick={onStartAnalyze}
            className="mt-3 sm:mt-0 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Or upload your own files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {samplePresets.map((preset) => (
            <div
              key={preset.key}
              onClick={() => onLoadPreset(preset.key)}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 mb-2 inline-block">
                  {preset.scoreBadge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{preset.subtitle}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>Load &amp; Analyze</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
