import axios from "axios";

export interface TreeFile {
  path: string;
  type: "blob" | "tree";
}

export async function fetchGitHubTree(
  owner: string,
  repo: string,
  branch: string,
  token?: string
) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  const res = await axios.get(url, { headers });
  return res.data.tree as TreeFile[];
}
