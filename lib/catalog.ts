import { componentRegistry, type ComponentConfig } from "@/lib/docs/component-registry";
import { blockItems, getInstallCommand } from "@/lib/docs/docs-content";

/**
 * The catalog is derived from the real registry, so every item listed on
 * /templates, /components, /widgets and /blocks has an implementation and a
 * documentation page behind it. Nothing here is hand-written filler.
 */

export type CatalogKind = "component" | "widget" | "block" | "layout";

export interface CatalogItem {
  id: string;
  kind: CatalogKind;
  title: string;
  description: string;
  /** Documentation page, which contains the live preview and the code. */
  href: string;
  /** Group used for filtering inside a list. */
  category: string;
  installCommand: string;
}

const CATEGORY_LABELS: Record<ComponentConfig["category"], string> = {
  components: "Core",
  forms: "Forms",
  "data-display": "Data display",
  overlays: "Overlays",
  innovative: "Interactive",
  time: "Widgets",
  widgets: "Widgets",
  data: "Widgets",
};

function fromConfig(config: ComponentConfig): CatalogItem {
  const isWidget = config.category === "widgets";
  return {
    id: config.slug,
    kind: isWidget ? "widget" : "component",
    title: config.title,
    description: config.description,
    href: `/docs/components/${config.slug}`,
    category: CATEGORY_LABELS[config.category],
    installCommand: getInstallCommand(config.registryName),
  };
}

const allFromRegistry = Object.values(componentRegistry).map(fromConfig);

export const components: CatalogItem[] = allFromRegistry.filter((item) => item.kind === "component");
export const widgets: CatalogItem[] = allFromRegistry.filter((item) => item.kind === "widget");

/** Full-page flows. The admin panel is a layout with its own navigation, so it is listed separately. */
export const blocks: CatalogItem[] = blockItems
  .filter((block) => block.name !== "admin-panel")
  .map((block) => ({
    id: block.name,
    kind: "block" as const,
    title: block.title,
    description: block.description,
    href: block.route,
    category: "Page flows",
    installCommand: getInstallCommand(block.name),
  }));

export const layouts: CatalogItem[] = blockItems
  .filter((block) => block.name === "admin-panel")
  .map((block) => ({
    id: block.name,
    kind: "layout" as const,
    title: block.title,
    description: block.description,
    href: block.route,
    category: "Dashboards",
    installCommand: getInstallCommand(block.name),
  }));

export const catalog = {
  components,
  widgets,
  blocks,
  layouts,
};

export const catalogCounts = {
  components: components.length,
  widgets: widgets.length,
  blocks: blocks.length,
  layouts: layouts.length,
  total: components.length + widgets.length + blocks.length + layouts.length,
};

export function getComponentsByCategory(items: CatalogItem[]) {
  const map = new Map<string, CatalogItem[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return map;
}
