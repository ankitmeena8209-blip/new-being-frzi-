import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || "8594550551:AAFyfk9eyV893McJkXjweyY5Z2k541HjNLg";
  const chatId = process.env.TELEGRAM_CHAT_ID || "879322433";

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name and message are required." },
      { status: 400 }
    );
  }

  // 1. Extract IP address & User Agent
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");
  const userAgent = request.headers.get("user-agent") || "Unknown Device";

  const rawIp = (forwardedFor ? forwardedFor.split(",")[0] : realIp || cfIp || "127.0.0.1")?.trim();
  const displayIp = rawIp === "::1" || rawIp === "127.0.0.1" ? "Localhost (127.0.0.1)" : rawIp;

  // 2. Fetch IP Geolocation
  let locationStr = "Unknown Location";
  let ispStr = "Unknown ISP";

  if (rawIp && rawIp !== "127.0.0.1" && rawIp !== "::1" && !rawIp.startsWith("192.168.")) {
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,country,countryCode,regionName,city,isp,org`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.status === "success") {
          locationStr = `${geoData.city}, ${geoData.regionName}, ${geoData.country} (${geoData.countryCode})`;
          ispStr = geoData.isp || geoData.org || "Unknown ISP";
        }
      }
    } catch (e) {
      console.warn("Geo IP lookup failed:", e);
    }
  }

  // 3. Format Telegram Message
  const text = [
    "📬 *NEW DIRECT MESSAGE FROM BEING FRZI WEBSITE*",
    "━━━━━━━━━━━━━━━━━━━━━━",
    `👤 *Name:* ${name.trim()}`,
    `✉️ *Email:* ${email?.trim() || "Not provided"}`,
    `💬 *Message:*`,
    `${message.trim()}`,
    "━━━━━━━━━━━━━━━━━━━━━━",
    "🌐 *VISITOR TECHNICAL SPECS:*",
    `• *IP Address:* \`${displayIp}\``,
    `• *Location:* ${locationStr}`,
    `• *Network / ISP:* ${ispStr}`,
    `• *User Agent:* \`${userAgent}\``,
  ].join("\n");

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramRes.ok) {
      const errData = await telegramRes.text();
      console.error("Telegram API error:", errData);
      return NextResponse.json(
        { error: "Message couldn't be delivered right now." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Unexpected error sending message." },
      { status: 500 }
    );
  }
}
