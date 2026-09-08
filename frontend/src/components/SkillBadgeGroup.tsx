import React, { useState } from "react";
import { CheckCircle2, AlertCircle, HelpCircle, XCircle } from "lucide-react";
import { SkillDetail, MissingSkillDetail } from "../types";

interface SkillBadgeGroupProps {
  matchedSkills: SkillDetail[];
  partialSkills: SkillDetail[];
  missingSkills: MissingSkillDetail[];
}

export const SkillBadgeGroup: React.FC<SkillBadgeGroupProps> = ({
  matchedSkills,
  partialSkills,
  missingSkills,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<{
    name: string;
    type: "matched" | "partial" | "missing";
    details: string;
    category?: string;
  } | null>(null);

  return (
    <div className="space-y-6">
      {/* 1. MATCHED SKILLS */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Matched Skills
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {matchedSkills.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">Click a skill to view match proof</span>
        </div>

        {matchedSkills.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No direct skill matches detected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((s, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setSelectedSkill({
                    name: s.name,
                    type: "matched",
                    details: s.reason || "Exact/normalized match in candidate resume.",
                    category: s.category,
                  })
                }
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{s.name}</span>
                <span className="text-[10px] text-emerald-600 font-normal">({s.category})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. PARTIAL / SEMANTIC MATCHES */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Partial / Semantic Matches
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
              {partialSkills.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">Semantically related concepts</span>
        </div>

        {partialSkills.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No partial semantic matches.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {partialSkills.map((s, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setSelectedSkill({
                    name: s.name,
                    type: "partial",
                    details: s.reason || `Correlated with candidate experience in '${s.related_resume_skill}'.`,
                    category: s.category,
                  })
                }
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{s.name}</span>
                {s.similarity && (
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    {Math.round(s.similarity * 100)}%
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. MISSING SKILLS */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Missing Skills
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
              {missingSkills.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">Identified requirements absent from resume</span>
        </div>

        {missingSkills.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No missing skills detected! Perfect alignment.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((s, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setSelectedSkill({
                    name: s.name,
                    type: "missing",
                    details: s.reason || "Present in job requirements but absent from resume.",
                    category: s.category,
                  })
                }
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition-colors shadow-2xs"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>{s.name}</span>
                <span
                  className={`text-[9px] px-1 rounded uppercase tracking-wider ${
                    s.importance === "required"
                      ? "bg-red-200 text-red-900 font-bold"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {s.importance}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal / Flyout for Selected Skill Reason */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl transition-all duration-200 opacity-100 scale-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    selectedSkill.type === "matched"
                      ? "bg-emerald-500"
                      : selectedSkill.type === "partial"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                />
                <h4 className="text-base font-bold text-slate-900">{selectedSkill.name}</h4>
                {selectedSkill.category && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {selectedSkill.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                NLP Classification Reasoning
              </p>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedSkill.details}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSkill(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
