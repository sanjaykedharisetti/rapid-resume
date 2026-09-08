import React from "react";
import { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  title: string;
  score: number;
  weight: number;
  icon: LucideIcon;
  description?: string;
  accentColor?: "blue" | "emerald" | "purple" | "indigo" | "amber";
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  weight,
  icon: Icon,
  description,
  accentColor = "blue",
}) => {
  const colorStyles = {
    blue: {
      bar: "bg-blue-600",
      iconBg: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    emerald: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    purple: {
      bar: "bg-purple-600",
      iconBg: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
    },
    indigo: {
      bar: "bg-indigo-600",
      iconBg: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100",
    },
    amber: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
  }[accentColor];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorStyles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{title}</h4>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {weight}% Weight
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-slate-900">{Math.round(score)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${colorStyles.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {description && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{description}</p>
      )}
    </div>
  );
};
