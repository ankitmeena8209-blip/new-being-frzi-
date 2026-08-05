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
  whatsapp: "NysrLyxlcHAoPnEyOnA9OjYxOAA5LSU2bg==", // https://wa.me/being_frzi1
  linkedin: "NysrLyxlcHAzNjE0Ojs2MXE8MDI=",
};

function decryptUrl(b64: string): string {
  try {
    const rawBuf = Buffer.from(b64, "base64");
    const decryptedBuf = Buffer.from(rawBuf.map((b) => b ^ CIPHER_KEY));
    return decryptedBuf.toString("utf8");
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
  else if (id === "whatsapp") targetUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || process.env.WHATSAPP_URL || "";
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

  // Handle mailto: URLs gracefully to guarantee opening mail client + Gmail Web + Copy Clipboard
  if (targetUrl.startsWith("mailto:")) {
    const rawEmail = targetUrl.replace("mailto:", "");
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connecting to Email...</title>
    <style>
      body {
        background-color: #0A0A0A;
        color: #F5F5F3;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
        box-sizing: border-box;
      }
      .card {
        background: #141414;
        border: 1px solid rgba(245, 245, 243, 0.15);
        border-radius: 1rem;
        padding: 2rem;
        max-width: 400px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem 0; font-weight: 600; }
      p { color: rgba(245, 245, 243, 0.6); font-size: 0.85rem; margin: 0 0 1.5rem 0; word-break: break-all; }
      .btn-group { display: flex; flex-direction: column; gap: 0.75rem; }
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        font-size: 0.85rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
        border: 1px solid transparent;
        font-family: inherit;
      }
      .btn-primary { background: #F5F5F3; color: #0A0A0A; }
      .btn-primary:hover { background: #E5E5E3; }
      .btn-secondary { background: rgba(245, 245, 243, 0.08); color: #F5F5F3; border-color: rgba(245, 245, 243, 0.15); }
      .btn-secondary:hover { background: rgba(245, 245, 243, 0.15); }
      .toast { font-size: 0.75rem; color: #10B981; margin-top: 0.75rem; display: none; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Connecting to Email</h1>
      <p>${rawEmail}</p>
      <div class="btn-group">
        <a href="${targetUrl}" class="btn btn-primary">Open Default Mail App</a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${rawEmail}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Open in Gmail Web</a>
        <button onclick="copyMail()" class="btn btn-secondary">Copy Email Address</button>
      </div>
      <div id="toast" class="toast">Email address copied!</div>
    </div>
    <script>
      try { window.location.href = "${targetUrl}"; } catch (e) {}
      function copyMail() {
        navigator.clipboard.writeText("${rawEmail}").then(function() {
          var t = document.getElementById("toast");
          t.style.display = "block";
          setTimeout(function() { t.style.display = "none"; }, 2500);
        });
      }
    </script>
  </body>
</html>`,
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  return NextResponse.redirect(targetUrl, 307);
}
