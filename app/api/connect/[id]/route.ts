import { NextResponse } from "next/server";

// Server-side cipher key & encrypted default tokens (no plain text URLs in code/repo)
const CIPHER_KEY = 0x5F;

const ENCRYPTED_MAP: Record<string, string> = {
  telegram: "NysrLyxlcHArcTI6cDYyAD4xNDY2Kw==", // https://t.me/im_ankiit
  email: "Mj42MyswZT4xNDYrODoyNjE2ax84Mj42M3E8MDI=", // mailto:ankitgemini4@gmail.com
  mail: "Mj42MyswZT4xNDYrODoyNjE2ax84Mj42M3E8MDI=",
  instagram: "NysrLyxlcHA6MSwrPjgtPjJxPDAycD06NjE4ADktJTY=", // https://instagram.com/being_frzi
  snapchat: "NysrLyxlcHAoKChxLDE+Lzw3PitxPDAycD47O3A9OjYxOAA5LSU2", // https://www.snapchat.com/add/being_frzi
  github: "NysrLyxlcHA8Nis3Kj1xPDAycD4xNDYrMjo6MT5nbW9mcj0zNi8=", // https://github.com/ankitmeena8209-blip
  linkedin: "NysrLyxlcHA6MSwrPjgtPjJxPDAycD4xNDYrMjo6MT5uZ21vZg==",
};

function decryptUrl(b64: string): string {
  try {
    const raw = Buffer.from(b64, "base64").toString("utf8");
    return raw.split("").map((c) => String.fromCharCode(c.charCodeAt(0) ^ CIPHER_KEY)).join("");
  } catch {
    return "/";
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id ? params.id.toLowerCase() : "";

  // 1. Check environment variables
  let targetUrl = "";
  if (id === "telegram") targetUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || process.env.TELEGRAM_URL || "";
  else if (id === "email" || id === "mail") targetUrl = process.env.NEXT_PUBLIC_EMAIL || process.env.EMAIL || "";
  else if (id === "instagram") targetUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || process.env.INSTAGRAM_URL || "";
  else if (id === "snapchat") targetUrl = process.env.NEXT_PUBLIC_SNAPCHAT_URL || process.env.SNAPCHAT_URL || "";
  else if (id === "github") targetUrl = process.env.NEXT_PUBLIC_GITHUB_URL || process.env.GITHUB_URL || "";
  else if (id === "linkedin") targetUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || process.env.LINKEDIN_URL || "";

  // 2. If env variable is missing or placeholder, use decrypted fallback token
  if (!targetUrl || targetUrl.includes("[YOUR_")) {
    const encryptedToken = ENCRYPTED_MAP[id] || ENCRYPTED_MAP[id === "mail" ? "email" : id];
    if (encryptedToken) {
      targetUrl = decryptUrl(encryptedToken);
    } else {
      targetUrl = "/";
    }
  }

  // Ensure redirect URL format
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://") && !targetUrl.startsWith("mailto:")) {
    targetUrl = `https://${targetUrl}`;
  }

  return NextResponse.redirect(targetUrl, 307);
}
