import React from "react";
import { Info, Code, ShieldCheck, Cpu, Database, Server, Sparkles } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 inline-block mb-3">
          System Information
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About Matchly AI
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
          Intelligent Resume &amp; Job Description Matching System built with a modular NLP backend and modern React frontend.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Project Mission</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Matchly AI addresses the fundamental flaw of legacy Applicant Tracking Systems (ATS) and naive keyword counters. Instead of penalizing candidates for subtle phrasing differences or rewarding keyword stuffing, Matchly AI evaluates genuine semantic intent, verifies minimum tenure requirements, and provides actionable recommendations to optimize candidate presentation.
        </p>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center space-x-2">
          <Code className="w-4 h-4 text-blue-600" />
          <span>Complete Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-slate-900 mb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>NLP &amp; Machine Learning</span>
            </div>
            <ul className="space-y-1 text-slate-600">
              <li>• <b>Sentence Transformers:</b> <code className="font-mono text-purple-700">all-MiniLM-L6-v2</code></li>
              <li>• <b>spaCy:</b> NER &amp; Linguistic tokenization (<code className="font-mono text-purple-700">en_core_web_sm</code>)</li>
              <li>• <b>scikit-learn:</b> Cosine similarity matrices &amp; metrics</li>
              <li>• <b>NLTK:</b> Text cleanup &amp; stopwords handling</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-slate-900 mb-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Backend &amp; Document Parsing</span>
            </div>
            <ul className="space-y-1 text-slate-600">
              <li>• <b>FastAPI:</b> High-concurrency async Python framework</li>
              <li>• <b>PyMuPDF (fitz):</b> Lightning-fast native PDF parsing</li>
              <li>• <b>python-docx:</b> DOCX document parsing with table support</li>
              <li>• <b>ReportLab:</b> Executive PDF report generation</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-slate-900 mb-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database &amp; Storage</span>
            </div>
            <ul className="space-y-1 text-slate-600">
              <li>• <b>SQLite:</b> Embedded zero-config database</li>
              <li>• <b>SQLAlchemy 2.0:</b> Enterprise ORM with schema migrations</li>
              <li>• <b>Pydantic Settings:</b> Centralized configuration management</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-slate-900 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Frontend &amp; Visualization</span>
            </div>
            <ul className="space-y-1 text-slate-600">
              <li>• <b>React 19 + TypeScript:</b> Fully typed component architecture</li>
              <li>• <b>Tailwind CSS:</b> Modern responsive AI Match Radar UI</li>
              <li>• <b>Recharts:</b> Interactive bar and donut compatibility graphs</li>
              <li>• <b>Lucide React:</b> Clean modern SaaS icon suite</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security & Validation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Security &amp; Privacy</h2>
        </div>
        <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
          <li><b>Strict File Validation:</b> Enforces strict file extension and mime-type verification (.pdf, .docx).</li>
          <li><b>15 MB File Limit:</b> Safeguards against memory exhaustion attacks.</li>
          <li><b>Zero External Data Leaks:</b> Embeddings and NLP execution run 100% locally in your Python environment without third-party API dependencies.</li>
        </ul>
      </div>
    </div>
  );
};
