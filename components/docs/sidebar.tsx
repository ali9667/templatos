"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateNavigation } from "@/contants/nav-items";

/**
 * Desktop in-section navigation for /docs. The global Navbar (logo, primary
 * links, GitHub, theme toggle) lives once in the root layout; this sidebar
 * only lists documentation pages, so there is no duplicated chrome.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const mounted = useRef(false);
  const navigation = generateNavigation();

  useEffect(() => {
    if (mounted.current) {
      activeRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    }
    mounted.current = true;
  }, [pathname]);

  return (
    <nav
      aria-label="Documentation"
      className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-deep-border bg-deep px-3 py-6 lg:block"
    >
      {navigation.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-deep-muted">{section.title}</h2>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  ref={pathname === item.href ? activeRef : null}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    pathname === item.href ? "bg-white/10 font-medium text-deep-foreground" : "text-deep-muted hover:bg-white/5 hover:text-deep-foreground",
                  )}
                >
                  {item.icon}
                  <span className="truncate">{item.title}</span>
                  {item.isNew ? <span className="ml-auto rounded-full bg-brand/30 px-1.5 py-0.5 text-[10px] font-medium text-deep-foreground">New</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
