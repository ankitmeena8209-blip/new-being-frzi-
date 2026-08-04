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
      href: process.env.NEXT_PUBLIC_TELEGRAM_URL || "#",
      icon: "telegram",
    },
    {
      id: "email",
      label: "Email",
      href: process.env.NEXT_PUBLIC_EMAIL || "#",
      icon: "mail",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
      icon: "instagram",
    },
    {
      id: "snapchat",
      label: "Snapchat",
      href: process.env.NEXT_PUBLIC_SNAPCHAT_URL || "#",
      icon: "snapchat",
    },
    {
      id: "github",
      label: "GitHub",
      href: process.env.NEXT_PUBLIC_GITHUB_URL || "#",
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
