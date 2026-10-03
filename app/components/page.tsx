import type { Metadata } from "next";
import { CatalogPage, withPreviews } from "@/components/templates/catalog-page";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Components",
  description: "Accessible interface components: buttons, inputs, dialogs, tabs, tables and more. Preview each one and copy the install command.",
  alternates: { canonical: "/components" },
};

export default function ComponentsPage() {
  return (
    <CatalogPage
      title="Components"
      description="Small, reusable controls built on Radix primitives and styled with Tailwind CSS. Filter by category, open one to see every variant, and copy the command to add it to your project."
      items={withPreviews(catalog.components)}
      emptyMessage="No components found."
      searchLabel="Search components"
    />
  );
}
