import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-7", className)}>
      <rect width="32" height="32" rx="7" fill="var(--deep)" />
      <rect x="7" y="8" width="18" height="4.5" rx="1.5" fill="#bdbbff" />
      <rect x="13.75" y="12.5" width="4.5" height="12" rx="1.5" fill="#ffffff" />
    </svg>
  );
}
