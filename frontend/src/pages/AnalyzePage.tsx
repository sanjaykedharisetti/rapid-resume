import React, { useState } from "react";
import { Sparkles, FileText, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { Dropzone } from "../components/Dropzone";
import { AnalysisProgressModal } from "../components/AnalysisProgressModal";
import { analyzeFiles, analyzeDirect } from "../services/api";
import { MatchAnalysisResponse } from "../types";

interface AnalyzePageProps {
  onAnalysisComplete: (result: MatchAnalysisResponse) => void;
  presetToLoad?: string | null;
  onClearPreset?: () => void;
}

// Pre-defined sample benchmarks for instant 1-click testing
const SAMPLE_BENCHMARKS = {
  ml: {
    title: "Senior Machine Learning Engineer",
    jdTitle: "Machine Learning Engineer (CloudScale AI)",
    jdText: `Job Title: Machine Learning Engineer\nCompany: CloudScale AI Technologies\nLocation: San Francisco, CA / Remote\n\nAbout the Role:\nWe are looking for a Senior Machine Learning Engineer to design, train, and deploy state-of-the-art predictive models and NLP pipelines into production cloud infrastructure.\n\nKey Responsibilities:\n- Build and fine-tune predictive models and deep learning architectures using PyTorch and Scikit-learn.\n- Design NLP pipelines for text classification, sentiment analysis, and semantic search.\n- Package and deploy machine learning models as high-throughput REST APIs using FastAPI and Docker.\n- Implement MLOps best practices including automated model evaluation, tracking with MLflow, and continuous retraining.\n\nRequired Qualifications & Skills:\n- Bachelor's degree in Computer Science, Data Science, or related engineering discipline.\n- 3+ years of professional experience in machine learning and Python development.\n- Deep expertise in Python, Scikit-learn, PyTorch, and SQL.\n- Hands-on experience with Docker containerization and REST API development.\n- Strong grounding in Machine Learning fundamentals, feature engineering, and model evaluation metrics.\n\nPreferred Qualifications:\n- Experience deploying models on AWS (SageMaker, ECS, S3).\n- Familiarity with Kubernetes orchestration and CI/CD pipelines.\n- Experience with Large Language Models, Hugging Face Transformers, or LangChain.`,
    resumeFilename: "Alex_Rivera_Senior_ML_Engineer.pdf",
    resumeText: `Alex Rivera - Senior Machine Learning Engineer\nEmail: alex.rivera@example.com | San Francisco, CA | GitHub: github.com/arivera-ml\n\nProfessional Summary:\nDedicated Machine Learning Engineer with 4 years of experience designing, fine-tuning, and serving predictive AI models and NLP pipelines in production. Experienced in PyTorch, Scikit-learn, FastAPI microservices, and Docker containers.\n\nTechnical Skills:\nProgramming & Frameworks: Python, PyTorch, Scikit-learn, SQL, FastAPI, Transformers\nML & NLP: Machine Learning, Deep Learning, Natural Language Processing, MLOps, Feature Engineering, Model Evaluation\nCloud & DevOps: Docker, AWS, S3, Git, CI/CD\n\nWork Experience:\nSenior ML Engineer | Apex AI Systems (2022 - Present)\n- Built and fine-tuned BERT and PyTorch text classification pipelines, improving intent recognition accuracy by 14% across 2M daily user requests.\n- Designed high-performance REST APIs in FastAPI wrapped in Docker containers, sustaining 850 requests per second at sub-30ms latency.\n- Established automated MLOps evaluation workflows with MLflow and Scikit-learn for continuous model validation and drift detection.\n\nMachine Learning Developer | DataVenture Analytics (2020 - 2022)\n- Developed predictive machine learning models using Scikit-learn and XGBoost for customer conversion forecasting with 88% ROC-AUC.\n- Optimized SQL queries and feature extraction scripts across PostgreSQL databases reducing preprocessing time by 35%.\n\nEducation:\nBachelor of Science in Computer Science | UC Berkeley (2016 - 2020)`,
  },
  backend: {
    title: "Python Backend Developer",
    jdTitle: "Python Backend Developer (FinTech Velocity)",
    jdText: `Job Title: Python Backend Developer\nCompany: FinTech Velocity Systems\n\nAbout the Role:\nWe are seeking an experienced Python Backend Developer to engineer robust microservices, transactional databases, and resilient APIs powering our high-volume financial clearing platform.\n\nKey Responsibilities:\n- Design, build, and maintain high-performance REST APIs using FastAPI and Python.\n- Architect scalable relational database schemas with PostgreSQL and optimize SQL queries.\n- Implement low-latency caching solutions using Redis.\n- Build event-driven background task processing with Celery.\n\nRequired Qualifications & Skills:\n- Bachelor's or Master's degree in Computer Science or Software Engineering.\n- 2+ years of professional backend engineering experience.\n- Core proficiency in Python, FastAPI, SQL, and PostgreSQL.\n- Experience with Docker, Redis, and Git version control.\n- Solid understanding of REST API principles, microservices, and database indexing.\n\nPreferred Qualifications:\n- Experience with Kubernetes and Terraform infrastructure as code.\n- Familiarity with AWS cloud architecture (ECS, RDS).`,
    resumeFilename: "Jordan_Taylor_Junior_Python_Dev.pdf",
    resumeText: `Jordan Taylor - Junior Python Developer\nEmail: jordan.taylor@example.com | Chicago, IL\n\nProfessional Summary:\nEnthusiastic Python developer with 1.5 years of experience developing backend REST endpoints and database integrations. Solid grasp of Python, Flask, FastAPI, SQLite, and Git.\n\nTechnical Skills:\nLanguages: Python, JavaScript, SQL\nFrameworks & Tools: FastAPI, Flask, SQLite, PostgreSQL, Git, Postman\nCore Concepts: REST API, Object-Oriented Programming, Unit Testing\n\nWork Experience:\nJunior Backend Developer | CloudSpark Labs (2023 - Present)\n- Built 12 REST API endpoints using FastAPI and PostgreSQL for an internal employee management application.\n- Wrote automated unit tests with Pytest covering 80% of business logic code paths.\n- Integrated Redis caching to reduce database read pressure on frequent user session checks.\n\nEducation:\nBachelor of Science in Information Technology | University of Illinois (2019 - 2023)`,
  },
  frontend: {
    title: "Frontend React Developer",
    jdTitle: "Frontend React Developer (PixelPulse)",
    jdText: `Job Title: Frontend React Developer\nCompany: PixelPulse Interactive\n\nAbout the Role:\nWe are looking for a creative, detail-oriented Frontend React Developer to build responsive, accessible, and interactive web applications for millions of global users.\n\nKey Responsibilities:\n- Build responsive, mobile-first user interfaces using React, TypeScript, and Tailwind CSS.\n- Manage client-side application state effectively using Redux Toolkit.\n- Integrate REST APIs and WebSocket real-time streams seamlessly with frontend views.\n- Implement reusable UI components, adhere to accessibility (a11y) standards, and write unit tests with Jest.\n\nRequired Qualifications & Skills:\n- Bachelor's degree in Computer Science, Design, or equivalent practical experience.\n- 2+ years of professional front-end web development experience.\n- Strong mastery of JavaScript, TypeScript, React, HTML5, and CSS3.\n- Proven experience with Tailwind CSS and responsive design patterns.\n- Experience with Git, npm, and REST API integration.\n\nPreferred Qualifications:\n- Experience with Next.js and server-side rendering (SSR).\n- Experience with Jest and Cypress unit and end-to-end testing.`,
    resumeFilename: "Morgan_Vance_Frontend_React_Dev.docx",
    resumeText: `Morgan Vance - Frontend React Developer\nEmail: morgan.vance@example.com | Austin, TX | Portfolio: morganvance.dev\n\nProfessional Summary:\nCreative and detail-oriented Frontend Developer with 3 years of hands-on experience building fast, accessible web applications using React, TypeScript, and Tailwind CSS. Passionate about component reusability and clean UI/UX.\n\nTechnical Skills:\nLanguages: JavaScript, TypeScript, HTML5, CSS3\nFrameworks & Libraries: React, Next.js, Redux Toolkit, Tailwind CSS, Vite\nTools & Practices: Git, Figma, Jest, REST API integration, Responsive Design\n\nWork Experience:\nFrontend Developer | CreativePixel Studio (2022 - Present)\n- Developed 15+ responsive web pages in React and TypeScript with Tailwind CSS, achieving 98+ Google Lighthouse performance scores.\n- Architected global client state using Redux Toolkit to streamline checkout flow, cutting cart abandonment by 12%.\n- Translated complex Figma prototypes into WCAG accessible, reusable UI components.\n\nEducation:\nBachelor of Science in Computer Science | University of Texas at Austin (2017 - 2021)`,
  },
  mismatch: {
    title: "Frontend Resume on ML Engineer Job",
    jdTitle: "Machine Learning Engineer (CloudScale AI)",
    jdText: `Job Title: Machine Learning Engineer\nRequired Qualifications & Skills:\n- Bachelor's degree in Computer Science or related field.\n- 3+ years of professional experience in machine learning and Python development.\n- Deep expertise in Python, Scikit-learn, PyTorch, and SQL.\n- Hands-on experience with Docker containerization and REST API development.\n- Machine Learning fundamentals, MLOps, and model evaluation metrics.\nPreferred: AWS, Kubernetes, Transformers.`,
    resumeFilename: "Morgan_Vance_Frontend_Dev.docx",
    resumeText: `Morgan Vance - Frontend React Developer\nTechnical Skills: JavaScript, TypeScript, HTML5, CSS3, React, Tailwind CSS, Vite, Figma, Jest\nWork Experience: 3 years building responsive web frontends in React and TypeScript.\nEducation: Bachelor of Science in Computer Science`,
  },
};

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onAnalysisComplete,
  presetToLoad,
  onClearPreset,
}) => {
  // State for resume
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeTextPasted, setResumeTextPasted] = useState<string>("");
  const [resumeFilenamePasted, setResumeFilenamePasted] = useState<string>("");

  // State for JD
  const [jdMode, setJdMode] = useState<"text" | "file">("text");
  const [jdText, setJdText] = useState<string>("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdTitle, setJdTitle] = useState<string>("");

  // Execution & Progress State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load preset if triggered from dashboard
  React.useEffect(() => {
    if (presetToLoad && SAMPLE_BENCHMARKS[presetToLoad as keyof typeof SAMPLE_BENCHMARKS]) {
      const preset = SAMPLE_BENCHMARKS[presetToLoad as keyof typeof SAMPLE_BENCHMARKS];
      setResumeTextPasted(preset.resumeText);
      setResumeFilenamePasted(preset.resumeFilename);
      setResumeFile(null);
      setJdText(preset.jdText);
      setJdTitle(preset.jdTitle);
      setJdMode("text");
      setJdFile(null);
      if (onClearPreset) onClearPreset();
    }
  }, [presetToLoad]);

  const handleApplyPreset = (key: string) => {
    if (key && SAMPLE_BENCHMARKS[key as keyof typeof SAMPLE_BENCHMARKS]) {
      const preset = SAMPLE_BENCHMARKS[key as keyof typeof SAMPLE_BENCHMARKS];
      setResumeTextPasted(preset.resumeText);
      setResumeFilenamePasted(preset.resumeFilename);
      setResumeFile(null);
      setJdText(preset.jdText);
      setJdTitle(preset.jdTitle);
      setJdMode("text");
      setJdFile(null);
    }
  };

  const handleClear = () => {
    setResumeFile(null);
    setResumeTextPasted("");
    setResumeFilenamePasted("");
    setJdText("");
    setJdFile(null);
    setJdTitle("");
    setErrorMessage(null);
  };

  const hasResume = !!resumeFile || resumeTextPasted.trim().length > 30;
  const hasJd = (jdMode === "file" && !!jdFile) || (jdMode === "text" && jdText.trim().length > 30);
  const canAnalyze = hasResume && hasJd && !isAnalyzing;

  const runAnalysis = async () => {
    if (!canAnalyze) return;
    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisStage(0);

    // Sequential stage stepping tied to real lifecycle
    const stageInterval = setInterval(() => {
      setAnalysisStage((prev) => (prev < 6 ? prev + 1 : prev));
    }, 450);

    try {
      let result: MatchAnalysisResponse;

      if (resumeFile) {
        // Upload via multipart endpoint
        result = await analyzeFiles(
          resumeFile,
          jdMode === "text" ? jdText : undefined,
          jdMode === "file" && jdFile ? jdFile : undefined,
          jdTitle || "Target Role"
        );
      } else {
        // Direct text analysis
        result = await analyzeDirect({
          resume_text: resumeTextPasted,
          resume_filename: resumeFilenamePasted || "Sample_Candidate_Resume.pdf",
          jd_text: jdText,
          jd_title: jdTitle || "Job Description",
        });
      }

      // Final stages
      setAnalysisStage(7);
      clearInterval(stageInterval);

      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete(result);
      }, 500);
    } catch (err: any) {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
      setErrorMessage(err.message || "An unexpected error occurred during NLP matching.");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Preset Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Analyze Resume Against Job Description
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide both documents to trigger the full Smart Match Engine NLP pipeline
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Load Benchmark:
          </span>
          <select
            onChange={(e) => handleApplyPreset(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            defaultValue=""
          >
            <option value="" disabled>
              Select Benchmark Preset...
            </option>
            <option value="ml">Machine Learning Engineer (High Match)</option>
            <option value="backend">Python Backend Developer (Moderate Match)</option>
            <option value="frontend">Frontend React Developer (High Match)</option>
            <option value="mismatch">Frontend Resume vs ML JD (Low Match Contrast)</option>
          </select>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50"
            title="Clear Inputs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Analysis Error</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Two Column Document Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMN 1: RESUME UPLOAD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Candidate Resume
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">PDF or DOCX</span>
            </div>

            {resumeTextPasted ? (
              <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">
                      {resumeFilenamePasted || "Loaded Resume Text"}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      Preset
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setResumeTextPasted("");
                      setResumeFilenamePasted("");
                    }}
                    className="text-xs text-slate-400 hover:text-red-600 font-semibold"
                  >
                    Change
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto font-mono text-[11px] text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  {resumeTextPasted.slice(0, 600)}...
                </div>
              </div>
            ) : (
              <Dropzone
                label="Drop your resume here"
                sublabel="PDF or DOCX (Max 15 MB)"
                selectedFile={resumeFile}
                onFileSelect={(f) => {
                  setResumeFile(f);
                  setResumeTextPasted("");
                }}
              />
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Supported: .pdf, .docx</span>
            <span>{hasResume ? "✓ Resume ready" : "Awaiting resume"}</span>
          </div>
        </div>

        {/* COLUMN 2: JOB DESCRIPTION */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Job Description
                </h3>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setJdMode("text")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    jdMode === "text"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setJdMode("file")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    jdMode === "file"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Upload JD
                </button>
              </div>
            </div>

            {/* Optional Title */}
            <div className="mb-3">
              <input
                type="text"
                value={jdTitle}
                onChange={(e) => setJdTitle(e.target.value)}
                placeholder="Target Job Title (e.g. Senior Machine Learning Engineer)"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {jdMode === "text" ? (
              <div className="relative">
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the target job description here including required and preferred qualifications, responsibilities, and experience requirements..."
                  rows={9}
                  className="w-full text-xs text-slate-700 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-sans leading-relaxed"
                />
                <div className="text-right text-[11px] text-slate-400 mt-1">
                  {jdText.length} characters
                </div>
              </div>
            ) : (
              <Dropzone
                label="Drop Job Description document here"
                sublabel="PDF or DOCX (Max 15 MB)"
                selectedFile={jdFile}
                onFileSelect={(f) => setJdFile(f)}
              />
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Character minimum: 30 chars</span>
            <span>{hasJd ? "✓ Job description ready" : "Awaiting job description"}</span>
          </div>
        </div>
      </div>

      {/* Bottom Centered Analyze Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Ready to execute Smart Match Engine
            </h4>
            <p className="text-xs text-slate-500">
              Combines exact match, skill normalization, semantic embeddings, experience &amp; education checks
            </p>
          </div>
        </div>

        <button
          onClick={runAnalysis}
          disabled={!canAnalyze}
          className={`px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all flex items-center space-x-2.5 shadow-lg ${
            canAnalyze
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze Match</span>
        </button>
      </div>

      {/* Progress animation modal during active processing */}
      <AnalysisProgressModal isOpen={isAnalyzing} currentStage={analysisStage} />
    </div>
  );
};
