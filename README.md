# Velocit - Repository Intelligence

![Velocit Preview](assets/preview.png)

**Code. Analyze. Visualize.**

Velocit turns complex GitHub repositories into interactive architectural diagrams instantly. It helps developers onboarding to new codebases, conducting code reviews, or simply trying to understand the structure of a project.

## 🚀 Features

-   **Interactive Graph Visualization:** Explore your file system as a force-directed graph.
-   **Smart Dependency Analysis:** Automatically detect and visualize dependencies between files.
-   **AI-Powered Insights:** (Optional) Get architectural summaries, risk scores, and tech stack breakdowns using Gemini AI.
-   **File Explorer:** Navigate your repo with a familiar tree view alongside the graph.
-   **GitHub Integration:** Seamlessly fetch and analyze public repositories.

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, D3.js, Lucide React
-   **Backend:** Node.js, Express (or similar), Google Generative AI SDK
-   **Styling:** Custom CSS (Dark Mode optimized)

## 🏁 Getting Started

### Prerequisites

-   Node.js (v16+)
-   npm or yarn
-   A Google Gemini API Key (optional, for AI features)
-   A GitHub Personal Access Token (optional, for higher rate limits)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/velocit.git
    cd velocit
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    ```

4.  **Configure Environment**
    Create a `.env` file in the `server` directory:
    ```bash
    cp server/.env.example server/.env
    ```
    Edit `server/.env` and add your API keys:
    ```env
    GEMINI_API_KEY=your_gemini_key
    GITHUB_TOKEN=your_github_token
    PORT=4000
    ```

5.  **Run the Application**
    Start the backend (from `server` dir):
    ```bash
    npm run dev
    ```
    Start the frontend (from root dir):
    ```bash
    npm run dev
    ```

6.  **Open in Browser**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📖 How to Use

1.  Paste a **GitHub Repository URL** (e.g., `https://github.com/facebook/react`) into the input bar.
2.  Click **Analyze**.
3.  Explore the generated graph!
    -   **Click** nodes to view details.
    -   **Hover** to see connections.
    -   Use the **Tabs** to switch between Graph, File Tree, and AI Insights.

## 🔒 Privacy & Security

-   **Private by Design:** Your code analysis runs locally or communicates directly with the API.
-   **Sensitive Data:** We've configured the project to exclude sensitive files (like `ai.ts` and `treeToGraph.ts`) from the public repository to protect proprietary algorithms.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
