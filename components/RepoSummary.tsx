import React from 'react';
import { RepoSummary as RepoSummaryType } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowUpCircle } from 'lucide-react';

interface RepoSummaryProps {
  summary: RepoSummaryType;
}

export const RepoSummary: React.FC<RepoSummaryProps> = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Sparkles size={16} className="text-[#00d907]" />
          AI Summary
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Strengths */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
            <CheckCircle2 size={12} className="text-green-500" /> Strengths
          </h4>
          <ul className="space-y-1">
            {summary.strengths.map((item, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-1.5 w-1 h-1 bg-green-500 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
            <AlertTriangle size={12} className="text-yellow-500" /> Risk Factors
          </h4>
          <ul className="space-y-1">
            {summary.risks.map((item, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-1.5 w-1 h-1 bg-yellow-500 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
            <ArrowUpCircle size={12} className="text-blue-500" /> Suggested Improvements
          </h4>
          <ul className="space-y-1">
            {summary.improvements.map((item, i) => (
              <li key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-1.5 w-1 h-1 bg-blue-500 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
