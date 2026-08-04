import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Git repository URL is required" }, { status: 400 });
    }

    // Extract owner and repo from URL formats like:
    // https://github.com/owner/repo or https://github.com/owner/repo.git or owner/repo
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/) || url.match(/^([^\/]+)\/([^\/\.]+)$/);

    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL format. Example: https://github.com/owner/repo" }, { status: 400 });
    }

    const owner = match[1];
    const repo = match[2];

    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        "User-Agent": "BeingFRZI-Portfolio-Agent",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!ghRes.ok) {
      return NextResponse.json({ error: `GitHub API returned ${ghRes.status}. Repository might be private or invalid.` }, { status: 404 });
    }

    const data = await ghRes.json();

    // Auto-detect category based on repo language and topics
    let category = "Fullstack";
    const topics: string[] = data.topics || [];
    const lang: string = data.language || "";

    if (topics.includes("mobile") || topics.includes("react-native") || topics.includes("flutter") || topics.includes("ios") || topics.includes("android") || lang === "Swift" || lang === "Kotlin") {
      category = "Mobile";
    } else if (topics.includes("ai") || topics.includes("machine-learning") || topics.includes("openai") || topics.includes("python") || lang === "Python") {
      category = "AI/ML";
    }

    // Build tech stack tags
    const tags = Array.from(new Set([lang, ...topics, "Next.js", "React"])).filter(Boolean).slice(0, 5);

    return NextResponse.json({
      success: true,
      repoInfo: {
        name: data.name || repo,
        title: data.name ? data.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : repo,
        description: data.description || `High-performance project repository ${owner}/${repo}.`,
        category,
        tags,
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
