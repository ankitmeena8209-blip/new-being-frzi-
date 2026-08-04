export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: "telegram" | "mail" | "instagram" | "snapchat" | "github" | "linkedin";
};

/**
 * Returns authenticated API redirect routes (/api/connect/[id])
 * so direct social media and git URLs are never exposed in the client HTML/DOM.
 */
export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    {
      id: "telegram",
      label: "Telegram",
      href: "/api/connect/telegram",
      icon: "telegram",
    },
    {
      id: "email",
      label: "Email",
      href: "/api/connect/email",
      icon: "mail",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "/api/connect/instagram",
      icon: "instagram",
    },
    {
      id: "snapchat",
      label: "Snapchat",
      href: "/api/connect/snapchat",
      icon: "snapchat",
    },
    {
      id: "github",
      label: "GitHub",
      href: "/api/connect/github",
      icon: "github",
    },
  ];

  if (process.env.NEXT_PUBLIC_LINKEDIN_URL) {
    links.push({
      id: "linkedin",
      label: "LinkedIn",
      href: "/api/connect/linkedin",
      icon: "linkedin",
    });
  }

  return links;
}
