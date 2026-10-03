import type { Metadata } from "next"
import { GITHUB_URL, SITE_URL } from "@/lib/site"

// Re-exported so existing imports of SITE_URL from this module keep working;
// lib/site.ts is the single source of truth (it resolves NEXT_PUBLIC_SITE_URL,
// never GitHub, as the canonical production URL).
export { SITE_URL }

const MAX_META_DESCRIPTION = 155

function truncateMeta(text: string, max = MAX_META_DESCRIPTION) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3).trimEnd()}...`
}

// Software library JSON-LD for the open-source component library. No ratings,
// review counts or usage numbers: Templatos doesn't invent traction it doesn't have.
export function generateSoftwareLibraryJsonLd() {
  return {
    "@type": "SoftwareLibrary",
    name: "Templatos",
    url: SITE_URL,
    description: "Open-source liquid glass UI component library for React and Next.js.",
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    codeRepository: `${GITHUB_URL}/templatos`,
    programmingLanguage: ["TypeScript", "JavaScript"],
    runtimePlatform: "React",
    keywords: ["liquid glass", "react components", "next.js", "shadcn"],
  }
}






export function getComponentHeading(title: string) {
  return `Liquid Glass ${title} - React`
}

export function getComponentIntro(title: string, description: string) {
  return `Liquid glass ${title.toLowerCase()} component for React & Next.js. ${description}`
}

export function buildComponentMetadata({
  title,
  description,
  slug,
}: {
  title: string
  description: string
  slug: string
}): Metadata {
  const name = `Liquid Glass ${title}`
  const metaTitle = `${name} - React`
  const metaDescription = truncateMeta(`${name} component for React & Next.js. ${description}`)
  const canonical = `/docs/components/${slug}`

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical,
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  }
}
