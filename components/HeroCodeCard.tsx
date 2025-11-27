import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Files,
  Search,
  GitGraph,
  Settings,
  Command,
  Code2,
  Database,
  Layout,
  Cpu,
  Box,
} from "lucide-react";
import { ProgrammingLanguage } from "../types";

interface HeroCodeCardProps {
  active?: boolean;
  language?: ProgrammingLanguage;
}

const SNIPPETS = [
  {
    lang: ProgrammingLanguage.TypeScript,
    file: "auth.ts",
    icon: Code2,
    color: "text-blue-500",
    borderColor: "border-blue-500",
    code: `interface User {
  id: number;
  role: 'admin' | 'user';
}

function authorize(u: User): boolean {
  return u.role === 'admin';
}`,
  },
  {
    lang: ProgrammingLanguage.Python,
    file: "data.py",
    icon: Terminal,
    color: "text-yellow-500",
    borderColor: "border-yellow-500",
    code: `def process_data(items):
    result = []
    for item in items:
        if item.is_valid():
            result.append(item.value)
    return result`,
  },
  {
    lang: ProgrammingLanguage.Rust,
    file: "main.rs",
    icon: Cpu,
    color: "text-orange-500",
    borderColor: "border-orange-500",
    code: `fn main() {
    let number_list = vec![34, 50, 25];
    let result = largest(&number_list);
    println!("The largest is {}", result);
}`,
  },
  {
    lang: ProgrammingLanguage.Go,
    file: "server.go",
    icon: Box,
    color: "text-cyan-500",
    borderColor: "border-cyan-500",
    code: `package main

import "fmt"

func main() {
    messages := make(chan string)
    go func() { messages <- "ping" }()
    msg := <-messages
    fmt.Println(msg)
}`,
  },
  {
    lang: ProgrammingLanguage.SQL,
    file: "query.sql",
    icon: Database,
    color: "text-green-500",
    borderColor: "border-green-500",
    code: `SELECT name, email
FROM users
WHERE status = 'active'
  AND last_login > NOW() - INTERVAL '7d'
ORDER BY created_at DESC;`,
  },
  {
    lang: ProgrammingLanguage.HTML_CSS,
    file: "card.html",
    icon: Layout,
    color: "text-red-500",
    borderColor: "border-red-500",
    code: `<div class="card">
  <div class="header">
    <h2>Welcome Back</h2>
  </div>
  <p>Your journey continues.</p>
  <button class="btn">Login</button>
</div>`,
  },
];

export const HeroCodeCard: React.FC<HeroCodeCardProps> = ({
  active = true,
  language,
}) => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [typedIndex, setTypedIndex] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const snippet = SNIPPETS[snippetIndex];
  const CodeIcon = snippet.icon;

  // Handle external language change (clicks from parent)
  useEffect(() => {
    if (language) {
      const index = SNIPPETS.findIndex((s) => s.lang === language);
      if (index !== -1 && index !== snippetIndex) {
        setSnippetIndex(index);
        setTypedIndex(0);
        setManualOverride(true);

        // Clear override after 10 seconds to resume cycling if idle
        const timer = setTimeout(() => setManualOverride(false), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [language]);

  // Reset typing progress when snippet changes
  useEffect(() => {
    setTypedIndex(0);
  }, [snippetIndex]);

  // Auto-cycle logic
  useEffect(() => {
    // Don't cycle if hovering (active) OR if user manually selected a language recently
    if (active || manualOverride) return;

    const interval = setInterval(() => {
      setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
    }, 5000); // Switch every 5s when idle

    return () => clearInterval(interval);
  }, [active, manualOverride]);

  // Typing Effect Logic (Only when active)
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (typedIndex >= snippet.code.length) return;

      const nextChar = snippet.code[typedIndex];

      // Simplified typing logic for hero demo - allow typing correct char or Enter
      if (e.key === nextChar) {
        setTypedIndex((prev) => prev + 1);

        // Auto-advance if completed
        if (typedIndex + 1 === snippet.code.length) {
          setTimeout(() => {
            setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
          }, 1000);
        }
      } else if (e.key === "Enter" && nextChar === "\n") {
        setTypedIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [snippet, typedIndex, active]);

  return (
    <div
      className="relative group w-full max-w-2xl transition-opacity duration-300"
      style={{ opacity: active ? 1 : 0.95 }}
    >
      <div className="relative transition-all duration-500 ease-out">
        {/* Glow Effect */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-green-500/20 via-blue-500/10 to-green-500/20 rounded-2xl blur-3xl transition duration-1000 ${
            active ? "opacity-60" : "opacity-30"
          }`}
        ></div>

        {/* Card Container */}
        <div
          ref={containerRef}
          className="relative dark:bg-[#090909]/95 bg-white/95 border dark:border-white/10 border-black/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ring-1 dark:ring-white/5 ring-black/5 flex flex-col h-[380px] transition-colors duration-300"
        >
          {/* Window Chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-white/5 border-black/5 dark:bg-[#0F0F0F] bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 group-hover:gap-2 transition-all">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner"></div>
              </div>
            </div>

            {/* Search Bar Mockup */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md dark:bg-black/50 bg-white border dark:border-white/5 border-black/5 text-[10px] text-neutral-500 font-mono min-w-[200px]">
              <Search size={10} />
              <span>Velocit</span>
              <span className="ml-auto border dark:border-white/10 border-black/10 px-1 rounded dark:bg-white/5 bg-black/5">
                ⌘ P
              </span>
            </div>

            <div className="flex items-center gap-2 opacity-50">
              <Command size={12} className="text-neutral-500" />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar (IDE Look) */}
            <div className="w-12 hidden sm:flex flex-col items-center py-4 gap-6 border-r dark:border-white/5 border-black/5 dark:bg-[#0B0B0B] bg-gray-50 transition-colors">
              <Files
                size={18}
                className="dark:text-neutral-200 text-neutral-800"
              />
              <Search
                size={18}
                className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
              />
              <GitGraph
                size={18}
                className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
              />
              <div className="flex-1"></div>
              <Settings
                size={18}
                className="text-neutral-400 dark:text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-400 transition-colors"
              />
            </div>

            <div className="flex-1 flex flex-col dark:bg-[#050505] bg-white transition-colors">
              {/* Tabs */}
              <div className="flex border-b dark:border-white/5 border-black/5 dark:bg-[#050505] bg-white overflow-hidden">
                <div
                  className={`px-4 py-2 dark:bg-[#090909] bg-gray-50 border-r dark:border-white/5 border-black/5 border-t-2 ${snippet.borderColor} text-xs dark:text-neutral-300 text-neutral-800 font-medium flex items-center gap-2 min-w-[140px] transition-all duration-300`}
                >
                  <CodeIcon size={14} className={snippet.color} />
                  <span>{snippet.file}</span>
                  <span className="ml-auto text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                    ×
                  </span>
                </div>

                {/* Dynamic Second Tab based on next snippet */}
                <div className="px-4 py-2 text-xs text-neutral-500 font-medium flex items-center gap-2 dark:hover:bg-[#090909] hover:bg-gray-50 transition-colors opacity-50">
                  <span>
                    {SNIPPETS[(snippetIndex + 1) % SNIPPETS.length].file}
                  </span>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-hidden flex-1 relative">
                {/* Line Numbers */}
                <div className="absolute left-0 top-6 bottom-0 w-12 text-right pr-4 dark:text-neutral-800 text-neutral-300 select-none font-mono text-xs leading-relaxed">
                  {snippet.code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                <div className="ml-8 h-full">
                  <pre className="whitespace-pre-wrap break-all font-medium">
                    {snippet.code.split("").map((char, index) => {
                      let colorClass = "dark:text-neutral-700 text-neutral-300";
                      let bgClass = "";
                      let animateClass = "";

                      if (index < typedIndex) {
                        colorClass = "dark:text-neutral-100 text-neutral-900";
                      } else if (index === typedIndex) {
                        colorClass = "text-neutral-500";
                        if (active) {
                          bgClass =
                            "bg-green-500/30 dark:text-green-100 text-green-900 rounded-sm";
                          animateClass = "animate-pulse";
                        }
                      }

                      return (
                        <span
                          key={index}
                          className={`${colorClass} ${bgClass} ${animateClass} transition-colors duration-100`}
                        >
                          {char}
                        </span>
                      );
                    })}
                    {typedIndex === snippet.code.length && active && (
                      <span className="inline-block w-2 h-4 bg-green-500 animate-caret-blink ml-1 align-middle"></span>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="flex justify-between items-center px-3 py-1.5 bg-green-500 text-[10px] text-black font-bold font-mono transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <GitGraph size={10} />
                <span>main*</span>
              </div>
              <span>0 errors</span>
            </div>
            <div className="flex gap-4">
              <span>
                Ln {snippet.code.slice(0, typedIndex).split("\n").length}, Col{" "}
                {typedIndex}
              </span>
              <span>UTF-8</span>
              <span>{snippet.lang}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
