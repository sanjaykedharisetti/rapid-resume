import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { ScoreBreakdown, SkillDetail, MissingSkillDetail } from "../types";

interface SkillChartsProps {
  scores: ScoreBreakdown;
  matchedSkills: SkillDetail[];
  partialSkills: SkillDetail[];
  missingSkills: MissingSkillDetail[];
}

export const SkillCharts: React.FC<SkillChartsProps> = ({
  scores,
  matchedSkills,
  partialSkills,
  missingSkills,
}) => {
  // Bar chart data for scores breakdown
  const barData = [
    { name: "Required Skills", score: Math.round(scores.required_skills), fill: "#2563eb" },
    { name: "Semantic Match", score: Math.round(scores.semantic_similarity), fill: "#7c3aed" },
    { name: "Experience", score: Math.round(scores.experience), fill: "#059669" },
    { name: "Education", score: Math.round(scores.education), fill: "#0284c7" },
    { name: "Preferred Skills", score: Math.round(scores.preferred_skills), fill: "#f59e0b" },
  ];

  // Donut chart data for skills category breakdown
  const pieData = [
    { name: "Matched", value: matchedSkills.length, fill: "#10b981" },
    { name: "Partial", value: partialSkills.length, fill: "#f59e0b" },
    { name: "Missing", value: missingSkills.length, fill: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Horizontal Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Weighted Score Breakdown
          </h3>
          <span className="text-xs text-slate-400">Score against target (0–100%)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 500 }}
                width={105}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, "Match Score"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut Pie Chart */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Skill Compatibility Distribution
          </h3>
          <span className="text-xs text-slate-400">
            Total {matchedSkills.length + partialSkills.length + missingSkills.length} Detected JD Skills
          </span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          {pieData.length === 0 ? (
            <p className="text-xs text-slate-400">No skills to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`donut-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} skills`, name]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span className="text-xs font-semibold text-slate-700">
                      {value} ({entry.payload.value})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
