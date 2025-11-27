import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchRepoTree, fetchRepoFileContent } from "./github";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { analyzeRepoWithAI } from "./ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Allow frontend dev servers
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Validation Schemas
const AnalyzeSchema = z.object({
  repoUrl: z.string().url().refine((url) => url.includes("github.com"), {
    message: "Must be a valid GitHub URL"
  })
});

const ContentSchema = z.object({
  repoUrl: z.string().url(),
  path: z.string().min(1)
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { repoUrl } = AnalyzeSchema.parse(req.body);

    console.log("Analyzing repo:", repoUrl);
    
    // Step 1-3: Fetch tree, parse deps, parse imports
    const analysis = await fetchRepoTree(repoUrl);
    
    // Step 4: AI Interpretation
    const finalAnalysis = await analyzeRepoWithAI(analysis, repoUrl);

    res.json(finalAnalysis);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    console.error("Analyze failed", err);
    res.status(500).json({ error: err.message || "Failed to analyze repository" });
  }
});

app.post("/api/content", async (req, res) => {
  try {
    const { repoUrl, path } = ContentSchema.parse(req.body);

    const content = await fetchRepoFileContent(repoUrl, path);
    if (content === null) {
      return res.status(404).json({ error: "File not found or could not be fetched" });
    }
    res.json({ content });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    console.error("Content fetch failed", err);
    res.status(500).json({ error: err.message || "Failed to fetch content" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
