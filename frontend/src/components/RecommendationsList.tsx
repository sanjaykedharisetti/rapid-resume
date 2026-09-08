import React from "react";
import { Lightbulb, ArrowRight, Target, BarChart2, FileEdit } from "lucide-react";
import { RecommendationItem } from "../types";

interface RecommendationsListProps {
  recommendations: RecommendationItem[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "skill_gap":
        return { label: "Skill Gap", icon: Target, bg: "bg-red-50 text-red-700 border-red-200" };
      case "metrics":
        return { label: "Impact & Metrics", icon: BarChart2, bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "experience_weakness":
        return { label: "Experience Scope", icon: FileEdit, bg: "bg-amber-50 text-amber-700 border-amber-200" };
      default:
        return { label: "Strategic Advice", icon: Lightbulb, bg: "bg-purple-50 text-purple-700 border-purple-200" };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center space-x-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            How to Improve Your Match
          </h3>
          <p className="text-xs text-slate-500">
            Actionable optimization recommendations synthesized directly from detected gaps
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No improvement recommendations required—profile demonstrates comprehensive alignment!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {recommendations.map((item, index) => {
            const badge = getTypeBadge(item.type);
            const BadgeIcon = badge.icon;
            const numberFormatted = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.id || index}
                className="rounded-xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-blue-500">
                      {numberFormatted}
                    </span>
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3 h-3 mr-1" />
                      {badge.label}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70">
                  <div className="flex items-start space-x-1.5 text-xs text-blue-700 font-medium">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item.action}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
