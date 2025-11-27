import axios from "axios";
import { GraphNode, GraphLink, RepoAnalysis, GraphGroup } from "./types";

const GITHUB_API = "https://api.github.com";

export function parseGitHubUrl(repoUrl: string) {
  try {
    const url = new URL(repoUrl);
    if (url.hostname !== "github.com") {
      throw new Error("Not a GitHub URL");
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error("Invalid GitHub URL format");
    }
    const owner = parts[0];
    const repo = parts[1].replace(".git", "");
    return { owner, repo };
  } catch (e) {
    // Fallback for SSH or other formats if needed, but for now strict URL parsing
    const match = repoUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (match) {
      return { owner: match[1], repo: match[2].replace(".git", "") };
    }
    throw new Error("Invalid GitHub repository URL");
  }
}

export async function fetchRepoFileContent(repoUrl: string, path: string): Promise<string | null> {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;
  
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await axios.get(url, { headers });
    if (Array.isArray(res.data)) return null; // It's a directory
    if (!res.data.content) return null;
    const content = Buffer.from(res.data.content, "base64").toString("utf-8");
    return content;
  } catch (e) {
    console.error("Failed to fetch file content", e);
    return null;
  }
}

export async function fetchRepoTree(repoUrl: string): Promise<RepoAnalysis> {
  const { owner, repo } = parseGitHubUrl(repoUrl);

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  // 1. repository metadata
  const repoRes = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers,
  });
  const { default_branch, language } = repoRes.data as {
    default_branch: string;
    language: string | null;
  };

  // 2. full tree of default branch
  const treeRes = await axios.get(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${default_branch}?recursive=1`,
    { headers }
  );
  const tree = treeRes.data.tree as Array<{
    path: string;
    type: "blob" | "tree";
    size?: number;
    url?: string; // API URL for blob content
  }>;

  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const seen = new Set<string>();

  const rootId = `${owner}/${repo}`;
  nodes.push({ id: rootId, group: "config", val: 40, label: rootId });
  seen.add(rootId);

  // Helper to fetch file content
  async function fetchFileContent(url: string) {
    try {
      const res = await axios.get(url, { headers });
      // GitHub API returns base64 encoded content
      const content = Buffer.from(res.data.content, "base64").toString("utf-8");
      return content;
    } catch (e) {
      console.error("Failed to fetch file content", e);
      return null;
    }
  }

  // Check for package.json
  const packageJsonItem = tree.find((item) => item.path === "package.json");
  const dependencies: string[] = [];

  if (packageJsonItem && packageJsonItem.url) {
    const content = await fetchFileContent(packageJsonItem.url);
    if (content) {
      try {
        const pkg = JSON.parse(content);
        if (pkg.dependencies) dependencies.push(...Object.keys(pkg.dependencies));
        if (pkg.devDependencies) dependencies.push(...Object.keys(pkg.devDependencies));
      } catch (e) {
        console.error("Failed to parse package.json", e);
      }
    }
  }

  // Add dependency nodes
  if (dependencies.length > 0) {
    const depRootId = `${rootId}/dependencies`;
    nodes.push({ id: depRootId, group: "dependency", val: 20, label: "Dependencies" });
    seen.add(depRootId);
    links.push({ source: rootId, target: depRootId, value: 2 });

    dependencies.forEach((dep) => {
      const depId = `dep:${dep}`;
      if (!seen.has(depId)) {
        nodes.push({
          id: depId,
          group: "dependency",
          val: 8,
          label: dep,
        });
        seen.add(depId);
        links.push({ source: depRootId, target: depId, value: 1 });
      }
    });
  }

  function groupForPath(path: string): GraphGroup {
    if (path.startsWith("api/") || path.includes("/api/")) return "api";
    if (
      path.includes("schema") ||
      path.includes("prisma") ||
      path.includes("db") ||
      path.includes("model")
    )
      return "database";
    if (
      path.endsWith(".config.js") ||
      path.endsWith(".config.ts") ||
      path.includes("config") ||
      path.endsWith(".json") ||
      path.endsWith(".yml") ||
      path.endsWith(".yaml")
    )
      return "config";
    if (
      path.endsWith(".tsx") ||
      path.endsWith(".jsx") ||
      path.includes("components") ||
      path.includes("views") ||
      path.includes("pages")
    )
      return "component";
    return "file";
  }

  for (const item of tree) {
    if (item.type !== "blob") continue;

    const path = item.path;
    // Skip node_modules and hidden files
    if (path.includes("node_modules") || path.startsWith(".")) continue;

    const parts = path.split("/");
    const fileName = parts[parts.length - 1];
    const id = path;

    if (!seen.has(id)) {
      nodes.push({
        id,
        label: fileName,
        group: groupForPath(path),
        val: Math.min(Math.max((item.size || 500) / 400, 4), 20),
      });
      seen.add(id);
    }

    const parent = parts.length > 1 ? `${owner}/${repo}/${parts[0]}` : rootId;

    if (!seen.has(parent)) {
      nodes.push({
        id: parent,
        label: parts[0],
        group: "file",
        val: 12,
      });
      seen.add(parent);
    }

    links.push({ source: parent, target: id, value: 1 });

    if (parent !== rootId) {
      links.push({ source: rootId, target: parent, value: 1 });
    }
  }

  // 3. Parse internal imports (Step 3)
  // Filter for source files
  const sourceFiles = tree.filter(
    (item) =>
      item.type === "blob" &&
      item.url &&
      (item.path.endsWith(".ts") ||
        item.path.endsWith(".tsx") ||
        item.path.endsWith(".js") ||
        item.path.endsWith(".jsx")) &&
      !item.path.includes("node_modules") &&
      !item.path.includes("test") &&
      !item.path.includes("spec")
  );

  // Sort by size (descending) and take top 10 to avoid rate limits
  const topFiles = sourceFiles.sort((a, b) => (b.size || 0) - (a.size || 0)).slice(0, 10);

  console.log(`Parsing imports for top ${topFiles.length} files...`);

  await Promise.all(
    topFiles.map(async (file) => {
      if (!file.url) return;
      const content = await fetchFileContent(file.url);
      if (!content) return;

      // Regex to find imports: import ... from '...'
      const importRegex = /import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];

        // Skip external libraries (non-relative imports)
        if (!importPath.startsWith(".")) continue;

        // Resolve path
        // Current file: src/components/Button.tsx
        // Import: ../utils/helper
        // Result: src/utils/helper
        try {
          const currentDir = file.path.split("/").slice(0, -1).join("/");
          const resolvedParts = [...currentDir.split("/"), ...importPath.split("/")];
          const cleanParts: string[] = [];

          for (const part of resolvedParts) {
            if (part === "" || part === ".") continue;
            if (part === "..") {
              cleanParts.pop();
            } else {
              cleanParts.push(part);
            }
          }

          const resolvedPathStart = cleanParts.join("/");
          
          // Find the actual node that matches this path (ignoring extension)
          const targetNode = nodes.find(
            (n) =>
              n.id === resolvedPathStart ||
              n.id.startsWith(resolvedPathStart + ".") ||
              n.id === resolvedPathStart + "/index.ts" || // Handle index files
              n.id === resolvedPathStart + "/index.js"
          );

          if (targetNode && targetNode.id !== file.path) {
            links.push({
              source: file.path,
              target: targetNode.id,
              value: 2, // Stronger link for direct import
            });
          }
        } catch (e) {
          // Ignore path resolution errors
        }
      }
    })
  );

  return {
    nodes,
    links,
    summary: `Analysis of ${rootId}. Found ${dependencies.length} dependencies. Parsed imports for ${topFiles.length} files. Primary language: ${
      language || "Unknown"
    }.`,
    riskScore: 10,
    techStack: language ? [language, ...dependencies.slice(0, 5)] : dependencies.slice(0, 5),
  };
}
