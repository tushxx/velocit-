
import React from 'react';
import { Github, Cloud, Database, Box, Terminal, Cpu, Globe, Server } from 'lucide-react';

export const TrustedBy: React.FC = () => {
  const brands = [
    { name: 'GitHub', icon: Github },
    { name: 'AWS', icon: Cloud },
    { name: 'Vercel', icon: Globe },
    { name: 'Docker', icon: Box },
    { name: 'PostgreSQL', icon: Database },
    { name: 'TypeScript', icon: Terminal },
    { name: 'Redis', icon: Server },
    { name: 'Node.js', icon: Cpu },
  ];

  return (
    <section className="py-10 bg-white dark:bg-[#030303] border-b border-gray-200 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <span className="text-xs font-bold uppercase text-gray-400 dark:text-neutral-600 whitespace-nowrap tracking-wider">
          Works seamlessly with
        </span>
        
        <div className="flex-1 overflow-hidden relative w-full mask-linear-fade">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#030303] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#030303] to-transparent z-10"></div>

            <div className="flex animate-scroll whitespace-nowrap hover:[animation-play-state:paused]">
                {[...brands, ...brands, ...brands].map((brand, i) => (
                    <div key={i} className="flex items-center gap-2 mx-8 text-gray-400 dark:text-neutral-600 hover:text-[#00d907] transition-colors cursor-default">
                        <brand.icon size={18} />
                        <span className="font-semibold text-sm">{brand.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <style>{`
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
};
