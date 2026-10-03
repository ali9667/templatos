import type React from "react";
import { AppSidebar } from "@/components/docs/sidebar";
import { MobileNav } from "@/components/docs/mobile-nav";

/**
 * Docs keep a deliberately dark, technical surface (the same --deep tokens used
 * for the "device frame" previews on the homepage) as a consistent stylistic
 * choice across every documentation page — not a second theme system. The
 * global Navbar and Footer from the root layout still wrap this section.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-deep text-deep-foreground">
      <MobileNav />
      <AppSidebar />
      <a
        href="#docs-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-20 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to documentation content
      </a>
      <div id="docs-main" className="lg:pl-64">
        {children}
      </div>
    </div>
  );
}
