import React, { useState } from 'react';
import { PRImpact } from '../types';
import { GitPullRequest, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PRVisualizerProps {
  impact?: PRImpact;
}

export const PRVisualizer: React.FC<PRVisualizerProps> = ({ impact }) => {
  const [prUrl, setPrUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(!!impact);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prUrl) return;
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
    }, 1500);
  };

  // Use passed impact or mock if simulating
  const data = impact || {
    added: 12,
    removed: 5,
    modified: 8,
    riskLevel: 'medium' as const
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <GitPullRequest size={16} className="text-purple-500" />
          PR Impact Visualizer
        </h3>
      </div>

      <div className="p-4">
        {!showResult ? (
          <form onSubmit={handleAnalyze} className="flex gap-2">
            <input
              type="text"
              placeholder="Paste PR URL (e.g. github.com/.../pull/123)"
              className="flex-1 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00d907]"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
            />
            <button 
              type="submit"
              disabled={analyzing}
              className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded text-sm font-bold hover:opacity-80 disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        ) : (
          <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                    Analysis for <span className="font-mono text-gray-900 dark:text-white">PR #22230</span>
                </div>
                <button onClick={() => setShowResult(false)} className="text-xs text-blue-500 hover:underline">
                    Analyze another
                </button>
             </div>

             <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded border border-green-100 dark:border-green-900/20 text-center">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">+{data.added}</div>
                    <div className="text-[10px] uppercase text-green-600/70 dark:text-green-400/70 font-bold">Nodes Added</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/20 text-center">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">-{data.removed}</div>
                    <div className="text-[10px] uppercase text-red-600/70 dark:text-red-400/70 font-bold">Nodes Removed</div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-100 dark:border-yellow-900/20 text-center">
                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">~{data.modified}</div>
                    <div className="text-[10px] uppercase text-yellow-600/70 dark:text-yellow-400/70 font-bold">Modified</div>
                </div>
             </div>

             <div className={`p-3 rounded border flex items-center gap-3 ${
                 data.riskLevel === 'low' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' :
                 data.riskLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30' :
                 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'
             }`}>
                 {data.riskLevel === 'low' && <CheckCircle2 className="text-green-500" />}
                 {data.riskLevel === 'medium' && <AlertTriangle className="text-yellow-500" />}
                 {data.riskLevel === 'high' && <AlertTriangle className="text-red-500" />}
                 
                 <div>
                     <div className="font-bold text-sm capitalize text-gray-900 dark:text-white">
                         {data.riskLevel} Risk Impact
                     </div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">
                         {data.riskLevel === 'low' ? 'Safe to merge. Isolated changes.' :
                          data.riskLevel === 'medium' ? 'Review required. Touches shared modules.' :
                          'Critical review needed. Core architecture modified.'}
                     </div>
                 </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
