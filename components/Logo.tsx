import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Container */}
      <div className="relative group cursor-default">
        {/* Main Shape */}
        <div className="relative w-8 h-8 bg-gray-100 dark:bg-[#0a0a0a] rounded-lg border border-gray-300 dark:border-white/10 flex items-center justify-center transform -skew-x-6 shadow-sm overflow-hidden">
          {/* Internal Graphic */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform skew-x-6 relative z-10"
          >
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              fill="#00d907"
              stroke="#00d907"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Text Branding */}
      <div className="flex flex-col justify-center">
        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white font-sans leading-none flex items-center transition-colors">
          Velocit<span className="text-[#00d907]">.</span>
        </span>
      </div>
    </div>
  );
};
