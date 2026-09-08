import React from "react";

interface ScoreGaugeProps {
  score: number;
  matchLevel: string;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  matchLevel,
  size = 220,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color mappings per specification:
  // 0–39 = Red, 40–59 = Orange, 60–79 = Yellow/Blue, 80–100 = Green
  const getColorConfig = (val: number) => {
    if (val >= 80) {
      return {
        stroke: "#10b981", // Emerald Green
        text: "text-emerald-600",
        badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
        glow: "rgba(16, 185, 129, 0.25)",
      };
    } else if (val >= 60) {
      return {
        stroke: "#2563eb", // Electric Blue
        text: "text-blue-600",
        badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
        glow: "rgba(37, 99, 235, 0.25)",
      };
    } else if (val >= 40) {
      return {
        stroke: "#f59e0b", // Amber / Orange
        text: "text-amber-600",
        badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
        glow: "rgba(245, 158, 11, 0.25)",
      };
    } else {
      return {
        stroke: "#ef4444", // Red
        text: "text-red-600",
        badgeBg: "bg-red-50 border-red-200 text-red-700",
        glow: "rgba(239, 68, 68, 0.25)",
      };
    }
  };

  const config = getColorConfig(score);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circular Ring */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: "stroke-dashoffset 1.4s ease-out, stroke 0.5s ease",
              filter: `drop-shadow(0 0 8px ${config.glow})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black tracking-tight text-slate-900">
            {score}
            <span className="text-2xl font-bold text-slate-400">%</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Match Index
          </span>
        </div>
      </div>

      {/* Match Level Status Badge */}
      <div className="mt-3">
        <span
          className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold border shadow-xs ${config.badgeBg}`}
        >
          <span
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: config.stroke }}
          />
          {matchLevel}
        </span>
      </div>
    </div>
  );
};
