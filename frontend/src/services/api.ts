import { MatchAnalysisResponse, HistoryListResponse, OptimizationResponse } from "../types";

const API_BASE = "/api";

export async function uploadResume(file: File): Promise<{ id: number; filename: string; character_count: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to upload resume" }));
    throw new Error(errorData.detail || "Failed to upload resume");
  }

  return res.json();
}

export async function uploadJobDescription(
  file?: File,
  rawText?: string,
  title?: string
): Promise<{ id: number; title: string; character_count: number }> {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  if (rawText) {
    formData.append("raw_text", rawText);
  }
  if (title) {
    formData.append("title", title);
  }

  const res = await fetch(`${API_BASE}/job-description/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to upload job description" }));
    throw new Error(errorData.detail || "Failed to upload job description");
  }

  return res.json();
}

export async function analyzeDirect(payload: {
  resume_text?: string;
  resume_id?: number;
  resume_filename?: string;
  jd_text?: string;
  jd_id?: number;
  jd_title?: string;
}): Promise<MatchAnalysisResponse> {
  const res = await fetch(`${API_BASE}/match/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || "Analysis failed");
  }

  return res.json();
}

export async function analyzeFiles(
  resumeFile: File,
  jdText?: string,
  jdFile?: File,
  jdTitle?: string
): Promise<MatchAnalysisResponse> {
  const formData = new FormData();
  formData.append("resume_file", resumeFile);
  if (jdFile) {
    formData.append("jd_file", jdFile);
  }
  if (jdText) {
    formData.append("jd_text", jdText);
  }
  if (jdTitle) {
    formData.append("jd_title", jdTitle);
  }

  const res = await fetch(`${API_BASE}/match/analyze-files`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || "Analysis failed");
  }

  return res.json();
}

export async function getMatchAnalysis(id: number): Promise<MatchAnalysisResponse> {
  const res = await fetch(`${API_BASE}/match/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load match analysis");
  }
  return res.json();
}

export async function optimizeMatch(id: number): Promise<OptimizationResponse> {
  const res = await fetch(`${API_BASE}/match/${id}/optimize`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Optimization failed" }));
    throw new Error(err.detail || "Failed to optimize resume");
  }

  return res.json();
}

export async function getHistory(): Promise<HistoryListResponse> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) {
    throw new Error("Failed to load analysis history");
  }
  return res.json();
}

export async function deleteHistoryItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete analysis record");
  }
}

export function getReportDownloadUrl(id: number): string {
  return `${API_BASE}/match/${id}/pdf`;
}

export function getOptimizedResumeDownloadUrl(id: number): string {
  return `${API_BASE}/match/${id}/optimized-resume-pdf`;
}
