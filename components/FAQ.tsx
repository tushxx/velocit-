
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: "How does Velocit handle private repositories?",
    a: "Velocit uses a temporary, read-only token to clone and analyze your repository in an ephemeral sandbox environment. The code is deleted immediately after the analysis graph is generated. We never store your source code persistently."
  },
  {
    q: "Is there a limit to the repository size?",
    a: "The free tier supports repositories up to 500MB. For larger monorepos or enterprise codebases, our Pro and Team plans offer distributed processing for repositories up to 10GB."
  },
  {
    q: "Can I export the architecture diagrams?",
    a: "Yes! You can export diagrams as SVG, PNG, or JSON format. Pro users can also embed live, auto-updating diagrams directly into their README.md or internal documentation."
  },
  {
    q: "Does it work with microservices?",
    a: "Absolutely. Velocit can analyze multiple repositories simultaneously and map out cross-service communication (HTTP/gRPC) to visualize your entire mesh topology."
  },
  {
    q: "What languages are supported?",
    a: "We currently have deep support for TypeScript/JavaScript, Python, Go, Rust, Java, and C#. Basic structural analysis works for almost any text-based language."
  },
  {
    q: "How secure is the analysis engine?",
    a: "Our engine runs in isolated containers with no internet access during the analysis phase. All data in transit is encrypted via TLS 1.3."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white py-24 border-t border-gray-200 dark:border-white/10 overflow-hidden relative min-h-screen flex items-center transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: FAQ List */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-0 border-t border-gray-200 dark:border-white/10">
              {faqs.map((faq, i) => (
                <div 
                  key={i}
                  className="border-b border-gray-200 dark:border-white/10"
                >
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between py-8 text-left group transition-colors hover:text-gray-600 dark:hover:text-neutral-300"
                  >
                    <span className="text-xl font-medium pr-8">{faq.q}</span>
                    <span className={`flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                      {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === i ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600 dark:text-neutral-400 text-lg leading-relaxed max-w-lg">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Logo Illustration (Black & White) */}
          <div className="relative h-full min-h-[500px] flex items-center justify-center lg:justify-end opacity-80">
             
             {/* Background Radial Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

             <div className="relative w-full max-w-[500px] aspect-square">
                <svg viewBox="0 0 500 500" className="w-full h-full text-gray-900 dark:text-white transition-colors duration-300">
                   <defs>
                      <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                         <circle cx="1" cy="1" r="0.5" fill="currentColor" fillOpacity="0.3" />
                      </pattern>
                      <linearGradient id="bolt-gradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                      </linearGradient>
                      <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                      </filter>
                   </defs>

                   {/* Dotted Background Grid */}
                   <rect width="100%" height="100%" fill="url(#grid-pattern)" opacity="0.2" mask="url(#fade-mask)" />
                   
                   <mask id="fade-mask">
                       <radialGradient id="fade-grad">
                           <stop offset="0%" stopColor="white" />
                           <stop offset="100%" stopColor="black" />
                       </radialGradient>
                       <rect width="100%" height="100%" fill="url(#fade-grad)" />
                   </mask>

                   {/* Composition Container */}
                   <g transform="translate(250, 250)">
                      
                      {/* Abstract Skewed Frame representing the logo box */}
                      <g transform="rotate(-15) skewX(-10)">
                         <rect x="-180" y="-180" width="360" height="360" rx="40" 
                               fill="none" 
                               stroke="currentColor" 
                               strokeWidth="1" 
                               strokeOpacity="0.3"
                               strokeDasharray="10 10" 
                         />
                         <rect x="-160" y="-160" width="320" height="320" rx="30" 
                               fill="none" 
                               stroke="currentColor" 
                               strokeWidth="0.5" 
                               strokeOpacity="0.1" 
                         />
                      </g>

                      {/* The Bolt */}
                      <g transform="scale(12) translate(-12, -12)">
                          {/* Inner Fill */}
                          <path 
                             d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                             fill="url(#bolt-gradient)"
                          />
                          
                          {/* Outline */}
                          <path 
                             d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                             fill="none" 
                             stroke="currentColor" 
                             strokeWidth="0.2"
                             strokeLinejoin="round"
                             filter="url(#glow)"
                          />
                          
                          {/* Inner Detail Lines */}
                          <path 
                             d="M12 2 L11 14 M12 10 L11 22" 
                             stroke="currentColor" 
                             strokeWidth="0.05" 
                             opacity="0.3"
                          />
                      </g>

                   </g>
                </svg>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
