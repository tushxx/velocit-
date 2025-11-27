import React from 'react';
import { DependencyHotspot } from '../types';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';

interface HotspotAnalyticsProps {
  hotspots: DependencyHotspot[];
}

export const HotspotAnalytics: React.FC<HotspotAnalyticsProps> = ({ hotspots }) => {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          Dependency Hotspots
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-white/5">
        {hotspots.map((hotspot, i) => (
          <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-mono text-sm font-bold text-gray-900 dark:text-white mb-1">
                  {hotspot.name}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[200px]" title={hotspot.id}>
                  {hotspot.id}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {hotspot.importCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase">Imports</span>
              </div>
            </div>

            {hotspot.cycle && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle size={12} />
                <span className="font-bold">Risky Cycle:</span>
                <span className="font-mono">{hotspot.cycle}</span>
              </div>
            )}

            {hotspot.isBottleneck && !hotspot.cycle && (
              <div className="mt-2 flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-500">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                High coupling detected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
