import { RepoAnalysis, GraphNode, GraphLink, GraphGroup } from "../types";

// Mock generation functions removed as we are now using the backend API.

/**
 * Main entry used by your UI.
 * Connects to the local backend to analyze the repository.
 */
export const analyzeRepository = async (
  repoUrl: string
): Promise<RepoAnalysis> => {
  try {
    console.log("Requesting analysis for:", repoUrl);
    const response = await fetch("http://localhost:4000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to analyze repository");
    }

    const result = await response.json();
    
    // Inject Mock Data for Developer Centric Features
    const enhancedResult: RepoAnalysis = {
      ...result,
      stats: {
        fileCount: 1476,
        loc: 340223,
        languages: [
          { name: "TypeScript", percentage: 72 },
          { name: "JSX", percentage: 10 },
          { name: "Go", percentage: 8 },
          { name: "Other", percentage: 10 }
        ],
        dependencyCount: 142,
        folderStructure: {
          moduleCount: 12,
          logicalGroups: 3
        }
      },
      hotspots: [
        { id: "src/utils/helpers.ts", name: "helpers.ts", importCount: 58, isBottleneck: true },
        { id: "src/core/engine.ts", name: "engine.ts", importCount: 42, isBottleneck: false, cycle: "src/core <-> src/engine" },
        { id: "src/components/Button.tsx", name: "Button.tsx", importCount: 35, isBottleneck: false }
      ],
      activity: {
        activeFolders: ["packages/ui", "api/auth"],
        mostModifiedFiles: ["auth-controller.ts", "schema.ts"],
        bugProneModules: [
          { name: "checkout-service.ts", issueCount: 11 },
          { name: "payment-gateway.ts", issueCount: 8 }
        ]
      },
      prImpact: {
        added: 12,
        removed: 5,
        modified: 8,
        riskLevel: "medium"
      },
      aiSummary: {
        strengths: [
          "Modular architecture with clear separation of concerns",
          "High test coverage in core modules",
          "Consistent code style and formatting"
        ],
        risks: [
          "Cyclic dependency detected in core engine",
          "High complexity in payment processing module",
          "Outdated dependencies in legacy package"
        ],
        improvements: [
          "Refactor core engine to break dependency cycle",
          "Update legacy dependencies to latest versions",
          "Add more integration tests for payment flow"
        ]
      }
    };

    console.log("Analysis result:", enhancedResult);
    return enhancedResult;
  } catch (err) {
    console.error("Error in analyzeRepository:", err);
    throw err;
  }
};

export const getFileContent = async (repoUrl: string, path: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:4000/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, path }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content;
  } catch (err) {
    console.error("Error in getFileContent:", err);
    throw err;
  }
};
