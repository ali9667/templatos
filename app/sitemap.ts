import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"
import { getAllComponentSlugs } from "@/lib/docs/component-registry"

const docsRoutes = [
  "",
  "/installation",
  "/theming",
  "/dark-mode",
  "/cli",
  "/registry",
]

const topLevelRoutes = [
  { path: "/templates", priority: 0.9 },
  { path: "/ai", priority: 0.9 },
  { path: "/components", priority: 0.8 },
  { path: "/widgets", priority: 0.8 },
  { path: "/blocks", priority: 0.8 },
]

const blockRoutes = ["/docs/blocks/admin", "/docs/blocks/login", "/docs/blocks/signup", "/docs/blocks/forgot-password", "/docs/blocks/pricing"]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Homepage
  const homeRoute = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1,
  }

  // Templates, AI Studio and the catalog pages
  const productPages = topLevelRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }))

  // Documentation pages
  const docPages = docsRoutes.map((route) => ({
    url: `${SITE_URL}/docs${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 0.9 : 0.8,
  }))

  // Component pages
  const componentPages = getAllComponentSlugs().map((component) => ({
    url: `${SITE_URL}/docs/components/${component}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Block and layout doc pages
  const blockPages = blockRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Registry page
  const registryPage = {
    url: `${SITE_URL}/docs/registry`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }

  return [homeRoute, ...productPages, ...docPages, ...componentPages, ...blockPages, registryPage]
}
