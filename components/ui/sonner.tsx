"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "!border-border !bg-card !text-card-foreground !shadow-[var(--shadow-raised)]",
          description: "!text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
