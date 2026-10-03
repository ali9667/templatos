import type { Metadata } from "next";
import { CatalogPage } from "@/components/templates/catalog-page";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Complete page flows with validation and states handled: sign in, sign up, password recovery and pricing.",
  alternates: { canonical: "/blocks" },
};

export default function BlocksPage() {
  return (
    <CatalogPage
      title="Blocks"
      description="Whole sections of an application, from sign-in to pricing. Validation, loading and confirmation states are already wired up."
      items={catalog.blocks}
      emptyMessage="No blocks found."
      searchLabel="Search blocks"
    />
  );
}
