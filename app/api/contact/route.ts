import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json(
      { error: "Contact channel isn't configured yet." },
      { status: 500 }
    );
  }

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

  const text = [
    "New message from befrzi.vercel.app",
    `Name: ${name.trim()}`,
    email?.trim() ? `Email: ${email.trim()}` : null,
    `Message: ${message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
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
