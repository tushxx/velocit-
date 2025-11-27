import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Layers,
  Cpu,
  Users,
  History,
  MousePointer2,
  CheckCircle2,
  FileCode,
  Search,
  Globe,
  Zap,
  Cloud,
  Github,
  Terminal
} from "lucide-react";
import { Logo } from "./Logo";

// --- VISUALIZATION COMPONENTS ---

// 1. One Click Analysis (New Visual)
const OneClickVisual = () => {
  return (
    <div className="w-full h-full min-h-[240px] flex items-center justify-center bg-neutral-50 dark:bg-[#050505] relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Curved Connection Lines - Absolute */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block">
           <defs>
             <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#333" stopOpacity="0" />
                <stop offset="20%" stopColor="#333" />
                <stop offset="80%" stopColor="#333" />
                <stop offset="100%" stopColor="#333" stopOpacity="0" />
             </linearGradient>
           </defs>
           <path d="M 20% 50% C 35% 50%, 35% 50%, 50% 50%" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="opacity-50" />
           <path d="M 50% 50% C 65% 50%, 65% 50%, 80% 50%" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="opacity-50" />
        </svg>

        <div className="flex items-center gap-4 md:gap-12 relative z-20 scale-[0.65] md:scale-90 lg:scale-100 origin-center">
            {/* Box 1: Terminal */}
            <div className="w-40 h-40 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col p-5 relative group transition-transform hover:-translate-y-1 duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                {/* Window Controls */}
                <div className="flex gap-1.5 mb-4 opacity-40">
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                
                {/* Code Content */}
                <div className="space-y-2 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                    <div><span className="text-neutral-900 dark:text-white">git</span> add .</div>
                    <div><span className="text-neutral-900 dark:text-white">git</span> commit -m "fix"</div>
                    <div><span className="text-neutral-900 dark:text-white">git</span> push</div>
                </div>

                {/* Connector Point */}
                <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-[#1a1a1a] border border-white/20 rounded-full translate-x-1/2 z-30"></div>
            </div>

            {/* Box 2: GitHub */}
            <div className="w-40 h-40 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl flex items-center justify-center relative group transition-transform hover:-translate-y-1 duration-500 delay-75">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                 
                 {/* Connector Points */}
                 <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-[#1a1a1a] border border-white/20 rounded-full -translate-x-1/2 z-30"></div>
                 <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-[#1a1a1a] border border-white/20 rounded-full translate-x-1/2 z-30"></div>
                 
                 <Github size={56} className="text-neutral-900 dark:text-white" />
            </div>

            {/* Box 3: Deploy */}
            <div className="w-40 h-40 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center relative group transition-transform hover:-translate-y-1 duration-500 delay-150">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#00d907]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                 
                 {/* Connector Point */}
                 <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-[#1a1a1a] border border-white/20 rounded-full -translate-x-1/2 z-30"></div>
                 
                 <div className="mb-3 p-3 rounded-full bg-[#00d907]/10 text-[#00d907]">
                    <Zap size={32} className="fill-current" />
                 </div>
                 <div className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>your map is live</span>
                    <span className="text-yellow-400">✨</span>
                 </div>
            </div>
        </div>
    </div>
  );
};

// 2. Live Branch Monitoring (CI/CD Runner Skeleton)
const PipelineVisual = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-[#050505] p-6 font-mono text-[10px]">
      <div className="bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="h-8 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-3 justify-between bg-neutral-50 dark:bg-[#111]">
          <div className="flex items-center gap-2">
            <GitBranch size={12} className="text-neutral-500" />
            <span className="text-neutral-600 dark:text-neutral-400">feat/api-v2</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-[9px] font-bold">BUILDING</span>
        </div>

        {/* Steps List */}
        <div className="p-3 space-y-3">
          {[
            { name: "Install Dependencies", status: "done", time: "12s" },
            { name: "Run Tests", status: activeStep >= 1 ? "running" : "pending", time: activeStep >= 1 ? "..." : "" },
            { name: "Build Production", status: activeStep >= 2 ? "running" : "pending", time: "" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                step.status === 'done' ? 'bg-green-500 border-green-500 text-white' :
                step.status === 'running' ? 'border-yellow-500 text-yellow-500 animate-spin-slow' :
                'border-neutral-200 dark:border-neutral-700 text-neutral-300'
              }`}>
                {step.status === 'done' ? <CheckCircle2 size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${step.status === 'pending' ? 'text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>{step.name}</div>
                {step.status === 'running' && (
                  <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded mt-1 overflow-hidden">
                    <div className="h-full bg-yellow-500 w-1/2 animate-pulse"></div>
                  </div>
                )}
              </div>
              <div className="text-neutral-400">{step.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Smart Stack Detection (Dependency Analysis Skeleton)
const StackScannerVisual = () => {
  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-[#050505] flex relative overflow-hidden">
      {/* File Tree Side */}
      <div className="w-1/3 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0A0A0A] p-3 space-y-2">
        <div className="flex items-center gap-1 text-neutral-400 mb-2">
          <div className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-800"></div>
          <div className="h-2 w-12 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2 pl-4">
            <FileCode size={10} className="text-neutral-300" />
            <div className="h-1.5 w-16 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
          </div>
        ))}
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-1/3 h-0.5 bg-[#00d907] shadow-[0_0_10px_#00d907] animate-[scan-down_2s_linear_infinite]"></div>
      </div>

      {/* Results Side */}
      <div className="flex-1 p-4 space-y-3">
        <div className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider mb-2">Detected Frameworks</div>
        {[
          { name: "React", ver: "^18.2.0", color: "bg-blue-500" },
          { name: "Tailwind", ver: "^3.3.0", color: "bg-cyan-500" },
          { name: "PostgreSQL", ver: "15.0", color: "bg-blue-600" },
        ].map((tech, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] shadow-sm animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${tech.color} bg-opacity-10 text-${tech.color.replace('bg-', '')}`}>
                <div className={`w-2 h-2 rounded-full ${tech.color}`}></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-900 dark:text-white">{tech.name}</span>
                <span className="text-[8px] text-neutral-400">Confidence: 99%</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">{tech.ver}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Collaboration (IDE Skeleton)
const CollaborationVisual = () => {
  return (
    <div className="w-full h-full bg-white dark:bg-[#1e1e1e] flex flex-col font-mono text-[10px] overflow-hidden">
      {/* Tab Bar */}
      <div className="h-8 bg-neutral-100 dark:bg-[#252526] flex items-center">
        <div className="px-3 h-full bg-white dark:bg-[#1e1e1e] flex items-center gap-2 border-t-2 border-[#00d907] text-neutral-900 dark:text-white">
          <span className="text-blue-400">TS</span>
          <span>user.controller.ts</span>
          <span className="ml-2 text-neutral-500">×</span>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Line Numbers */}
        <div className="w-8 bg-white dark:bg-[#1e1e1e] text-neutral-400 dark:text-neutral-600 flex flex-col items-end pr-2 pt-2 space-y-1 select-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 p-2 text-neutral-800 dark:text-neutral-300 space-y-1 relative">
          <div><span className="text-purple-600 dark:text-purple-400">export</span> <span className="text-blue-600 dark:text-blue-400">class</span> UserController {'{'}</div>
          <div className="pl-4"><span className="text-purple-600 dark:text-purple-400">async</span> <span className="text-yellow-600 dark:text-yellow-300">getProfile</span>(req) {'{'}</div>
          <div className="pl-8 text-neutral-500">// Fetch user data</div>
          <div className="pl-8"><span className="text-purple-600 dark:text-purple-400">const</span> user = <span className="text-purple-600 dark:text-purple-400">await</span> db.find(req.id);</div>
          <div className="pl-8"><span className="text-purple-600 dark:text-purple-400">return</span> user;</div>
          <div className="pl-4">{'}'}</div>
          <div>{'}'}</div>

          {/* Cursor Sarah */}
          <div className="absolute top-8 left-32 animate-[move-cursor-1_4s_infinite] z-20">
            <div className="h-4 w-0.5 bg-purple-500 absolute"></div>
            <div className="absolute top-4 left-0 px-1.5 py-0.5 bg-purple-500 text-white rounded-b rounded-r text-[8px] font-bold whitespace-nowrap">Sarah</div>
          </div>

          {/* Cursor You */}
          <div className="absolute top-20 left-48 animate-[move-cursor-2_5s_infinite] z-20">
             <div className="h-4 w-0.5 bg-[#00d907] absolute"></div>
             <div className="absolute top-4 left-0 px-1.5 py-0.5 bg-[#00d907] text-black rounded-b rounded-r text-[8px] font-bold whitespace-nowrap">You</div>
          </div>
        </div>

        {/* User List Sidebar */}
        <div className="w-12 bg-neutral-100 dark:bg-[#252526] border-l border-neutral-200 dark:border-[#333] flex flex-col items-center py-2 gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-[#1e1e1e]">S</div>
          <div className="w-6 h-6 rounded-full bg-[#00d907] flex items-center justify-center text-black text-[10px] font-bold ring-2 ring-white dark:ring-[#1e1e1e]">Y</div>
          <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center text-white text-[8px] ring-2 ring-white dark:ring-[#1e1e1e]">+2</div>
        </div>
      </div>
    </div>
  );
};

// 5. Historical Analysis (Git History Skeleton)
const TimelineVisual = () => {
  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-[#050505] flex font-mono text-[10px]">
      {/* Commit List */}
      <div className="w-1/2 border-r border-neutral-200 dark:border-neutral-800 p-4 space-y-4 overflow-hidden">
        {[
          { msg: "feat: add user auth", hash: "8a2b9c", time: "2m ago", active: true },
          { msg: "fix: database connection", hash: "7b1a8d", time: "1h ago", active: false },
          { msg: "chore: update deps", hash: "6c0e7f", time: "3h ago", active: false },
        ].map((commit, i) => (
          <div key={i} className={`relative pl-4 ${commit.active ? 'opacity-100' : 'opacity-50'}`}>
            {/* Timeline Line */}
            <div className="absolute left-0 top-1 bottom-[-20px] w-px bg-neutral-300 dark:bg-neutral-700"></div>
            <div className={`absolute left-[-2px] top-1.5 w-1.5 h-1.5 rounded-full border ${commit.active ? 'bg-[#00d907] border-[#00d907]' : 'bg-white dark:bg-black border-neutral-400'}`}></div>
            
            <div className={`p-2 rounded border ${commit.active ? 'bg-white dark:bg-[#111] border-neutral-200 dark:border-neutral-700 shadow-sm' : 'border-transparent'}`}>
              <div className="font-bold text-neutral-900 dark:text-white mb-1">{commit.msg}</div>
              <div className="flex justify-between text-neutral-500 text-[8px]">
                <span>{commit.hash}</span>
                <span>{commit.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diff View */}
      <div className="flex-1 bg-white dark:bg-[#0A0A0A] p-4 flex flex-col gap-2">
        <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded mb-2"></div>
        <div className="space-y-1">
          <div className="h-3 w-full bg-red-500/10 border-l-2 border-red-500 flex items-center px-2 text-red-500">- const oldConfig = ...</div>
          <div className="h-3 w-full bg-green-500/10 border-l-2 border-green-500 flex items-center px-2 text-green-500">+ const newConfig = ...</div>
          <div className="h-3 w-3/4 bg-neutral-50 dark:bg-neutral-900 border-l-2 border-transparent px-2 text-neutral-400">  return config.init()</div>
        </div>
        <div className="mt-auto h-24 bg-neutral-50 dark:bg-neutral-900 rounded border border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400">
          No other changes
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const FeatureCard: React.FC<{
  icon?: any;
  title: string;
  description: string;
  className?: string;
  graphicAtTop?: boolean;
  children: React.ReactNode;
}> = ({ icon: Icon, title, description, className = "", graphicAtTop = false, children }) => (
  <div
    className={`group bg-gray-50 dark:bg-[#050505] border border-dashed border-neutral-300 dark:border-neutral-800 -ml-[1px] -mt-[1px] hover:border-[#00d907] hover:z-10 transition-all duration-300 flex flex-col overflow-hidden relative hover:shadow-[0_0_30px_rgba(0,217,7,0.1)] ${className}`}
  >
    {graphicAtTop ? (
       <>
         <div className="flex-1 flex flex-col relative z-0 min-h-[200px] group-hover:bg-neutral-900/10 transition-colors">
            {children}
         </div>
         <div className="p-8 relative z-10 border-t border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#050505]">
           <div className="flex items-center gap-3 mb-3">
             {Icon && (
                <div className="p-2 rounded-md bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500 group-hover:text-[#00d907] group-hover:border-[#00d907] transition-colors duration-300">
                    <Icon size={20} />
                </div>
             )}
             <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-[#00d907] transition-colors duration-300">
               {title}
             </h3>
           </div>
           <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed max-w-sm group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors">
             {description}
           </p>
         </div>
       </>
    ) : (
       <>
        <div className="p-8 pb-0 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {Icon && (
                <div className="p-2 rounded-md bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500 group-hover:text-[#00d907] group-hover:border-[#00d907] transition-colors duration-300 group-hover:scale-110 transform">
                <Icon size={20} />
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-[#00d907] transition-colors duration-300">
              {title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed max-w-sm mb-6 group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors">
            {description}
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-end relative z-0 mt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 min-h-[280px] group-hover:border-[#00d907]/30 transition-colors">
          {children}
        </div>
       </>
    )}
  </div>
);

export const BentoGrid: React.FC = () => {
  return (
    <section className="bg-white dark:bg-black py-32 px-6 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          
          <p className="text-gray-500 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            Velocit makes understanding complex codebases easy: from high-level
            topology to line-by-line analysis.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 isolate">
          
          {/* Card 1: One Click Visualize (Span 2) */}
          <FeatureCard
            title="One click analysis"
            description="Analyze your repo in seconds, with our one click visualization engine."
            className="md:col-span-2 min-h-[400px]"
            graphicAtTop={true}
          >
            <OneClickVisual />
          </FeatureCard>

          {/* Card 2: Pipeline */}
          <FeatureCard
            icon={GitBranch}
            title="Live Branch Monitoring"
            description="Automatically update architecture diagrams on every PR merge."
          >
            <PipelineVisual />
          </FeatureCard>

          {/* Card 3: Stack Detection */}
          <FeatureCard
            icon={Layers}
            title="Smart Stack Detection"
            description="Identifies frameworks, databases, and services automatically."
          >
            <StackScannerVisual />
          </FeatureCard>

          {/* Card 4: Collaboration (Span 2 to balance) */}
          <FeatureCard
            icon={Users}
            title="Real-time Collaboration"
            description="Pair program on architecture diagrams with live cursors and comments."
            className="md:col-span-2"
          >
            <CollaborationVisual />
          </FeatureCard>

          {/* Card 5: History (Span 3 - Full Width) */}
          <FeatureCard
            icon={History}
            title="Historical Analysis"
            description="Time travel through your architecture's evolution with a single click."
            className="md:col-span-3"
          >
            <TimelineVisual />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};