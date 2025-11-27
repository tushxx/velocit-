import React from 'react';
import { GitCommit, Search, ArrowRight, BrainCircuit, Box, CheckCircle2 } from 'lucide-react';

export const Timeline: React.FC = () => {
  const steps = [
    { title: "Connect", icon: Search, sub: "Enter Repo URL" },
    { title: "Clone", icon: GitCommit, sub: "Deep Fetch" },
    { title: "Parse", icon: Box, sub: "AST Generation" },
    { title: "Analyze", icon: BrainCircuit, sub: "AI Reasoning" },
    { title: "Visualize", icon: CheckCircle2, sub: "Ready" },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#030303] border-b border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-300">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
             <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Processing <span className="text-[#00d907]">Pipeline</span></h2>
                <p className="text-gray-500 dark:text-neutral-500">From raw URL to architectural insight in under 10 seconds.</p>
             </div>
             <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-neutral-600">
                <span className="w-2 h-2 rounded-full bg-[#00d907] animate-pulse"></span>
                SYSTEM READY
             </div>
          </div>

          <div className="relative">
             {/* Connecting Line */}
             <div className="absolute top-8 left-0 right-0 h-px bg-black/10 dark:bg-white/10 hidden md:block"></div>
             
             <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
               {steps.map((step, i) => (
                   <div key={i} className="relative flex flex-col items-center group">
                      {/* Node Point */}
                      <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/10 flex items-center justify-center relative z-10 mb-6 transition-all duration-300 group-hover:border-[#00d907] shadow-lg dark:shadow-none group-hover:shadow-[0_0_20px_rgba(0,217,7,0.2)]">
                          <step.icon size={24} className="text-gray-400 dark:text-neutral-500 group-hover:text-[#00d907] transition-colors" />
                          
                          {/* Progress Line Active (Hypothetical) */}
                          <div className="absolute -bottom-px left-0 right-0 h-px bg-[#00d907] scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      </div>
                      
                      <div className="text-center">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                          <p className="text-[10px] text-gray-500 dark:text-neutral-500 font-mono uppercase tracking-wider">{step.sub}</p>
                      </div>

                      {/* Arrow for mobile */}
                      {i !== steps.length - 1 && (
                          <div className="md:hidden absolute -right-4 top-6 text-gray-400 dark:text-neutral-700">
                              <ArrowRight size={16} />
                          </div>
                      )}
                   </div>
               ))}
             </div>
          </div>
       </div>
    </section>
  );
};