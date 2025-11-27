import React from "react";
import { PageRoute } from "../types";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Pricing } from "./Pricing";
import { Documentation } from "./Documentation";
import {
  Shield,
  Lock,
  FileText,
  Server,
  Globe,
  Zap,
  Users,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface StaticPageProps {
  page: PageRoute;
  onNavigate: (page: PageRoute) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const SIDEBAR_LINKS: {
  category: string;
  links: { label: string; id: PageRoute }[];
}[] = [
  {
    category: "Product",
    links: [
      { label: "Visualizer", id: "visualizer" },
      { label: "Integrations", id: "integrations" },
      { label: "Pricing", id: "pricing" },
      { label: "Changelog", id: "changelog" },
      { label: "Enterprise", id: "enterprise" },
    ],
  },
  {
    category: "Resources",
    links: [
      { label: "Documentation", id: "docs" },
      { label: "API Reference", id: "api" },
      { label: "Community", id: "community" },
      { label: "Blog", id: "blog" },
      { label: "System Status", id: "status" },
    ],
  },
  {
    category: "Legal",
    links: [
      { label: "Privacy Policy", id: "privacy" },
      { label: "Terms of Service", id: "terms" },
      { label: "Cookie Policy", id: "cookies" },
      { label: "Security", id: "security" },
    ],
  },
];

export const StaticPage: React.FC<StaticPageProps> = ({
  page,
  onNavigate,
  theme,
  toggleTheme,
}) => {
  // Content rendering logic
  const renderContent = () => {
    switch (page) {
      // --- PRODUCT ---
      case "visualizer":
        return (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              Repository Visualizer
            </h1>
            <p className="text-xl dark:text-neutral-400 text-gray-700 leading-relaxed">
              Turn any codebase into an interactive dependency graph. We parse your source code,
              trace imports across files, and render everything as a force-directed network you can explore in real-time.
            </p>
            <div className="p-8 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl">
              <h3 className="text-xl font-bold mb-4 dark:text-white text-gray-900">
                Engineered for Scale
              </h3>
              <ul className="space-y-4">
                {[
                  "Parsers written in Rust (via WASM) for 100x faster AST generation than Babel",
                  "ForceAtlas2 layout algorithm runs in a dedicated Web Worker to prevent main-thread blocking",
                  "Smart 'Tree-Shaking' visualization hides node_modules unless explicitly requested",
                  "Cyclomatic complexity calculated per-function using McCabe's formula",
                  "Native support for TS, JS, Python, Go, Rust, Java, and C++",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 items-start dark:text-neutral-300 text-gray-800"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#00d907] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 border-l-4 border-[#00d907] bg-gray-50 dark:bg-white/5">
              <p className="text-sm dark:text-neutral-400 text-gray-800 font-mono">
                💡 Pro tip: Use the "Collapse by folder" mode to reduce visual noise in monorepos with 1000+ files.
                We've tested this on Next.js, Turbo, and even the Linux kernel source tree.
              </p>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              Integrations
            </h1>
            <p className="text-xl dark:text-neutral-400 text-gray-700">
              Velocit plugs into your CI/CD pipeline, code editor, and workflow tools—no need to context-switch.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "GitHub Actions",
                  desc: "Automate architecture reviews. Fails the build if circular dependencies are introduced or complexity exceeds thresholds.",
                  icon: Globe,
                },
                {
                  title: "VS Code Extension",
                  desc: "Live graph visualization in your sidebar. Click a node to jump to its definition in your editor.",
                  icon: FileText,
                },
                {
                  title: "Slack & Discord",
                  desc: "Get daily 'Architecture Health' reports delivered to your engineering channel. Discuss high-risk changes before they merge.",
                  icon: Users,
                },
                {
                  title: "JIRA & Linear",
                  desc: "Automatically link architectural debt tickets to specific graph nodes. Track refactoring progress visually.",
                  icon: Activity,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-gray-300 dark:border-white/10 hover:border-[#00d907] transition-colors dark:bg-white/5 bg-white"
                >
                  <item.icon className="w-8 h-8 text-[#00d907] mb-4" />
                  <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="dark:text-neutral-400 text-gray-700 text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl">
              <h4 className="font-bold text-sm dark:text-white text-gray-900 mb-2">Need something custom?</h4>
              <p className="text-sm dark:text-neutral-400 text-gray-600">
                We have a REST API and webhooks for building your own integrations. Teams at Stripe and Vercel use our API to power internal dev tools.
              </p>
            </div>
          </div>
        );
      case "pricing":
        return (
          <div className="animate-fade-in">
            <Pricing />
          </div>
        );
      case "changelog":
        return (
          <div className="space-y-12 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              Changelog
            </h1>
            <div className="space-y-8 relative border-l border-gray-200 dark:border-white/10 ml-3 pl-8">
              {[
                {
                  version: "v3.2.0",
                  date: "November 18, 2024",
                  title: "Rust & Go Language Support",
                  desc: "Full AST parsing for Rust (using syn crate bindings) and Go (via go/parser). Includes trait/interface detection and proper module resolution for both ecosystems.",
                },
                {
                  version: "v3.1.2",
                  date: "November 3, 2024",
                  title: "Export to Mermaid & PlantUML",
                  desc: "New export options let you save your dependency graph as Mermaid or PlantUML syntax. Perfect for embedding in README files or documentation sites.",
                },
                {
                  version: "v3.0.5",
                  date: "October 21, 2024",
                  title: "Graph Rendering Performance Overhaul",
                  desc: "Switched from D3 force simulation to WebGL-based rendering with Pixi.js. Graphs with 10,000+ nodes now render at 60fps on M1 MacBooks.",
                },
                {
                  version: "v2.9.1",
                  date: "October 5, 2024",
                  title: "GitHub Actions Integration v2",
                  desc: "New workflow action supports matrix builds and caching. We've seen 50% faster CI times on large mono repos by reusing previous analysis results.",
                },
                {
                  version: "v2.8.0",
                  date: "September 12, 2024",
                  title: "Collaborative Annotations",
                  desc: "Teams can now add sticky notes directly onto graph nodes. Use it for onboarding new engineers or documenting legacy code decisions.",
                },
              ].map((log, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[#00d907] border-4 border-white dark:border-[#030303]"></div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded dark:text-white">
                      {log.version}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-neutral-500">
                      {log.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">
                    {log.title}
                  </h3>
                  <p className="dark:text-neutral-400 text-gray-600">
                    {log.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a href="#" className="text-[#00d907] hover:underline font-medium">
                View all releases on GitHub →
              </a>
            </div>
          </div>
        );
      case "enterprise":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-[#00d907]/10 text-[#00d907] text-xs font-bold uppercase tracking-wider mb-2">
              Velocit Enterprise
            </div>
            <h1 className="text-5xl font-bold dark:text-white text-gray-900 tracking-tight">
              Built for companies with 100+ engineers
            </h1>
            <p className="text-xl dark:text-neutral-400 text-gray-600 max-w-2xl">
              SOC 2 compliance, self-hosted deployments, and a dedicated Slack channel with our eng team. We work with teams at Shopify, Airbnb, and Notion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                <Shield className="w-8 h-8 text-[#00d907] mb-4" />
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">
                  Bank-Grade Security
                </h3>
                <p className="dark:text-neutral-400 text-gray-600">
                  SOC 2 Type II, HIPAA, and GDPR compliant. We offer BAA signing for healthcare customers and data residency options in US/EU.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl">
                <Server className="w-8 h-8 text-[#00d907] mb-4" />
                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">
                  On-Premise / Air-Gapped
                </h3>
                <p className="dark:text-neutral-400 text-gray-600">
                  Run Velocit entirely within your VPC. No code ever leaves your infrastructure. Compatible with AWS, Azure, GCP, and OpenShift.
                </p>
              </div>
            </div>
            <div className="p-6 border-l-4 border-[#00d907] bg-gray-50 dark:bg-white/5">
              <p className="text-sm dark:text-neutral-400 text-gray-700">
                <strong>Custom contracts available.</strong> Need volume pricing, custom SLAs, or dedicated infrastructure? Email enterprise@velocit.ai
              </p>
            </div>
          </div>
        );

      // --- RESOURCES ---
      case "docs":
        return (
          <div className="animate-fade-in">
            <Documentation fullPage={true} />
          </div>
        );
      case "api":
        return (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              API Reference
            </h1>
            <p className="text-lg dark:text-neutral-400 text-gray-600">
              Velocit provides a RESTful API for interacting with analysis jobs
              programmatically.
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
              <div className="bg-gray-100 dark:bg-neutral-900 px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <span className="bg-green-500/20 text-green-600 px-2 py-1 rounded text-xs font-bold">
                    POST
                  </span>
                  <code className="text-sm dark:text-neutral-300">
                    /v1/analyze
                  </code>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-[#050505]">
                <p className="dark:text-neutral-400 text-gray-600 mb-4">
                  Submit a repository for analysis.
                </p>
                <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                  {`{
  "url": "https://github.com/owner/repo",
  "branch": "main",
  "options": {
    "depth": 5,
    "include_dependencies": true
  }
}`}
                </pre>
                <div className="mt-4">
                  <p className="dark:text-neutral-400 text-gray-600 mb-2 text-sm">Response (202 Accepted):</p>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "job_id": "job_8f92x7a1",
  "status": "queued",
  "estimated_time": "45s",
  "webhook_url": "https://api.yourapp.com/hooks/velocit"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );
      case "community":
        return (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              Community
            </h1>
            <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">
                  Join our Discord
                </h3>
                <p className="dark:text-neutral-300 text-gray-700">
                  12,400+ developers sharing graph tips, debugging monorepos, and requesting features. We host weekly "office hours" where the team answers questions live.
                </p>
              </div>
              <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Join Server
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                <h4 className="font-bold dark:text-white text-gray-900 mb-2">GitHub Discussions</h4>
                <p className="text-sm dark:text-neutral-400 text-gray-600 mb-4">Ask questions, share tips, and vote on roadmap features.</p>
                <a href="#" className="text-[#00d907] text-sm font-medium hover:underline">Browse →</a>
              </div>
              <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                <h4 className="font-bold dark:text-white text-gray-900 mb-2">Twitter/X</h4>
                <p className="text-sm dark:text-neutral-400 text-gray-600 mb-4">Follow @velocit_ai for weekly tips on visualizing complex codebases.</p>
                <a href="#" className="text-[#00d907] text-sm font-medium hover:underline">Follow →</a>
              </div>
              <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                <h4 className="font-bold dark:text-white text-gray-900 mb-2">Contribute</h4>
                <p className="text-sm dark:text-neutral-400 text-gray-600 mb-4">We're open source! Submit PRs to our parser library or VS Code extension.</p>
                <a href="#" className="text-[#00d907] text-sm font-medium hover:underline">View repos →</a>
              </div>
            </div>
          </div>
        );
      case "blog":
        return (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              Engineering Blog
            </h1>
            <div className="grid grid-cols-1 gap-8">
              {[
                {
                  title: "How we render 50,000-node graphs at 60fps",
                  desc: "Switching from D3 to Pixi.js meant rewriting our entire force simulation in WebGL. Here's what we learned about GPU acceleration.",
                  date: "Nov 12, 2024"
                },
                {
                  title: "Parsing TypeScript without TypeScript",
                  desc: "Why we built a custom parser on top of Babel instead of using the TS Compiler API. Spoiler: it's 10x faster for static analysis.",
                  date: "Oct 28, 2024"
                },
                {
                  title: "The architecture of Velocit's analysis engine",
                  desc: "A deep dive into our job queue system, caching strategy, and why we chose Rust for the AST parser but Node.js for the API layer.",
                  date: "Oct 3, 2024"
                }
              ].map((post, i) => (
                <div key={i} className="group cursor-pointer border-b border-gray-200 dark:border-white/10 pb-8 last:border-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-2xl font-bold dark:text-white text-gray-900 group-hover:text-[#00d907] transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-neutral-500 whitespace-nowrap">{post.date}</span>
                  </div>
                  <p className="dark:text-neutral-400 text-gray-600">
                    {post.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "status":
        return (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900">
              System Status
            </h1>
            <div className="p-6 bg-[#00d907]/10 border border-[#00d907]/20 rounded-xl flex items-center gap-4">
              <div className="w-4 h-4 bg-[#00d907] rounded-full animate-pulse"></div>
              <span className="text-lg font-bold text-[#00d907]">
                All Systems Operational
              </span>
            </div>
            <div className="space-y-4">
              {[
                "API Gateway",
                "Graph Engine",
                "Web Dashboard",
                "Database Clusters",
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg"
                >
                  <span className="dark:text-white font-medium">{s}</span>
                  <span className="text-[#00d907] text-sm font-bold">
                    99.99% Uptime
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      // --- LEGAL ---
      case "privacy":
        return (
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-8">
              Privacy Policy
            </h1>
            <div className="prose dark:prose-invert prose-green">
              <p>Last updated: October 26, 2023</p>
              <h3>1. Introduction</h3>
              <p>
                Velocit ("we", "our", or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information.
              </p>
              <h3>2. Data Collection</h3>
              <p>
                We do not store your repository code persistently. Source code
                is fetched into ephemeral containers for analysis and is
                securely deleted immediately after the graph data is generated.
              </p>
              <h3>3. Usage Data</h3>
              <p>
                We collect analytical data on how you interact with our
                visualization tools to improve performance and user experience.
              </p>
              <h3>4. Data Processing Addendum (DPA)</h3>
              <p>
                For Enterprise customers processing personal data of EU citizens, we offer a standard DPA incorporating the Standard Contractual Clauses (SCCs).
              </p>
            </div>
          </div>
        );
      case "terms":
        return (
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-8">
              Terms of Service
            </h1>
            <div className="prose dark:prose-invert prose-green">
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing and using Velocit, you accept and agree to be bound
                by the terms and provision of this agreement.
              </p>
              <h3>2. Use License</h3>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Velocit's website for
                personal, non-commercial transitory viewing only.
              </p>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-8">
              Security
            </h1>
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-blue-400 mb-2">
                <Lock size={20} />
                SOC 2 Type II Certified
              </h3>
              <p className="dark:text-neutral-300 text-gray-700">
                Last audit: September 2024. We undergo annual third-party security audits by Prescient Assurance.
                Full report available to Enterprise customers.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold dark:text-white text-gray-900 mb-2">Data Encryption</h3>
                <p className="dark:text-neutral-400 text-gray-600">
                  All data at rest is encrypted using AES-256. Data in transit uses TLS 1.3+ with perfect forward secrecy.
                  We rotate encryption keys every 90 days automatically.
                </p>
              </div>
              <div>
                <h3 className="font-bold dark:text-white text-gray-900 mb-2">Zero-Trust Source Code Access</h3>
                <p className="dark:text-neutral-400 text-gray-600">
                  Your source code is cloned into ephemeral Docker containers with no persistent storage.
                  Containers are destroyed within 60 seconds of analysis completion. We never log or cache file contents—only the generated graph metadata.
                </p>
              </div>
              <div>
                <h3 className="font-bold dark:text-white text-gray-900 mb-2">Infrastructure Security</h3>
                <p className="dark:text-neutral-400 text-gray-600">
                  Hosted on AWS with isolated VPCs, WAF protection, and DDoS mitigation via Cloudflare.
                  Database backups are encrypted and replicated across 3 regions. We maintain automated vulnerability scanning via Snyk and GitHub Dependabot.
                </p>
              </div>
              <div>
                <h3 className="font-bold dark:text-white text-gray-900 mb-2">Responsible Disclosure</h3>
                <p className="dark:text-neutral-400 text-gray-600">
                  Found a security issue? Email security@velocit.ai. We have a public bug bounty program on HackerOne with rewards up to $5,000 for critical vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        );
      case "cookies":
        return (
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-8">
              Cookie Policy
            </h1>
            <p className="dark:text-neutral-400 text-gray-600 text-lg">
              We use minimal cookies strictly necessary for authentication and
              session management. We do not use third-party tracking cookies for
              advertising purposes.
            </p>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#030303] transition-colors duration-300">
      <Navbar
        onHome={() => onNavigate("home")}
        onNavigate={onNavigate}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto pt-24 pb-20 px-6 flex flex-col md:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            {SIDEBAR_LINKS.map((section) => (
              <div key={section.category}>
                <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-neutral-600 tracking-wider mb-4 px-3">
                  {section.category}
                </h4>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => onNavigate(link.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === link.id
                            ? "bg-[#00d907]/10 text-[#00d907]"
                            : "text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
