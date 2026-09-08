import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sparkles, Brain, Cpu, Search, Layers, Compass, Trophy } from "lucide-react";

interface AnalysisProgressModalProps {
  isOpen: boolean;
  currentStage: number; // 0 to 7
}

export const STAGES = [
  { id: 0, title: "Resume Uploaded & Validated", icon: CheckCircle2 },
  { id: 1, title: "Extracting Document Text (PDF/DOCX)", icon: Search },
  { id: 2, title: "Processing NLP & Section Segmentation", icon: Layers },
  { id: 3, title: "Finding & Normalizing Skills", icon: Cpu },
  { id: 4, title: "Understanding Job Requirements & Experience", icon: Brain },
  { id: 5, title: "Calculating Semantic Similarity (all-MiniLM-L6-v2)", icon: Compass },
  { id: 6, title: "Executing Weighted Smart Match Engine", icon: Trophy },
  { id: 7, title: "Generating Actionable Recommendations", icon: Sparkles },
];

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  isOpen,
  currentStage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Background ambient lighting */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI Match Radar Running
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing resume against job requirements through our multi-tiered NLP pipeline
          </p>
        </div>

        {/* Stages list */}
        <div className="relative z-10 space-y-2.5">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = currentStage > idx;
            const isCurrent = currentStage === idx;

            return (
              <div
                key={stage.id}
                className={`flex items-center space-x-3 p-2.5 rounded-xl border text-xs transition-all ${
                  isCompleted
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900 font-medium"
                    : isCurrent
                    ? "bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs scale-[1.01]"
                    : "bg-slate-50/50 border-slate-100 text-slate-400"
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span>{stage.title}</span>
                  {isCurrent && (
                    <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider animate-pulse">
                      Analyzing...
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Done</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-400">
            Powered by PyMuPDF, spaCy, and Sentence Transformers
          </p>
        </div>
      </div>
    </div>
  );
};
