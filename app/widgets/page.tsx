import type { Metadata } from "next";
import { CatalogPage, withPreviews } from "@/components/templates/catalog-page";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Widgets",
  description: "Self-contained dashboard widgets for weather, time, calendar, stocks and stats.",
  alternates: { canonical: "/widgets" },
};

export default function WidgetsPage() {
  return (
    <CatalogPage
      title="Widgets"
      description="Self-contained pieces for dashboards and home screens. Each widget takes plain props, so you can feed it your own data."
      items={withPreviews(catalog.widgets)}
      emptyMessage="No widgets found."
      searchLabel="Search widgets"
    />
  );
}
