import type { Metadata } from "next";
import { CatalogPage, withPreviews } from "@/components/templates/catalog-page";
import { catalog, catalogCounts, type CatalogKind } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse every Templatos component, widget, block and layout. Preview it, read the docs, and copy the install command.",
  alternates: { canonical: "/templates" },
};

const KINDS = ["component", "widget", "block", "layout"] as const;

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ kind?: string; q?: string }> }) {
  const { kind, q } = await searchParams;
  const initialKind = KINDS.includes(kind as CatalogKind) ? (kind as CatalogKind) : "all";
  const items = [...catalog.components, ...catalog.widgets, ...catalog.blocks, ...catalog.layouts];

  return (
    <CatalogPage
      title="Templates"
      description={`${catalogCounts.total} building blocks: components, widgets, blocks and layouts. Each one has a live preview and documentation, and installs into your project with one command.`}
      items={withPreviews(items)}
      emptyMessage="No templates match your search."
      searchLabel="Search templates"
      showKindFilter
      initialKind={initialKind}
      initialQuery={q?.slice(0, 80) ?? ""}
    />
  );
}
