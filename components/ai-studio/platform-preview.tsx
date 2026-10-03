import { PLATFORMS, type PlatformId } from "@/lib/ai/config";
import { cn } from "@/lib/utils";

interface PlatformPreviewProps {
  platform: PlatformId;
  text: string;
  name?: string;
  role?: string;
  website?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "You";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function handle(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 15);
  return slug || "yourname";
}

function Avatar({ label, className }: { label: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center rounded-full bg-deep font-semibold text-deep-foreground", className)}
    >
      {label}
    </div>
  );
}

function Bio({ text, className }: { text: string; className?: string }) {
  return <p className={cn("whitespace-pre-line break-words", className)}>{text || "Your generated text appears here."}</p>;
}

/**
 * A layout-accurate stand-in for how the text sits on each platform. It uses the person's own
 * name and the live, editable text. It does not show followers, posts or any other invented numbers.
 */
export function PlatformPreview({ platform, text, name = "", role = "", website = "" }: PlatformPreviewProps) {
  const displayName = name.trim() || "Your name";
  const label = initials(name);

  return (
    <figure aria-label={`${PLATFORMS[platform].label} preview`} className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      {platform === "instagram" && (
        <div className="p-5">
          <div className="flex items-center gap-4">
            <Avatar label={label} className="size-16 text-lg ring-2 ring-brand/50 ring-offset-2 ring-offset-card" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{handle(name)}</p>
              <p className="truncate text-sm text-muted-foreground">{displayName}</p>
            </div>
          </div>
          <Bio text={text} className="mt-4 text-sm leading-[1.45]" />
          {website ? <p className="mt-1 truncate text-sm font-medium text-brand">{website.replace(/^https?:\/\//, "")}</p> : null}
          <div className="mt-4 grid grid-cols-2 gap-2" aria-hidden="true">
            <span className="rounded-md bg-brand py-1.5 text-center text-sm font-semibold text-white">Follow</span>
            <span className="rounded-md bg-secondary py-1.5 text-center text-sm font-semibold">Message</span>
          </div>
        </div>
      )}

      {platform === "linkedin" && (
        <div>
          <div className="h-16 bg-gradient-to-r from-deep to-brand/70" aria-hidden="true" />
          <div className="px-5 pb-5">
            <Avatar label={label} className="-mt-9 size-[4.5rem] border-4 border-card text-xl" />
            <p className="mt-2 text-lg font-semibold leading-tight">{displayName}</p>
            {role ? <p className="text-sm text-muted-foreground">{role}</p> : null}
            {website ? <p className="mt-1 text-sm font-medium text-brand">{website.replace(/^https?:\/\//, "")}</p> : null}
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-base font-semibold">About</p>
              <Bio text={text} className="mt-2 text-sm leading-6" />
            </div>
          </div>
        </div>
      )}

      {platform === "x" && (
        <div>
          <div className="h-14 bg-secondary" aria-hidden="true" />
          <div className="px-5 pb-5">
            <Avatar label={label} className="-mt-8 size-16 border-4 border-card text-lg" />
            <p className="mt-2 text-base font-bold leading-tight">{displayName}</p>
            <p className="text-sm text-muted-foreground">@{handle(name)}</p>
            <Bio text={text} className="mt-3 text-[15px] leading-[1.4]" />
            {website ? <p className="mt-2 truncate text-sm text-brand">{website.replace(/^https?:\/\//, "")}</p> : null}
          </div>
        </div>
      )}

      {platform === "telegram" && (
        <div>
          <div className="flex flex-col items-center bg-deep px-5 pb-5 pt-6 text-deep-foreground">
            <Avatar label={label} className="size-20 bg-brand text-2xl text-white" />
            <p className="mt-3 text-lg font-semibold">{displayName}</p>
            {role ? <p className="text-sm text-deep-muted">{role}</p> : null}
          </div>
          <dl className="divide-y divide-border px-5 text-sm">
            <div className="py-3">
              <dt className="text-xs text-muted-foreground">Bio</dt>
              <dd className="mt-1"><Bio text={text} className="leading-6" /></dd>
            </div>
            <div className="py-3">
              <dt className="text-xs text-muted-foreground">Username</dt>
              <dd className="mt-1 text-brand">@{handle(name)}</dd>
            </div>
          </dl>
        </div>
      )}
    </figure>
  );
}
