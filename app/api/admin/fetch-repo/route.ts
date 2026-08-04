import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Git repository URL is required" }, { status: 400 });
    }

    const match = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/) || url.match(/^([^\/]+)\/([^\/\.]+)$/);

    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL format. Example: https://github.com/owner/repo" }, { status: 400 });
    }

    const owner = match[1];
    const repo = match[2];

    const headers = {
      "User-Agent": "BeingFRZI-Portfolio-Agent",
      Accept: "application/vnd.github.v3+json",
    };

    // 1. Fetch Repository Metadata
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!ghRes.ok) {
      return NextResponse.json({ error: `GitHub API returned ${ghRes.status}. Repository might be private or invalid.` }, { status: 404 });
    }
    const data = await ghRes.json();

    // 2. Fetch Languages
    let languagesList: string[] = [];
    try {
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      if (langRes.ok) {
        const langData = await langRes.json();
        languagesList = Object.keys(langData);
      }
    } catch (e) {
      console.warn("Fetch languages failed:", e);
    }

    // 3. Fetch README Summary
    let readmeSummary = "";
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.content) {
          const decoded = Buffer.from(readmeData.content, "base64").toString("utf-8");
          // Extract first non-heading paragraph as summary
          const lines = decoded.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#") && !l.startsWith("!") && !l.startsWith("["));
          if (lines.length > 0) {
            readmeSummary = lines.slice(0, 2).join(" ");
          }
        }
      }
    } catch (e) {
      console.warn("Fetch README failed:", e);
    }

    // Auto-detect category
    let category = "Fullstack";
    const topics: string[] = data.topics || [];
    const mainLang: string = data.language || "";

    if (topics.includes("mobile") || topics.includes("react-native") || topics.includes("flutter") || topics.includes("ios") || topics.includes("android") || languagesList.includes("Swift") || languagesList.includes("Kotlin")) {
      category = "Mobile";
    } else if (topics.includes("ai") || topics.includes("machine-learning") || topics.includes("openai") || topics.includes("python") || mainLang === "Python") {
      category = "AI/ML";
    }

    // Combine tech stack tags
    const tags = Array.from(new Set([mainLang, ...languagesList, ...topics, "React", "Next.js"])).filter(Boolean).slice(0, 6);

    const description = data.description || readmeSummary || `High-performance repository ${owner}/${repo}.`;

    return NextResponse.json({
      success: true,
      repoInfo: {
        name: data.name || repo,
        title: data.name ? data.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : repo,
        description,
        readmeSummary,
        category,
        tags,
        license: data.license?.name || "MIT",
        stars: data.stargazers_count || 0,
        default_branch: data.default_branch || "main",
        updated_at: data.updated_at,
        html_url: data.html_url || url,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch repository info" }, { status: 500 });
  }
}
