import React from "react";
import { Sparkles, BrainCircuit, Check, AlertTriangle } from "lucide-react";
import { ExperienceAnalysis, EducationAnalysis } from "../types";

interface AIInsightCardProps {
  insight: string;
  matchLevel: string;
  overallScore: number;
  experience: ExperienceAnalysis;
  education: EducationAnalysis;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  matchLevel,
  overallScore,
  experience,
  education,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-blue-800/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  AI Match Radar Insight
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30">
                  Smart Match Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Natural Language synthesis of profile strengths and requirement gaps
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-200 backdrop-blur-xs">
            {matchLevel} ({overallScore}%)
          </span>
        </div>

        {/* Dynamic Insight Narrative */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 backdrop-blur-xs mb-4">
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal italic">
            "{insight}"
          </p>
        </div>

        {/* Bottom Verification Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="flex items-start space-x-2 bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/40">
            {experience.status === "meets_requirement" || experience.status === "exceeds_requirement" ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold text-slate-200 block">Experience Check:</span>
              <span className="text-slate-400 text-[11px] leading-snug">{experience.details}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/40">
            {education.status === "satisfied" || education.status === "not_specified" ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold text-slate-200 block">Education Qualification:</span>
              <span className="text-slate-400 text-[11px] leading-snug">{education.details}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
