import React, { useEffect, useState } from "react";
import { History, Trash2, Eye, Download, Calendar, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { HistoryItem, MatchAnalysisResponse } from "../types";
import { getHistory, deleteHistoryItem, getMatchAnalysis, getReportDownloadUrl } from "../services/api";

interface HistoryPageProps {
  onViewAnalysis: (analysis: MatchAnalysisResponse) => void;
  onNewAnalysis: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onViewAnalysis,
  onNewAnalysis,
}) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await getHistory();
      setItems(data.items);
    } catch (err: any) {
      setErrorMessage("Failed to load historical analyses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this analysis record?")) return;
    try {
      await deleteHistoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const handleSelect = async (id: number) => {
    try {
      const record = await getMatchAnalysis(id);
      onViewAnalysis(record);
    } catch (err) {
      alert("Failed to load full analysis details.");
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 60) return "bg-blue-50 text-blue-700 border-blue-200";
    if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Analysis History
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review previous match evaluations, view breakdowns, or download PDF reports
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchHistory}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Run New Match
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading past analyses from database...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Analyses Recorded Yet</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
            Upload your resume and a job description to perform your first match analysis!
          </p>
          <button
            onClick={onNewAnalysis}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${getScoreBadge(
                    item.overall_score
                  )}`}
                >
                  <span className="text-lg font-black leading-none">{Math.round(item.overall_score)}%</span>
                  <span className="text-[9px] font-bold uppercase mt-0.5">Match</span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.jd_title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                      {item.match_level}
                    </span>
                    {item.is_optimized && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        ✨ Optimized → {item.optimized_score != null ? Math.round(item.optimized_score) : "?"}%
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {item.resume_filename}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:self-center self-end">
                <a
                  href={getReportDownloadUrl(item.id)}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600 pl-2">
                  <span>View</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
