"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  Github,
  LayoutGrid,
  LayoutTemplate,
  Menu,
  Sparkles,
  SquareStack,
  X,
} from "lucide-react";
import { GITHUB_URL, NAV_LINKS, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/templates": LayoutTemplate,
  "/ai": Sparkles,
  "/components": Boxes,
  "/widgets": LayoutGrid,
  "/blocks": SquareStack,
  "/docs": BookOpen,
};

function isActive(pathname: string, href: string) {
  if (href === "/templates") return pathname === "/templates";
  if (href === "/docs") return pathname.startsWith("/docs");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFor(null);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-6xl">
        {/*
          Deliberately always-dark "shell" (bg-deep / deep-foreground tokens),
          independent of the light/dark toggle — same treatment as the hero and
          docs device frames elsewhere on the site, not a second theme system.
        */}
        <div className="flex h-14 items-center gap-2 rounded-full border border-deep-border bg-deep px-3 shadow-[var(--shadow-float)] sm:px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-full pr-2"
            aria-label={`${SITE_NAME} home`}
          >
            <LogoMark />
            <span className="text-[15px] font-semibold tracking-tight text-deep-foreground">{SITE_NAME}</span>
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const Icon = NAV_ICONS[href];
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-deep-muted transition-colors hover:bg-white/5 hover:text-deep-foreground",
                    active && "bg-brand/15 text-deep-foreground shadow-[0_0_0_1px_var(--brand)_inset,0_0_16px_-4px_var(--brand)]",
                  )}
                >
                  {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
              className="hidden size-9 items-center justify-center rounded-full text-deep-muted transition-colors hover:bg-white/5 hover:text-deep-foreground sm:inline-flex"
            >
              <Github className="size-4" aria-hidden="true" />
            </a>
            <ThemeToggle />
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpenFor(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center rounded-full text-deep-foreground transition-colors hover:bg-white/5 md:hidden"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          hidden={!open}
          className="mt-2 rounded-2xl border border-deep-border bg-deep px-2 pb-2 pt-2 shadow-[var(--shadow-float)] md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map(({ label, href }) => {
              const Icon = NAV_ICONS[href];
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-3 text-base text-deep-muted hover:bg-white/5 hover:text-deep-foreground",
                      active && "bg-brand/15 font-medium text-deep-foreground",
                    )}
                  >
                    {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-deep-border pt-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-base text-deep-muted hover:bg-white/5 hover:text-deep-foreground"
              >
                <Github className="size-4" aria-hidden="true" />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}