export enum AppState {
  Landing = "Landing",
  Analyzing = "Analyzing",
  Dashboard = "Dashboard",
  Error = "Error",
}

export type PageRoute =
  | "home"
  | "visualizer"
  | "integrations"
  | "pricing"
  | "changelog"
  | "enterprise"
  | "docs"
  | "api"
  | "community"
  | "blog"
  | "status"
  | "privacy"
  | "terms"
  | "cookies"
  | "security";

// Graph Data Types
export type GraphGroup = "file" | "component" | "api" | "database" | "config" | "dependency";

export interface Issue {
  severity: 'high' | 'medium' | 'low';
  message: string;
  line?: number;
  type: 'security' | 'performance' | 'style';
}

export interface GraphNode {
  id: string;
  group: GraphGroup;
  val: number; // size / importance
  label: string;
  // D3 simulation properties
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  issues?: Issue[];
}

export interface GraphLink {
  source: string | GraphNode; // D3 converts string IDs to Node objects
  target: string | GraphNode;
  value: number; // thickness/weight
}

export interface RepoAnalysis {
  nodes: GraphNode[];
  links: GraphLink[];
  summary: string;
  riskScore: number;
  techStack: string[];
  // New Developer-Centric Fields
  stats?: RepoStats;
  hotspots?: DependencyHotspot[];
  activity?: RecentActivity;
  prImpact?: PRImpact;
  aiSummary?: RepoSummary;
}

export interface RepoStats {
  fileCount: number;
  loc: number;
  languages: { name: string; percentage: number }[];
  dependencyCount: number;
  folderStructure: {
    moduleCount: number;
    logicalGroups: number;
  };
}

export interface DependencyHotspot {
  id: string;
  name: string;
  importCount: number;
  isBottleneck: boolean;
  cycle?: string; // e.g. "src/core <-> src/engine"
}

export interface RecentActivity {
  activeFolders: string[];
  mostModifiedFiles: string[];
  bugProneModules: { name: string; issueCount: number }[];
}

export interface PRImpact {
  added: number;
  removed: number;
  modified: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RepoSummary {
  strengths: string[];
  risks: string[];
  improvements: string[];
}

// Keeping old types to prevent compile errors in unused files until fully cleaned
export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  mistakes: number;
  characterCount: number;
  timeElapsed: number;
}

export interface HistoryPoint {
  second: number;
  wpm: number;
}

export enum ProgrammingLanguage {
  TypeScript = "TypeScript",
  Python = "Python",
  Rust = "Rust",
  Go = "Go",
  SQL = "SQL",
  HTML_CSS = "HTML & CSS",
}
