import { Building2, Video } from "lucide-react";

type Platform = "ZOOM" | "GOOGLE_MEET" | "MICROSOFT_TEAMS" | "ONSITE" | string;

const labels: Record<string, string> = {
  ZOOM: "Zoom",
  GOOGLE_MEET: "Google Meet",
  MICROSOFT_TEAMS: "Microsoft Teams",
  ONSITE: "Onsite",
};

const ZoomMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <rect width="24" height="24" rx="5" fill="#2D8CFF" />
    <path
      d="M5 9.2c0-.66.54-1.2 1.2-1.2h6.1c1.49 0 2.7 1.21 2.7 2.7v4.1c0 .66-.54 1.2-1.2 1.2H7.7A2.7 2.7 0 0 1 5 13.3V9.2Zm12.4-.85a.6.6 0 0 1 .96-.48l1.99 1.49a.6.6 0 0 1 .25.49v4.3a.6.6 0 0 1-.25.49l-1.99 1.49a.6.6 0 0 1-.96-.48V8.35Z"
      fill="#fff"
    />
  </svg>
);

const MeetMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M3 7v10a1 1 0 0 0 1 1h9V6H4a1 1 0 0 0-1 1Z" fill="#00897B" />
    <path d="M13 6v12l4-3v-6l-4-3Z" fill="#00ACC1" />
    <path
      d="M17 9v6l3 2.2c.5.4 1.2 0 1.2-.6V7.4c0-.6-.7-1-1.2-.6L17 9Z"
      fill="#FBBC04"
    />
    <path d="M13 6v4h-4l4-4Z" fill="#EA4335" />
    <path d="M3 14h4v4H4a1 1 0 0 1-1-1v-3Z" fill="#1E88E5" />
  </svg>
);

const TeamsMark = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="2" y="6" width="13" height="12" rx="2" fill="#5059C9" />
    <text
      x="8.5"
      y="15.5"
      textAnchor="middle"
      fontSize="9"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      fill="#fff"
    >
      T
    </text>
    <circle cx="18" cy="9" r="2.2" fill="#7B83EB" />
    <rect x="15.5" y="11" width="6" height="7" rx="2" fill="#7B83EB" />
  </svg>
);

export const PlatformIcon = ({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) => {
  switch (platform) {
    case "ZOOM":
      return <ZoomMark className={className} />;
    case "GOOGLE_MEET":
      return <MeetMark className={className} />;
    case "MICROSOFT_TEAMS":
      return <TeamsMark className={className} />;
    case "ONSITE":
      return (
        <Building2 className={className ?? "h-4 w-4 text-muted-foreground"} />
      );
    default:
      return <Video className={className ?? "h-4 w-4 text-muted-foreground"} />;
  }
};

export const PlatformBadge = ({ platform }: { platform: Platform }) => (
  <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-muted/40 text-xs font-medium">
    <PlatformIcon platform={platform} className="h-4 w-4" />
    {labels[platform] ?? platform}
  </span>
);
