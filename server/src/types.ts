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
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  issues?: Issue[];
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface RepoAnalysis {
  nodes: GraphNode[];
  links: GraphLink[];
  summary: string;
  riskScore: number; // 0–100
  techStack: string[]; // inferred tech keywords
}
