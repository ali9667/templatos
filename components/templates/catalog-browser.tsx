"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Search } from "lucide-react";
import { toast } from "sonner";
import type { CatalogItem, CatalogKind } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface BrowserItem extends CatalogItem {
  /** A real, server-rendered example of the item. Optional: blocks and layouts are whole pages. */
  preview?: ReactNode;
}

interface CatalogBrowserProps {
  items: BrowserItem[];
  /** Shown when nothing matches, e.g. "No components found." */
  emptyMessage: string;
  /** Show a filter across kinds (used on /templates). */
  showKindFilter?: boolean;
  initialKind?: CatalogKind | "all";
  initialQuery?: string;
  searchLabel: string;
}

const KIND_LABELS: Record<CatalogKind, string> = {
  component: "Components",
  widget: "Widgets",
  block: "Blocks",
  layout: "Layouts",
};

const KIND_SINGULAR: Record<CatalogKind, string> = {
  component: "Component",
  widget: "Widget",
  block: "Block",
  layout: "Layout",
};

function CopyCommand({ command, title }: { command: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success(`Install command for ${title} copied`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Select the command and copy it manually.");
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy install command for ${title}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? "Copied" : "Copy install command"}
    </button>
  );
}

export function CatalogBrowser({
  items,
  emptyMessage,
  showKindFilter = false,
  initialKind = "all",
  initialQuery = "",
  searchLabel,
}: CatalogBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState<CatalogKind | "all">(initialKind);
  const [category, setCategory] = useState<string>("all");

  const kinds = useMemo(() => Array.from(new Set(items.map((item) => item.kind))), [items]);
  const scoped = useMemo(() => (kind === "all" ? items : items.filter((item) => item.kind === kind)), [items, kind]);
  const categories = useMemo(() => Array.from(new Set(scoped.map((item) => item.category))), [scoped]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return scoped.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!needle) return true;
      return [item.title, item.description, item.category, KIND_SINGULAR[item.kind]].some((text) => text.toLowerCase().includes(needle));
    });
  }, [scoped, category, query]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-sm transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
    );

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-5">
        <div className="relative max-w-md">
          <label htmlFor="catalog-search" className="sr-only">
            {searchLabel}
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchLabel}
            autoComplete="off"
            className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground/80 focus:border-brand focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {showKindFilter && kinds.length > 1 ? (
          <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={kind === "all"} onClick={() => { setKind("all"); setCategory("all"); }} className={chip(kind === "all")}>
              All ({items.length})
            </button>
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => { setKind(k); setCategory("all"); }}
                className={chip(kind === k)}
              >
                {KIND_LABELS[k]} ({items.filter((item) => item.kind === k).length})
              </button>
            ))}
          </div>
        ) : null}

        {categories.length > 1 ? (
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={chip(category === "all")}>
              All categories
            </button>
            {categories.map((name) => (
              <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)} className={chip(category === name)}>
                {name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "result" : "results"}
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border px-6 py-14 text-center">
          <p className="font-medium">{emptyMessage}</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different word, or clear the filters.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setCategory("all"); setKind("all"); }}
            className="mt-4 text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-raised)]">
              {item.preview ? (
                <div
                  className="relative flex h-44 items-center justify-center overflow-hidden border-b border-deep-border bg-deep px-4"
                  // The whole card is not interactive; the live example is for looking at.
                  inert
                  aria-hidden="true"
                >
                  <div className="origin-center scale-[0.72]">{item.preview}</div>
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-6">
                    <Link href={item.href} className="after:absolute after:inset-0 hover:text-brand">
                      {item.title}
                    </Link>
                  </h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{item.category}</span>
                </div>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2">
                  <CopyCommand command={item.installCommand} title={item.title} />
                  <Link href={item.href} className="inline-flex items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline">
                    Preview and docs
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
