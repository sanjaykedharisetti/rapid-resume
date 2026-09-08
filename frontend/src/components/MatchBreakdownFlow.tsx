import React from "react";
import { FileText, Cpu, Briefcase, GraduationCap, Compass, Trophy, ArrowRight } from "lucide-react";

interface MatchBreakdownFlowProps {
  overallScore: number;
}

export const MatchBreakdownFlow: React.FC<MatchBreakdownFlowProps> = ({ overallScore }) => {
  const steps = [
    { title: "Resume Content", desc: "PDF/DOCX Text Parser", icon: FileText, color: "text-slate-600 bg-slate-100" },
    { title: "Skill Normalization", desc: "Canonical Mapping", icon: Cpu, color: "text-blue-600 bg-blue-50" },
    { title: "Experience Matching", desc: "Tenure & Roles", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { title: "Education Check", desc: "Degree Verification", icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
    { title: "Semantic Embeddings", desc: "all-MiniLM-L6-v2", icon: Compass, color: "text-cyan-600 bg-cyan-50" },
    { title: "Final Smart Score", desc: `${overallScore}% Explainable`, icon: Trophy, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1">
        Smart Match Processing Pipeline
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        How Matchly AI systematically transforms raw candidate documents into calibrated scores
      </p>

      {/* Pipeline steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-2xs ${step.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mb-0.5">Stage 0{idx + 1}</span>
              <h4 className="text-xs font-bold text-slate-800 leading-tight">{step.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
