
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Github, Zap, Folder, FileText, ArrowRight, Lock, Eye, GitBranch, Code, Terminal, CheckCircle2, Loader2, Play } from 'lucide-react';

interface InteractiveGraphHeroProps {
  onVisualize: (url: string) => void;
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  theme: 'dark' | 'light';
}

// Mock Data for the "Real" Visualization Demo
const DEMO_GRAPH_DATA = {
  nodes: [
    { id: 'root', group: 'config', val: 20, label: 'velocit-ai/core' },
    { id: 'src', group: 'folder', val: 15, label: 'src' },
    { id: 'lib', group: 'folder', val: 12, label: 'lib' },
    { id: 'components', group: 'folder', val: 12, label: 'components' },
    { id: 'api', group: 'folder', val: 12, label: 'api' },
    { id: 'utils.ts', group: 'file', val: 8, label: 'utils.ts' },
    { id: 'parser.ts', group: 'file', val: 10, label: 'parser.ts' },
    { id: 'graph.ts', group: 'file', val: 10, label: 'graph.ts' },
    { id: 'types.d.ts', group: 'file', val: 6, label: 'types' },
    { id: 'index.ts', group: 'file', val: 8, label: 'index.ts' },
    { id: 'db', group: 'database', val: 10, label: 'database' },
    { id: 'schema.prisma', group: 'file', val: 8, label: 'schema' },
    { id: 'auth', group: 'folder', val: 10, label: 'auth' },
    { id: 'package.json', group: 'file', val: 8, label: 'package.json' },
  ],
  links: [
    { source: 'root', target: 'src' },
    { source: 'root', target: 'package.json' },
    { source: 'src', target: 'lib' },
    { source: 'src', target: 'components' },
    { source: 'src', target: 'api' },
    { source: 'lib', target: 'parser.ts' },
    { source: 'lib', target: 'graph.ts' },
    { source: 'lib', target: 'utils.ts' },
    { source: 'components', target: 'index.ts' },
    { source: 'api', target: 'db' },
    { source: 'db', target: 'schema.prisma' },
    { source: 'src', target: 'types.d.ts' },
    { source: 'src', target: 'auth' },
  ]
};

// Interactive D3 Graph Component
const InteractiveHeroGraph = ({ theme }: { theme: 'dark' | 'light' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Zoom Group
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    // Initial Center
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(width / 2, height / 2).scale(1));

    const nodes = DEMO_GRAPH_DATA.nodes.map(d => ({ ...d }));
    const links = DEMO_GRAPH_DATA.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("collide", d3.forceCollide().radius(25))
      .force("center", d3.forceCenter(0, 0)); // Center at (0,0) because we translate to center

    // Dynamic Colors based on Theme
    const linkColor = theme === 'dark' ? '#333' : '#94a3b8'; // Darker gray for light mode
    const nodeStroke = theme === 'dark' ? '#333' : '#94a3b8'; // Darker gray for light mode
    const textColor = theme === 'dark' ? '#e5e5e5' : '#1f2937'; // Darker text for light mode

    // Links
    const link = g.append("g")
      .attr("stroke", linkColor)
      .attr("stroke-opacity", theme === 'dark' ? 0.6 : 0.8) // Higher opacity for light mode
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-grab active:cursor-grabbing")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node Circle
    node.append("circle")
      .attr("r", d => d.val + 5)
      .attr("fill", d => {
        switch(d.group) {
            case 'api': return '#00d907';
            case 'database': return '#3B82F6';
            case 'component': return '#A855F7';
            case 'config': return '#EAB308';
            case 'folder': return '#3B82F6';
            default: return '#10B981';
        }
      })
      .attr("stroke", nodeStroke)
      .attr("stroke-width", 2)
      .attr("class", "transition-all duration-300 hover:stroke-[#00d907]");

    // Node Icon/Label
    node.append("text")
      .text(d => d.label)
      .attr("dy", d => d.val + 18)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", textColor)
      .attr("font-weight", theme === 'dark' ? "normal" : "bold") // Bolder text in light mode
      .style("font-family", "Inter, monospace")
      .style("pointer-events", "none")
      .style("text-shadow", theme === 'dark' ? "0 2px 4px rgba(0,0,0,0.5)" : "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, [theme]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden cursor-move">
        <svg ref={svgRef} className="w-full h-full animate-fade-in" />
    </div>
  );
};

export const InteractiveGraphHero: React.FC<InteractiveGraphHeroProps> = ({ onVisualize, repoUrl, setRepoUrl, theme }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runDemo = () => {
    if (status !== 'idle') return;
    setStatus('scanning');
    setLogs([]);

    const logLines = [
        "> connecting to remote...",
        "> git clone velocit-ai/core --depth=1",
        "> analyzing file structure...",
        "> detected typescript v5.2 config",
        "> found 14 modules, 3 db schemas",
        "> resolving dependency graph...",
        "> generating topology...",
        "> optimization complete."
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= logLines.length) {
            clearInterval(interval);
            setTimeout(() => setStatus('complete'), 400);
        } else {
            setLogs(prev => [...prev, logLines[i]]);
            i++;
        }
    }, 400); // Speed of logs
  };

  // Circuit board style paths (Manhattan routing) - Outer to Inner flow
  // M x y (Start) -> L x y (Corners) -> End at Chip Pins
  const circuitPaths = [
    "M -100 -220 L -100 -120 L -20 -120 L -20 -70", // Top L
    "M 120 -200 L 120 -100 L 20 -100 L 20 -70",     // Top R
    "M 220 -80 L 110 -80 L 110 -20 L 70 -20",       // Right T
    "M 240 80 L 140 80 L 140 20 L 70 20",           // Right B
    "M 100 240 L 100 150 L 20 150 L 20 70",         // Bottom R
    "M -80 220 L -80 110 L -20 110 L -20 70",       // Bottom L
    "M -240 100 L -130 100 L -130 20 L -70 20",     // Left B
    "M -220 -60 L -100 -60 L -100 -20 L -70 -20"    // Left T
  ];

  return (
    <div className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white overflow-hidden selection:bg-[#00d907]/20 transition-colors duration-300">
       
       {/* =========================================
           SECTION 1: HERO
           ========================================= */}
       <section className="relative min-h-[75vh] flex flex-col justify-center border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#030303] pt-24 md:pt-36 pb-20 transition-colors duration-300">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
              <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#00d907]/5 rounded-full blur-[120px] animate-pulse-slow"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-start justify-center relative">
                
                {/* Decorative Line */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00d907]/20 to-transparent hidden lg:block"></div>

                {/* Version Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-mono text-gray-500 dark:text-neutral-400 mb-8 animate-fade-in transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d907]"></span>
                    <span>SYSTEM_READY_V2.0</span>
                </div>

                {/* Hero Quote */}
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-left mb-6 leading-[0.9] select-none z-20">
                    <span className="block text-gray-900 dark:text-white transition-colors">Code.</span>
                    <span className="block text-gray-500 dark:text-neutral-500 transition-colors">Analyze.</span>
                    <span className="block text-[#00d907]">Visualize.</span>
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-700 dark:text-neutral-400 mb-10 max-w-lg leading-relaxed animate-fade-in font-light transition-colors" style={{ animationDelay: '0.1s' }}>
                    Turn complex GitHub repositories into interactive architectural diagrams instantly. 
                </p>

                {/* Input Field */}
                <div className="w-full max-w-md relative z-30 group animate-fade-in mb-10" style={{ animationDelay: '0.2s' }}>
                    <div className="relative bg-gray-50 dark:bg-[#0A0A0A] rounded-lg flex items-center p-1.5 border border-gray-200 dark:border-white/10 focus-within:border-[#00d907]/50 transition-all duration-300 shadow-sm dark:shadow-none">
                        <div className="pl-4 pr-3 text-gray-400 dark:text-neutral-600">
                            <Github size={20} />
                        </div>
                        <input 
                            type="text" 
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="github.com/owner/repo"
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-700 font-mono text-sm h-10 w-full min-w-0"
                            onKeyDown={(e) => e.key === 'Enter' && repoUrl && onVisualize(repoUrl)}
                        />
                        <button 
                            onClick={() => repoUrl && onVisualize(repoUrl)}
                            disabled={!repoUrl}
                            className="px-6 h-10 bg-[#00d907] hover:bg-[#00b006] text-black font-bold rounded-md transition-all flex items-center gap-2 text-xs uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analyze
                        </button>
                    </div>
                </div>

                {/* Green Dev Language Footer */}
                <div className="flex flex-col gap-2 font-mono text-[10px] text-[#00d907]/80 animate-fade-in opacity-80" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-2">
                        <Terminal size={12} />
                        <span>$ init velocit-engine --verbose</span>
                    </div>
                    <div className="pl-5 text-gray-400 dark:text-neutral-500 transition-colors">
                        <span>{'>'} Loading parser modules... [OK]</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Schematic Illustration */}
            <div className="hidden lg:flex items-center justify-end relative perspective-1200 opacity-100 lg:translate-x-12">
                {/* The Logo Illustration */}
                <div className="relative w-full max-w-[640px] aspect-square animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <svg viewBox="0 0 500 500" className="w-full h-full text-gray-900 dark:text-white transition-colors duration-500">
                        <defs>
                            <pattern id="hero-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="0.5" fill="currentColor" fillOpacity="0.3" />
                            </pattern>
                            <linearGradient id="hero-bolt-gradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={theme === 'dark' ? 'white' : 'black'} stopOpacity="0.1" />
                                <stop offset="100%" stopColor={theme === 'dark' ? 'white' : 'black'} stopOpacity="0.02" />
                            </linearGradient>
                            <filter id="hero-glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                             <filter id="green-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00d907" floodOpacity="0.6"/>
                            </filter>
                            <marker id="terminal-dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                                <circle cx="3" cy="3" r="1.5" className="fill-gray-400 dark:fill-[#555]" />
                            </marker>
                        </defs>

                        {/* Background subtle grid */}
                        <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" opacity="0.1" mask="url(#hero-fade-mask)" />
                        
                        <mask id="hero-fade-mask">
                            <radialGradient id="hero-fade-grad">
                                <stop offset="0%" stopColor="white" />
                                <stop offset="100%" stopColor="black" />
                            </radialGradient>
                            <rect width="100%" height="100%" fill="url(#hero-fade-grad)" />
                        </mask>

                        <g transform="translate(250, 250)">
                            <g transform="rotate(-15) skewX(-10)">
                                {/* Chip Body */}
                                <rect x="-70" y="-70" width="140" height="140" rx="24"
                                    className="fill-gray-100 dark:fill-[#0A0A0A] stroke-gray-300 dark:stroke-[#222] transition-colors duration-300"
                                    strokeWidth="1"
                                />
                                {/* Inner Grid on Chip */}
                                <rect x="-60" y="-60" width="120" height="120" rx="16"
                                    fill="url(#hero-grid-pattern)" opacity="0.3"
                                />

                                {/* Pins */}
                                {[
                                   // Top
                                   { x: -20, y: -70 }, { x: 20, y: -70 },
                                   // Bottom
                                   { x: -20, y: 70 }, { x: 20, y: 70 },
                                   // Left
                                   { x: -70, y: -20 }, { x: -70, y: 20 },
                                   // Right
                                   { x: 70, y: -20 }, { x: 70, y: 20 }
                                ].map((pos, i) => (
                                    <rect key={i} 
                                        x={pos.x < 0 && Math.abs(pos.x) > Math.abs(pos.y) ? pos.x - 4 : pos.x > 0 && Math.abs(pos.x) > Math.abs(pos.y) ? pos.x : pos.x - 3}
                                        y={pos.y < 0 && Math.abs(pos.y) > Math.abs(pos.x) ? pos.y - 4 : pos.y > 0 && Math.abs(pos.y) > Math.abs(pos.x) ? pos.y : pos.y - 3}
                                        width={Math.abs(pos.x) > Math.abs(pos.y) ? 4 : 6}
                                        height={Math.abs(pos.y) > Math.abs(pos.x) ? 4 : 6}
                                        className="fill-gray-300 dark:fill-[#333] transition-colors duration-300"
                                    />
                                ))}

                                {/* Circuit Traces (Angular/Tech Style) */}
                                {circuitPaths.map((path, i) => (
                                    <g key={i}>
                                        {/* Circuit Trace (Base) */}
                                        <path 
                                            d={path} 
                                            strokeWidth="1" 
                                            fill="none" 
                                            className="stroke-gray-300 dark:stroke-[#333] transition-colors duration-300"
                                            opacity="0.3"
                                            markerStart="url(#terminal-dot)"
                                        />
                                        
                                        {/* Data Packet (Energy Flow) */}
                                        <path 
                                            d={path} 
                                            stroke="#00d907" 
                                            strokeWidth="1.5" 
                                            fill="none" 
                                            strokeDasharray="40 300" 
                                            strokeLinecap="square"
                                            opacity="0.8"
                                            filter="url(#green-glow)"
                                        >
                                            <animate attributeName="stroke-dashoffset" from="340" to="0" dur={`${3 + (i % 2) * 1.5}s`} repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" dur={`${3 + (i % 2) * 1.5}s`} repeatCount="indefinite" />
                                        </path>
                                    </g>
                                ))}

                                {/* Central Logo Bolt */}
                                <g transform="scale(3.5) translate(-12, -12)" className="animate-pulse-slow">
                                    <path 
                                        d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                                        fill="url(#hero-bolt-gradient)"
                                    />
                                    <path 
                                        d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
                                        fill="none" 
                                        stroke="#00d907" 
                                        strokeWidth="0.5" 
                                        strokeLinejoin="round"
                                        filter="url(#green-glow)"
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

          </div>
       </section>

       {/* =========================================
           SECTION 2: DEMO INTERFACE (TRANSFORMATION)
           ========================================= */}
       <section className="relative min-h-[80vh] flex items-center justify-center py-24 px-6 bg-gray-50 dark:bg-[#030303] transition-colors duration-300 overflow-hidden">
           
           {/* Background Glows */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#00d907]/5 blur-[120px] rounded-full pointer-events-none"></div>

           <div className="max-w-6xl w-full mx-auto relative z-10">

               {/* THE TRANSFORMATION CARD */}
               <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-300 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row group ring-1 ring-black/5 dark:ring-white/5 hover:ring-black/10 dark:hover:ring-white/10 transition-all duration-500">
                   
                   {/* LEFT SIDE: IDE MOCK (SOURCE) */}
                   <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-r border-gray-300 dark:border-white/5 bg-gray-50 dark:bg-[#0F0F0F] flex flex-col relative transition-colors duration-500 overflow-hidden">
                       
                       {/* Scanning Laser Overlay */}
                       {status === 'scanning' && (
                           <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00d907] shadow-[0_0_30px_#00d907] z-50 animate-[scan-down_2s_ease-in-out_infinite] opacity-80">
                               <div className="absolute top-0 right-0 w-20 h-[200px] bg-gradient-to-l from-[#00d907]/20 to-transparent transform skew-x-12 origin-top-right"></div>
                           </div>
                       )}

                       {/* Window Chrome */}
                       <div className="h-10 bg-gray-100 dark:bg-[#0A0A0A] border-b border-gray-300 dark:border-white/5 flex items-center px-4 justify-between shrink-0">
                           <div className="flex gap-2 opacity-50">
                               <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                               <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                               <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                           </div>
                           <div className="px-3 py-1 rounded bg-white dark:bg-white/5 border border-gray-300 dark:border-white/5 text-[10px] font-mono text-gray-600 dark:text-neutral-500 flex items-center gap-2">
                               <Lock size={10} />
                               velocit-core / src / graph.ts
                           </div>
                           <div className="w-10"></div>
                       </div>

                       <div className="flex-1 flex overflow-hidden">
                           {/* Sidebar */}
                           <div className="w-48 border-r border-gray-300 dark:border-white/5 bg-gray-50 dark:bg-[#0C0C0C] hidden lg:flex flex-col">
                               <div className="p-3 text-[10px] font-bold text-gray-500 dark:text-neutral-600 uppercase tracking-wider">Explorer</div>
                               <div className="flex-1 overflow-y-auto">
                                   {[
                                       { n: 'src', type: 'folder', open: true },
                                       { n: 'components', type: 'folder', indent: 1 },
                                       { n: 'Graph.tsx', type: 'file', indent: 2 },
                                       { n: 'Node.tsx', type: 'file', indent: 2 },
                                       { n: 'lib', type: 'folder', indent: 1, open: true },
                                       { n: 'parser.ts', type: 'file', indent: 2 },
                                       { n: 'graph.ts', type: 'file', indent: 2, active: true },
                                       { n: 'utils.ts', type: 'file', indent: 2 },
                                       { n: 'package.json', type: 'file' },
                                       { n: 'tsconfig.json', type: 'file' },
                                   ].map((file, i) => (
                                       <div key={i} className={`flex items-center gap-2 py-1 px-3 text-xs font-mono cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${file.active ? 'bg-[#00d907]/10 text-green-700 dark:text-[#00d907]' : 'text-gray-600 dark:text-neutral-500'}`} style={{ paddingLeft: `${(file.indent || 0) * 12 + 12}px` }}>
                                           {file.type === 'folder' ? 
                                             <Folder size={12} className={file.active ? 'text-green-600 dark:text-[#00d907]' : 'text-blue-500/80'} /> : 
                                             <FileText size={12} className={file.active ? 'text-green-600 dark:text-[#00d907]' : 'text-gray-500 dark:text-neutral-600'} />
                                           }
                                           <span>{file.n}</span>
                                       </div>
                                   ))}
                               </div>
                           </div>

                           {/* Code Area */}
                           <div className="flex-1 bg-white dark:bg-[#0F0F0F] p-4 font-mono text-xs leading-relaxed overflow-hidden relative">
                               {/* Line Numbers */}
                               <div className="absolute left-0 top-4 bottom-0 w-8 text-right pr-3 text-gray-300 dark:text-neutral-700 select-none border-r border-gray-100 dark:border-transparent">
                                   {Array.from({length: 20}).map((_, i) => <div key={i}>{i + 1}</div>)}
                               </div>
                               
                               {/* Code Content */}
                               <div className="pl-8 text-gray-800 dark:text-neutral-400">
                                   <div className="text-purple-600 dark:text-[#C792EA] inline">import</div> <span className="text-yellow-600 dark:text-[#ECC48D]">{`{ Node, Edge }`}</span> <div className="text-purple-600 dark:text-[#C792EA] inline">from</div> <span className="text-green-600 dark:text-[#C3E88D]">'./types'</span>;
                                   <br />
                                   <div className="text-purple-600 dark:text-[#C792EA] inline">export class</div> <span className="text-yellow-600 dark:text-[#FFCB6B]">GraphEngine</span> <span className="text-blue-600 dark:text-[#89DDFF]">{`{`}</span>
                                   <br />
                                   &nbsp;&nbsp;<div className="text-purple-600 dark:text-[#C792EA] inline">private</div> <span className="text-blue-600 dark:text-[#82AAFF]">nodes</span>: <span className="text-yellow-600 dark:text-[#FFCB6B]">Map</span>&lt;<span className="text-yellow-600 dark:text-[#FFCB6B]">string</span>, <span className="text-yellow-600 dark:text-[#FFCB6B]">Node</span>&gt;;
                                   <br />
                                   &nbsp;&nbsp;<div className="text-purple-600 dark:text-[#C792EA] inline">constructor</div>() <span className="text-blue-600 dark:text-[#89DDFF]">{`{`}</span>
                                   <br />
                                   &nbsp;&nbsp;&nbsp;&nbsp;<div className="text-blue-600 dark:text-[#89DDFF]">this</div>.<span className="text-blue-600 dark:text-[#82AAFF]">nodes</span> = <div className="text-purple-600 dark:text-[#C792EA] inline">new</div> <span className="text-yellow-600 dark:text-[#FFCB6B]">Map</span>();
                                   <br />
                                   &nbsp;&nbsp;<span className="text-blue-600 dark:text-[#89DDFF]">{`}`}</span>
                                   <br />
                                   <br />
                                   &nbsp;&nbsp;<div className="text-purple-600 dark:text-[#C792EA] inline">public</div> <span className="text-blue-600 dark:text-[#82AAFF]">analyze</span>(<span className="text-orange-600 dark:text-[#F78C6C]">root</span>: <span className="text-yellow-600 dark:text-[#FFCB6B]">string</span>) <span className="text-blue-600 dark:text-[#89DDFF]">{`{`}</span>
                                   <br />
                                   &nbsp;&nbsp;&nbsp;&nbsp;<div className="text-gray-500 dark:text-[#546E7A] italic inline">// Recursive AST traversal</div>
                                   <br />
                                   &nbsp;&nbsp;&nbsp;&nbsp;<div className="text-purple-600 dark:text-[#C792EA] inline">const</div> <span className="text-orange-600 dark:text-[#F78C6C]">ast</span> = <span className="text-blue-600 dark:text-[#82AAFF]">parse</span>(<span className="text-orange-600 dark:text-[#F78C6C]">root</span>);
                                   <br />
                                   &nbsp;&nbsp;&nbsp;&nbsp;<div className="text-blue-600 dark:text-[#89DDFF]">this</div>.<span className="text-blue-600 dark:text-[#82AAFF]">walk</span>(<span className="text-orange-600 dark:text-[#F78C6C]">ast</span>);
                                   <br />
                                   &nbsp;&nbsp;<span className="text-blue-600 dark:text-[#89DDFF]">{`}`}</span>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* CENTER: INTERACTIVE BUTTON */}
                   <div 
                      onClick={runDemo}
                      className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-20 z-30 items-center justify-center pointer-events-none"
                   >
                       {/* The Button */}
                       <div className={`w-12 h-12 rounded-full bg-[#00d907] border-4 border-[#0A0A0A] flex items-center justify-center shadow-[0_0_30px_rgba(0,217,7,0.4)] transition-all duration-500 pointer-events-auto cursor-pointer group hover:scale-110 hover:shadow-[0_0_50px_rgba(0,217,7,0.6)] active:scale-95 ${status !== 'idle' ? 'scale-0 opacity-0' : 'opacity-100'}`}>
                            <Play size={18} className="ml-1 text-black fill-current" />
                       </div>
                   </div>


                   {/* RIGHT SIDE: TERMINAL & VISUALIZATION */}
                   <div className="w-full md:w-1/2 h-full bg-white dark:bg-[#050505] relative overflow-hidden flex items-center justify-center">
                       {/* Grid Background */}
                       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#050505] dark:via-transparent dark:to-transparent"></div>
                       
                       {/* STATE 1: IDLE PLACEHOLDER */}
                       {status === 'idle' && (
                           <div className="flex flex-col items-center justify-center opacity-30">
                               <div className="w-20 h-20 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
                                    <Zap size={24} className="text-white" />
                               </div>
                               <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em]">
                                   Awaiting Analysis
                               </p>
                           </div>
                       )}

                       {/* STATE 2: SCANNING TERMINAL */}
                       {status === 'scanning' && (
                           <div className="absolute inset-6 bg-[#0A0A0A]/90 backdrop-blur-md rounded-lg border border-[#00d907]/20 p-6 font-mono text-xs overflow-hidden flex flex-col shadow-2xl animate-fade-in z-20">
                               <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 text-[#00d907]">
                                   <Terminal size={14} />
                                   <span className="font-bold">velocit-cli analyze</span>
                               </div>
                               <div className="flex-1 overflow-y-auto space-y-3" ref={scrollRef}>
                                   {logs.map((log, i) => (
                                       <div key={i} className="text-neutral-300 flex gap-3">
                                           <span className="text-[#00d907]">➜</span>
                                           {log}
                                       </div>
                                   ))}
                                   <div className="animate-pulse text-[#00d907] block mt-2">_</div>
                               </div>
                           </div>
                       )}

                       {/* STATE 3: ACTIVE GRAPH */}
                       {status === 'complete' && (
                           <div className="w-full h-full relative animate-fade-in z-10">
                               <InteractiveHeroGraph theme={theme} />
                               
                               {/* HUD Overlay */}
                               <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                                   <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-[10px] font-mono text-[#00d907] flex items-center gap-2 shadow-lg">
                                       <span className="w-1.5 h-1.5 bg-[#00d907] rounded-full animate-pulse"></span>
                                       LIVE_TOPOLOGY
                                   </div>
                               </div>

                               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                                   <div className="flex gap-2">
                                        <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-[10px] text-neutral-400 flex flex-col">
                                            <span className="text-[8px] uppercase tracking-wider opacity-50">Nodes</span>
                                            <span className="font-mono text-white">14</span>
                                        </div>
                                        <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-[10px] text-neutral-400 flex flex-col">
                                            <span className="text-[8px] uppercase tracking-wider opacity-50">Links</span>
                                            <span className="font-mono text-white">13</span>
                                        </div>
                                        <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-md text-[10px] text-neutral-400 flex flex-col">
                                            <span className="text-[8px] uppercase tracking-wider opacity-50">Risk</span>
                                            <span className="font-mono text-[#00d907]">LOW</span>
                                        </div>
                                   </div>
                               </div>
                               
                               {/* Reset Button */}
                               <button 
                                 onClick={() => setStatus('idle')}
                                 className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all pointer-events-auto backdrop-blur-md group"
                               >
                                   <Loader2 size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                               </button>
                           </div>
                       )}
                   </div>
               </div>
               {/* BOTTOM TEXT */}
               <div className="text-center max-w-3xl mx-auto space-y-6 mt-24 relative z-20">
                   <h3 className="text-xs md:text-sm font-bold text-gray-500 dark:text-neutral-500 tracking-[0.3em] uppercase">
                       Instant Codebase Intelligence
                   </h3>
                   <p className="text-xl md:text-3xl text-gray-900 dark:text-white font-medium leading-relaxed">
                       Stop mentally compiling complex dependencies. Velocit generates <span className="text-[#00d907] relative inline-block">
                           <span className="relative z-10">living architectural maps</span>
                           <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#00d907]/20 -rotate-1 z-0 blur-[2px]"></span>
                       </span> directly from your git history, giving your team a shared <span className="text-gray-900 dark:text-white border-b border-[#00d907] pb-0.5">visual understanding</span> of the entire system.
                   </p>
               </div>

           </div>
       </section>
    </div>
  )
}
