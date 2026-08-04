# being_frzi — v2

Single-scroll, mobile-first portfolio for Ankit (being_frzi). Visual language
lifted from the "GOBAL" poster: off-white paper background, embossed display
type, ghost-outline repeated wordmark, black ID-card stat/trait pills, and a
scroll-progress rail standing in for the poster's grayscale color slider.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your real values
npm run dev
```

Open http://localhost:3000.

## What's where

- `app/page.tsx` — composes the whole one-page site: Hero → Stack → About → Connect → Footer.
- `components/Hero.tsx` — the poster's main composition: `hero-ankit.png` as the
  full-bleed portrait, `face-card.png` as the small polaroid, ghost marquee,
  and the black stat pill bar.
- `components/GhostMarquee.tsx` — the repeated "BEING FRZI" outline text behind the hero.
- `components/ScrollRail.tsx` — desktop-only vertical scroll-progress indicator
  (poster's "COLOR" slider, made functional).
- `components/ConnectRail.tsx` — desktop-only fixed left icon rail for direct socials.
- `components/ConnectStrip.tsx` — the message form (posts to `/api/contact`) plus
  the direct-connect buttons; this is the primary contact surface on mobile.
- `app/api/contact/route.ts` — forwards form submissions to your Telegram bot
  using `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`.
- `lib/socials.ts` — reads all `NEXT_PUBLIC_*` social URLs from env so the UI
  never hardcodes a link.

## Images

Drop replacements into `public/images/` keeping the same filenames
(`hero-ankit.png`, `face-card.png`) and everything picks them up automatically —
no code changes needed.

## Env vars

See `.env.example`. Everything prefixed `NEXT_PUBLIC_` is safe to expose to the
browser (social links, Supabase anon key). Everything else
(`TELEGRAM_BOT_TOKEN`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `DATABASE_URL`) stays
server-only — only reference those inside `app/api/**/route.ts` files or server
components, never in a `"use client"` file.

## Notes

- Built mobile-first; `ConnectRail` and `ScrollRail` only appear from the `sm`
  breakpoint up — on phones, navigation is just scrolling, and contact happens
  through the `ConnectStrip` section and the header's "Message" pill.
- Respects `prefers-reduced-motion` globally (see `app/globals.css`).
- Database/Prisma/Supabase wiring isn't implemented yet — envs are read and
  ready, but there's no schema or client in this pass since the brief was
  the front-end. Say the word if you want the admin/session layer next.
