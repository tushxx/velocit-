
import React, { useState } from 'react';
import { Terminal, Globe, Copy, Check, FileCode, FileJson, Server, ChevronRight, Play, Settings, Command, Search } from 'lucide-react';

const DOCS_DATA = [
  {
    id: 'sdk',
    filename: 'analysis.ts',
    label: 'Node.js SDK',
    icon: FileCode,
    lang: 'typescript',
    description: 'Integrate deep analysis into your backend services.',
    code: `import { Velocit } from '@velocit/sdk';

const client = new Velocit(process.env.VELOCIT_KEY);

// 1. Queue a deep analysis job
const job = await client.analyze({
  repo: 'https://github.com/facebook/react',
  branch: 'main',
  options: {
    parseDepth: 'deep',
    includeDependencies: true
  }
});

// 2. Listen for real-time progress
client.on('progress', (p) => {
  console.log(\`Scanning: \${p.percent}%\`);
});

// 3. Get the architectural graph
const result = await job.waitForCompletion();
console.log(result.topology.nodes.length); // 1,402`
  },
  {
    id: 'api',
    filename: 'curl.sh',
    label: 'REST API',
    icon: Terminal,
    lang: 'bash',
    description: 'Universal access via standard HTTP methods.',
    code: `# Submit a repository for analysis
curl -X POST https://api.velocit.ai/v1/jobs \\
  -H "Authorization: Bearer vlc_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://github.com/vercel/next.js",
    "webhook": "https://api.yourapp.com/hooks/velocit",
    "async": true
  }'

# Response: {"job_id": "job_8f92x...", "status": "queued"}`
  },
  {
    id: 'cicd',
    filename: 'pipeline.yaml',
    label: 'GitHub Actions',
    icon: FileJson,
    lang: 'yaml',
    description: 'Automate architecture reviews on Pull Request.',
    code: `name: Velocit Architecture Check
on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Architecture Scan
        uses: velocit-ai/action@v2
        with:
          api-key: \${{ secrets.VELOCIT_KEY }}
          fail-on-risk: 80
          comment-on-pr: true`
  }
];

export const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeDoc = DOCS_DATA[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDoc.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax Highlighting (Theme-aware + Brand Green Theme)
  const highlightCode = (code: string, lang: string) => {
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Common
    html = html.replace(/\/\/.*/g, '<span class="text-gray-500 dark:text-neutral-500 italic">$1</span>'); // Comments
    html = html.replace(/# .*/g, '<span class="text-gray-500 dark:text-neutral-500 italic">$1</span>'); // Bash Comments

    // Strings (Brand Green)
    html = html.replace(/(['"`])(.*?)\1/g, '<span class="text-[#00d907]">$1$2$1</span>');

    if (lang === 'typescript') {
      // Keywords (Dark/Bold)
      html = html.replace(/\b(import|from|const|await|new|export|async|function|return)\b/g, '<span class="text-gray-900 dark:text-white font-semibold">$1</span>');
      // Methods/Functions
      html = html.replace(/\b(analyze|log|on|waitForCompletion)\b/g, '<span class="text-gray-600 dark:text-neutral-300">$1</span>');
    } else if (lang === 'bash') {
      html = html.replace(/\b(curl)\b/g, '<span class="text-gray-900 dark:text-white font-bold">$1</span>');
      html = html.replace(/(-X|-H|-d)/g, '<span class="text-gray-500 dark:text-neutral-400">$1</span>');
    } else if (lang === 'yaml') {
      html = html.replace(/^([a-z-]+):/gm, '<span class="text-gray-900 dark:text-white font-semibold">$1</span>:');
    }
    
    return html;
  };

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-t border-gray-200 dark:border-white/5 relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e508_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e508_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="mb-16 text-left">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Built for <span className="text-[#00d907]">Developers</span>
             </h2>
             <p className="text-gray-500 dark:text-neutral-500">
                Integrate architectural analysis directly into your workflow with our type-safe SDKs and CLI tools.
             </p>
          </div>

          {/* IDE Window Container */}
          <div className="max-w-5xl mx-auto bg-gray-100 dark:bg-[#0A0A0A] rounded-xl border border-gray-300 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] ring-1 ring-gray-200 dark:ring-white/5">
             
             {/* Left: IDE Sidebar */}
             <div className="w-full md:w-64 bg-gray-50 dark:bg-[#0F0F0F] border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/5 flex flex-col">
                {/* Traffic Lights */}
                <div className="p-4 flex gap-2 border-b border-gray-200 dark:border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>

                <div className="p-3 text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                   <span>Project Explorer</span>
                   <Settings size={10} />
                </div>
                
                <div className="flex-1 overflow-y-auto">
                   {DOCS_DATA.map((doc, index) => {
                      const Icon = doc.icon;
                      const isActive = activeTab === index;
                      return (
                         <button
                            key={doc.id}
                            onClick={() => setActiveTab(index)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-all border-l-2 ${
                                isActive 
                                ? 'bg-gray-200 dark:bg-white/5 text-gray-900 dark:text-white border-[#00d907]' 
                                : 'text-gray-500 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 hover:bg-gray-100 dark:hover:bg-white/5 border-transparent'
                            }`}
                         >
                            <Icon size={14} className={isActive ? 'text-[#00d907]' : 'text-gray-400 dark:text-neutral-600'} />
                            <span className="font-mono">{doc.filename}</span>
                         </button>
                      );
                   })}
                </div>
                
                {/* Search Box Mock */}
                <div className="p-4 border-t border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#050505] rounded border border-gray-300 dark:border-white/5 text-xs text-gray-500 dark:text-neutral-500 font-mono">
                        <Search size={12} />
                        <span>Search docs...</span>
                        <span className="ml-auto text-[10px] border border-gray-300 dark:border-white/10 px-1 rounded">⌘K</span>
                    </div>
                </div>
             </div>

             {/* Right: Code Editor Area */}
             <div className="flex-1 flex flex-col bg-white dark:bg-[#050505] relative group">
                
                {/* Editor Header / Tabs */}
                <div className="h-10 bg-gray-100 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-white/5 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2">
                         <div className="px-3 py-1.5 bg-white dark:bg-[#050505] border-t-2 border-[#00d907] text-gray-700 dark:text-neutral-300 text-xs font-mono flex items-center gap-2 rounded-t-sm">
                            <activeDoc.icon size={12} className="text-[#00d907]" />
                            {activeDoc.filename}
                            <span className="ml-2 text-gray-400 dark:text-neutral-600 hover:text-gray-900 dark:hover:text-white cursor-pointer">×</span>
                         </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={handleCopy}
                            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Copy Code"
                         >
                            {copied ? <Check size={14} className="text-[#00d907]" /> : <Copy size={14} />}
                         </button>
                    </div>
                </div>

                {/* Code Area */}
                <div className="flex-1 p-6 overflow-x-auto relative">
                    <pre className="font-mono text-sm leading-relaxed">
                        <code dangerouslySetInnerHTML={{ __html: highlightCode(activeDoc.code, activeDoc.lang) }} />
                    </pre>
                </div>

                {/* Footer Status Bar */}
                <div className="h-6 bg-[#00d907] text-black text-[10px] font-bold font-mono flex items-center justify-between px-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                             <Command size={10} />
                             <span>NORMAL</span>
                        </div>
                        <span>{activeDoc.lang.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-80">
                         <Play size={10} className="fill-current" />
                         <span>Ready</span>
                    </div>
                </div>

             </div>
          </div>

       </div>
    </section>
  );
};
