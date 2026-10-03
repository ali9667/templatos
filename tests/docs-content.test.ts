import {
  blockItems,
  getInstallCommand,
  getRegistryUrl,
  installableComponents,
  registryNamespace,
} from "@/lib/docs/docs-content";

describe("documentation content", () => {
  it("uses the canonical registry namespace and URL", () => {
    expect(registryNamespace).toBe("@templatos");
    // The registry is served by this app itself (/public/r), so the URL tracks
    // NEXT_PUBLIC_SITE_URL rather than pointing at raw GitHub content.
    expect(getRegistryUrl()).toBe("http://localhost:3000/r/{name}.json");
    expect(getInstallCommand("glass-card")).toBe(
      "npx shadcn@latest add @templatos/glass-card",
    );
  });

  it("only exposes registry-backed installable items", () => {
    expect(installableComponents.length).toBeGreaterThan(0);
    expect(installableComponents.every((item) => item.command.includes("@templatos/"))).toBe(true);
    expect(installableComponents.some((item) => item.name === "glass-card")).toBe(true);
  });

  it("keeps every published block route backed by registry metadata", () => {
    expect(blockItems).toHaveLength(5);
    expect(blockItems.map((item) => item.name)).toEqual([
      "login-page",
      "signup-page",
      "forgot-password-page",
      "pricing-page",
      "admin-panel",
    ]);
    expect(blockItems.every((item) => item.route.startsWith("/docs/blocks/"))).toBe(true);
  });
});
