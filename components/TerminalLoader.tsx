import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export const TerminalLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [hexLine, setHexLine] = useState("0x4A1F...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 100));
      setHexLine(
        `0x${Math.floor(Math.random() * 16777215)
          .toString(16)
          .toUpperCase()}...`
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d907] to-transparent"></div>

      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#00d907]/10 flex items-center justify-center text-[#00d907] mb-6 relative">
          <Loader2 size={24} className="animate-spin" />
          <div className="absolute inset-0 rounded-full border border-[#00d907] opacity-20 animate-ping"></div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Analyzing Repository
        </h3>
        <p className="text-sm text-gray-500 dark:text-neutral-500 mb-8 font-mono">
          {hexLine}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#00d907] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between w-full text-[10px] text-gray-500 dark:text-neutral-600 font-mono">
          <span>AST_PARSER_V2</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
