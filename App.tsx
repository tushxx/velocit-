import React, { useState, useEffect } from "react";
import { AppState, RepoAnalysis, PageRoute } from "./types";
import { analyzeRepository } from "./services/geminiService";
import { Navbar } from "./components/Navbar";
import { BentoGrid } from "./components/BentoGrid";
import { Timeline } from "./components/Timeline";
import { TerminalLoader } from "./components/TerminalLoader";
import { RepoVisualizer } from "./components/RepoVisualizer";
import { InteractiveGraphHero } from "./components/InteractiveGraphHero";
import { Documentation } from "./components/Documentation";
import { TrustedBy } from "./components/TrustedBy";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { StaticPage } from "./components/StaticPage";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Landing);
  const [currentPage, setCurrentPage] = useState<PageRoute>("home");
  const [repoUrl, setRepoUrl] = useState("");
  const [analysisData, setAnalysisData] = useState<RepoAnalysis | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleVisualize = async (url: string) => {
    if (!url) return;
    setRepoUrl(url);
    setAppState(AppState.Analyzing);
    try {
      const data = await analyzeRepository(url);
      setAnalysisData(data);
      setTimeout(() => {
        setAppState(AppState.Dashboard);
      }, 3000); // Slightly longer for effect
    } catch (error) {
      console.error(error);
      setAppState(AppState.Error);
    }
  };

  const reset = () => {
    setAppState(AppState.Landing);
    setCurrentPage("home");
    setAnalysisData(null);
    setRepoUrl("");
  };

  const navigateTo = (page: PageRoute) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    if (page !== "home") {
      setAppState(AppState.Landing); // Reset tool state when leaving home
    }
  };

  // If we are on a static page, render that instead of the main app logic
  if (currentPage !== "home") {
    return (
      <StaticPage
        page={currentPage}
        onNavigate={navigateTo}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen w-full font-sans bg-gray-50 dark:bg-[#030303] text-gray-900 dark:text-white selection:bg-[#00d907]/30 selection:text-black dark:selection:text-white transition-colors duration-300">
      {appState !== AppState.Dashboard && (
        <Navbar
          onHome={reset}
          onNavigate={navigateTo}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      <main className="flex-1 flex flex-col relative">
        {/* LANDING STATE */}
        {appState === AppState.Landing && (
          <>
            <InteractiveGraphHero
              onVisualize={handleVisualize}
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              theme={theme}
            />

            <TrustedBy />
            <BentoGrid />
            <Timeline />
            <Documentation />
            <FAQ />
            <Footer onNavigate={navigateTo} />
          </>
        )}

        {/* ANALYZING STATE */}
        {appState === AppState.Analyzing && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#030303] z-50 transition-colors duration-300">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <TerminalLoader />
          </div>
        )}

        {/* DASHBOARD STATE */}
        {appState === AppState.Dashboard && analysisData && (
          <RepoVisualizer data={analysisData} repoUrl={repoUrl} onClose={reset} theme={theme} />
        )}

        {/* ERROR STATE */}
        {appState === AppState.Error && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#030303] z-50">
            <div className="text-center p-8 bg-white dark:bg-[#0A0A0A] border border-red-500/20 rounded-2xl shadow-xl">
              <h2 className="text-red-500 text-xl font-bold mb-2 font-mono">
                CONNECTION_REFUSED
              </h2>
              <p className="text-gray-600 dark:text-neutral-500 mb-6 max-w-sm mx-auto">
                The repository could not be analyzed. It may be private or the
                rate limit was exceeded.
              </p>
              <button
                onClick={reset}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-bold hover:opacity-80 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
