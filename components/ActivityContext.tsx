import React from 'react';
import { RecentActivity } from '../types';
import { Activity, FileClock, AlertCircle, Folder } from 'lucide-react';

interface ActivityContextProps {
  activity: RecentActivity;
}

export const ActivityContext: React.FC<ActivityContextProps> = ({ activity }) => {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Activity size={16} className="text-blue-500" />
          Recent Activity
        </h3>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Active Folders */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Folder size={12} /> Active Folders
          </h4>
          <div className="flex flex-wrap gap-2">
            {activity.activeFolders.map((folder, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded border border-blue-100 dark:border-blue-900/30 font-mono">
                {folder}
              </span>
            ))}
          </div>
        </div>

        {/* Most Modified */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <FileClock size={12} /> Most Modified (30d)
          </h4>
          <ul className="space-y-2">
            {activity.mostModifiedFiles.map((file, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                {file}
              </li>
            ))}
          </ul>
        </div>

        {/* Bug Prone */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2 text-red-500">
            <AlertCircle size={12} /> Bug-Prone Modules
          </h4>
          <div className="space-y-2">
            {activity.bugProneModules.map((module, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-mono text-gray-700 dark:text-gray-300">{module.name}</span>
                <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded font-bold">
                  {module.issueCount} issues
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
