import React from 'react';
import { RepoStats } from '../types';
import { FileCode, Database, Layers, FolderTree } from 'lucide-react';

interface RepoOverviewProps {
  stats: RepoStats;
}

export const RepoOverview: React.FC<RepoOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Size Card */}
      <div className="bg-white dark:bg-[#0A0A0A] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <FileCode size={18} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Repository Size</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {stats.fileCount.toLocaleString()} <span className="text-sm font-normal text-gray-500">files</span>
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {stats.loc.toLocaleString()} LOC
          </span>
        </div>
      </div>

      {/* Languages Card */}
      <div className="bg-white dark:bg-[#0A0A0A] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
            <Database size={18} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Primary Languages</span>
        </div>
        <div className="space-y-1.5">
          {stats.languages.slice(0, 3).map((lang, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${lang.percentage}%` }}
                  ></div>
                </div>
                <span className="font-mono text-gray-500">{lang.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependencies Card */}
      <div className="bg-white dark:bg-[#0A0A0A] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
            <Layers size={18} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Dependencies</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {stats.dependencyCount} <span className="text-sm font-normal text-gray-500">packages</span>
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Across package.json
          </span>
        </div>
      </div>

      {/* Structure Card */}
      <div className="bg-white dark:bg-[#0A0A0A] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
            <FolderTree size={18} />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Structure</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Top-level modules</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.folderStructure.moduleCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Logical groups</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.folderStructure.logicalGroups}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
