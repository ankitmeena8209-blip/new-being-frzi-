export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "telegram" | "mail" | "instagram" | "snapchat" | "github" | "linkedin";
};

/**
 * Pulls straight from NEXT_PUBLIC_* env vars (see .env.example).
 * Falls back to "#" so the UI never breaks in local/dev before envs are set.
 */
export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    {
      id: "telegram",
      label: "Telegram",
      href: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/im_ankiit",
      icon: "telegram",
    },
    {
      id: "email",
      label: "Email",
      href: process.env.NEXT_PUBLIC_EMAIL || "mailto:ankitgemini4@gmail.com",
      icon: "mail",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/being_frzi",
      icon: "instagram",
    },
    {
      id: "snapchat",
      label: "Snapchat",
      href: process.env.NEXT_PUBLIC_SNAPCHAT_URL || "https://www.snapchat.com/add/being_frzi",
      icon: "snapchat",
    },
    {
      id: "github",
      label: "GitHub",
      href: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/ankitmeena8209-blip",
      icon: "github",
    },
  ];

  // LinkedIn is optional — only include it if the env var is actually set.
  if (process.env.NEXT_PUBLIC_LINKEDIN_URL) {
    links.push({
      id: "linkedin",
      label: "LinkedIn",
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
      icon: "linkedin",
    });
  }

  return links;
}
