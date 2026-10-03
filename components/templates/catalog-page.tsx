import type { ReactNode } from "react";
import { componentRegistry } from "@/lib/docs/component-registry";
import type { CatalogItem } from "@/lib/catalog";
import { CatalogBrowser, type BrowserItem } from "./catalog-browser";

/** Attach the first real example from the registry to each item that has one. */
export function withPreviews(items: CatalogItem[]): BrowserItem[] {
  return items.map((item) => {
    const config = componentRegistry[item.id];
    const preview = config?.examples[0]?.preview;
    return preview ? { ...item, preview } : item;
  });
}

interface CatalogPageProps {
  title: string;
  description: ReactNode;
  items: BrowserItem[];
  emptyMessage: string;
  searchLabel: string;
  showKindFilter?: boolean;
  initialKind?: "all" | CatalogItem["kind"];
  initialQuery?: string;
}

export function CatalogPage({ title, description, items, emptyMessage, searchLabel, showKindFilter, initialKind, initialQuery }: CatalogPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
      </header>
      <CatalogBrowser
        items={items}
        emptyMessage={emptyMessage}
        searchLabel={searchLabel}
        showKindFilter={showKindFilter}
        initialKind={initialKind}
        initialQuery={initialQuery}
      />
    </div>
  );
}
