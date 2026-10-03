"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateNavigation } from "@/contants/nav-items";

/**
 * In-page section navigation for small screens. The global Navbar (with the
 * "Docs" link and the mobile menu) already lives in the root layout, so this
 * component only handles jumping between documentation pages — it renders no
 * header, logo or GitHub link of its own.
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const navigation = generateNavigation();
  const current = navigation.flatMap((section) => section.items).find((item) => item.href === pathname);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="border-b border-deep-border bg-deep lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-controls="docs-section-nav"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-deep-foreground"
      >
        <span className="truncate">{current ? current.title : "Browse documentation"}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-deep-muted transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
      </button>

      {isOpen ? (
        <nav id="docs-section-nav" aria-label="Documentation sections" className="max-h-[70vh] overflow-y-auto border-t border-deep-border px-2 py-3">
          {navigation.map((section) => (
            <div key={section.title} className="mb-3">
              <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-deep-muted">{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm",
                        pathname === item.href ? "bg-white/10 text-deep-foreground" : "text-deep-muted hover:bg-white/5 hover:text-deep-foreground",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
