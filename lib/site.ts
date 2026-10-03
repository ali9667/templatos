/** Single source of truth for product identity and navigation. */

export const SITE_NAME = "Templatos";
export const SITE_TITLE = "Templatos — Templates, Components & AI Studio";
export const SITE_DESCRIPTION =
  "Reusable interface templates, components, widgets and blocks you copy into your own project, plus an AI Studio that writes platform-specific profile bios you can edit.";
export const MAINTAINER = "Ali";
export const GITHUB_URL = "https://github.com/ali9667";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "AI Studio", href: "/ai" },
  { label: "Components", href: "/components" },
  { label: "Widgets", href: "/widgets" },
  { label: "Blocks", href: "/blocks" },
  { label: "Docs", href: "/docs" },
] as const;
