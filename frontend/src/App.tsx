import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { ResultsPage } from "./pages/ResultsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { AboutPage } from "./pages/AboutPage";
import { MatchAnalysisResponse } from "./types";
import { Radar, Heart } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [currentAnalysis, setCurrentAnalysis] = useState<MatchAnalysisResponse | null>(null);
  const [presetToLoad, setPresetToLoad] = useState<string | null>(null);

  const handleStartAnalyze = () => {
    setActiveTab("analyze");
  };

  const handleHowItWorks = () => {
    setActiveTab("how-it-works");
  };

  const handleLoadPreset = (presetKey: string) => {
    setPresetToLoad(presetKey);
    setActiveTab("analyze");
  };

  const handleAnalysisComplete = (result: MatchAnalysisResponse) => {
    setCurrentAnalysis(result);
    setActiveTab("results");
  };

  const handleViewHistoricalAnalysis = (analysis: MatchAnalysisResponse) => {
    setCurrentAnalysis(analysis);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "dashboard" && (
          <DashboardPage
            onStartAnalyze={handleStartAnalyze}
            onHowItWorks={handleHowItWorks}
            onLoadPreset={handleLoadPreset}
          />
        )}

        {activeTab === "analyze" && (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            presetToLoad={presetToLoad}
            onClearPreset={() => setPresetToLoad(null)}
          />
        )}

        {activeTab === "results" && currentAnalysis && (
          <ResultsPage
            analysis={currentAnalysis}
            onNewAnalysis={() => {
              setCurrentAnalysis(null);
              setActiveTab("analyze");
            }}
          />
        )}

        {activeTab === "history" && (
          <HistoryPage
            onViewAnalysis={handleViewHistoricalAnalysis}
            onNewAnalysis={() => setActiveTab("analyze")}
          />
        )}

        {activeTab === "how-it-works" && <HowItWorksPage />}

        {activeTab === "about" && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Radar className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">Matchly AI</span>
            <span>&bull;</span>
            <span>Intelligent Resume &amp; Job Description Matching System</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("how-it-works")}
              className="hover:text-blue-600 transition-colors"
            >
              Methodology
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className="hover:text-blue-600 transition-colors"
            >
              Technology Stack
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400">
              Built with Sentence Transformers &amp; FastAPI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
