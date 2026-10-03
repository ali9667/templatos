import Link from "next/link";
import { MAINTAINER, SITE_NAME } from "@/lib/site";
import { LogoMark } from "./logo";

const groups = [
  {
    title: "Templates",
    links: [
      { label: "Browse templates", href: "/templates" },
      { label: "Components", href: "/components" },
      { label: "Widgets", href: "/widgets" },
      { label: "Blocks", href: "/blocks" },
    ],
  },
  {
    title: "AI Studio",
    links: [{ label: "Open AI Studio", href: "/ai" }],
  },
  {
    title: "Documentation",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Theming", href: "/docs/theming" },
      { label: "CLI", href: "/docs/cli" },
      { label: "Registry", href: "/docs/registry" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-sunken">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_2fr] lg:px-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
            <LogoMark />
            <span className="text-[15px] font-semibold tracking-tight">{SITE_NAME}</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Interface templates you copy into your own project, and an AI Studio for writing profile content.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>Built by {MAINTAINER}</p>
          <p>Released under the MIT License.</p>
        </div>
      </div>
    </footer>
  );
}
