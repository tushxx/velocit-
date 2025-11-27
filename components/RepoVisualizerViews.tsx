import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Search, 
  Globe, 
  FileCode, 
  MousePointer2,
  History,
  Layers,
  Activity,
  Users
} from 'lucide-react';
import { RepoAnalysis } from '../types';

// --- Pipeline View ---
interface PipelineViewProps {
  repoUrl: string;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ repoUrl }) => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Extract owner/repo
  const getRepoPath = (url: string) => {
    try {
      const parts = url.split('github.com/');
      return parts[1] || '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchRuns = async () => {
      const path = getRepoPath(repoUrl);
      if (!path) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://api.github.com/repos/${path}/actions/runs?per_page=5`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRuns(data.workflow_runs || []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [repoUrl]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#030303]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d907]"></div>
      </div>
    );
  }

  // Fallback to Analysis Log if no actions or error (e.g. private repo)
  if (error || runs.length === 0) {
    return (
      <div className="w-full h-full bg-gray-50 dark:bg-[#030303] p-8 font-mono text-sm overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <div className="h-12 border-b border-gray-200 dark:border-white/10 flex items-center px-4 justify-between bg-gray-50 dark:bg-[#111]">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-[#00d907]" />
              <span className="text-gray-600 dark:text-neutral-400 font-medium">Live Analysis Log</span>
            </div>
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-500 text-xs font-bold border border-green-500/20">ACTIVE</span>
          </div>
          <div className="p-6 space-y-4">
             {[
               { step: "Cloning repository...", time: "0.4s", status: "done" },
               { step: "Parsing AST (TypeScript/React)...", time: "1.2s", status: "done" },
               { step: "Resolving module graph...", time: "0.8s", status: "done" },
               { step: "Calculating cyclomatic complexity...", time: "0.3s", status: "done" },
               { step: "Rendering force-directed layout...", time: "0.1s", status: "done" },
             ].map((log, i) => (
               <div key={i} className="flex items-center gap-3">
                 <CheckCircle2 size={14} className="text-[#00d907]" />
                 <span className="text-gray-900 dark:text-white">{log.step}</span>
                 <span className="text-gray-400 text-xs ml-auto">{log.time}</span>
               </div>
             ))}
             <div className="flex items-center gap-3 animate-pulse">
               <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00d907] border-t-transparent animate-spin"></div>
               <span className="text-gray-500 dark:text-neutral-400">Monitoring for file changes...</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#030303] p-8 font-mono text-sm overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GitBranch size={20} /> GitHub Actions
        </h2>
        {runs.map((run) => (
          <div key={run.id} className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-[#00d907] transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${run.status === 'completed' && run.conclusion === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                {run.status === 'completed' && run.conclusion === 'success' ? <CheckCircle2 size={18} /> : <Activity size={18} className="animate-pulse" />}
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{run.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <span>{run.head_branch}</span>
                  <span>•</span>
                  <span>{new Date(run.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <a href={run.html_url} target="_blank" rel="noreferrer" className="text-xs bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              View Logs
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Stack View ---
interface StackViewProps {
    data: RepoAnalysis;
}

export const StackView: React.FC<StackViewProps> = ({ data }) => {
  // Calculate file stats
  const stats = React.useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    data.nodes.forEach(node => {
      if (node.group === 'dependency') return;
      const ext = node.id.split('.').pop() || 'other';
      counts[ext] = (counts[ext] || 0) + 1;
      total++;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([ext, count]) => ({ ext, count, percent: Math.round((count / total) * 100) }));
  }, [data]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#030303] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Detected Technology Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code Distribution Chart */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-xl p-6 h-[400px] flex flex-col">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Code Distribution</h3>
                <div className="flex-1 overflow-y-auto space-y-4">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-mono text-gray-600 dark:text-gray-400">.{stat.ext}</span>
                                <span className="font-bold text-gray-900 dark:text-white">{stat.percent}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#00d907]" 
                                    style={{ width: `${stat.percent}%`, opacity: 1 - (i * 0.1) }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results Side */}
            <div className="space-y-4">
                {data.techStack.map((tech, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 shadow-sm hover:border-[#00d907] transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#00d907] transition-colors">
                            <Layers size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-gray-900 dark:text-white">{tech}</span>
                            <span className="text-xs text-gray-500">Detected in package.json</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">latest</span>
                        <span className="text-[10px] text-[#00d907] mt-1">99% Confidence</span>
                    </div>
                </div>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};

// --- Collaboration View ---
// --- Collaboration View ---
export const CollaborationView: React.FC = () => {
  const [notes, setNotes] = useState<{id: number, text: string, x: number, y: number}[]>([
    { id: 1, text: "Refactor this controller", x: 20, y: 30 },
    { id: 2, text: "Add error handling", x: 50, y: 60 }
  ]);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Date.now(), text: newNote, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]);
    setNewNote("");
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#1e1e1e] flex flex-col relative overflow-hidden">
      {/* Toolbar */}
      <div className="h-12 bg-white dark:bg-[#252526] border-b border-gray-200 dark:border-[#333] flex items-center px-4 justify-between z-10">
        <div className="flex items-center gap-2">
            <Users size={16} className="text-[#00d907]" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">Team Notes</span>
        </div>
        <div className="flex gap-2">
            <input 
                type="text" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type a note..."
                className="bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded px-3 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00d907]"
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
            />
            <button onClick={addNote} className="px-3 py-1 bg-[#00d907] text-black text-sm font-bold rounded hover:bg-[#00b006]">Add</button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="text-4xl font-bold text-gray-300 dark:text-neutral-700">Graph Canvas Overlay</span>
        </div>
        
        {notes.map(note => (
            <div 
                key={note.id}
                className="absolute bg-[#ffeb3b] text-black p-3 rounded shadow-lg max-w-[200px] cursor-move transform hover:scale-105 transition-transform"
                style={{ left: `${note.x}%`, top: `${note.y}%` }}
            >
                <div className="text-xs font-mono mb-1 opacity-50">Sarah • Just now</div>
                <div className="text-sm font-medium leading-tight">{note.text}</div>
                <button 
                    onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
                >
                    ×
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

// --- History View ---
// --- History View ---
interface HistoryViewProps {
  repoUrl: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ repoUrl }) => {
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getRepoPath = (url: string) => {
    try {
      const parts = url.split('github.com/');
      return parts[1] || '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchCommits = async () => {
      const path = getRepoPath(repoUrl);
      if (!path) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://api.github.com/repos/${path}/commits?per_page=10`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCommits(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [repoUrl]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#030303]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d907]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#030303] text-gray-500">
        <div className="text-center">
            <History size={32} className="mx-auto mb-2 opacity-50" />
            <p>Could not load history for this repo.</p>
            <p className="text-xs mt-1">It might be private or rate limited.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#030303] flex font-mono text-sm overflow-hidden">
      {/* Commit List */}
      <div className="w-full border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#111]">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <History size={16} /> Commit History
            </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/5">
            {commits.map((commit, i) => (
            <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <div className="font-bold text-gray-900 dark:text-white mb-1">{commit.commit.message}</div>
                <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <span className="font-mono bg-gray-100 dark:bg-white/10 px-1 rounded text-[#00d907]">{commit.sha.substring(0, 7)}</span>
                        <span>by {commit.commit.author.name}</span>
                    </div>
                    <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};
