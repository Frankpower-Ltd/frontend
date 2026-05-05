import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
interface AvatarV2Props {
  displayName: string;
  profileImage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AvatarV2: React.FC<AvatarV2Props> = ({
  displayName,
  profileImage,
  size = "md",
  className,
}) => {
  const avatarSizeClass =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Limit to 2 characters

  return (
    <Avatar
      className={cn(avatarSizeClass, "border border-neutral-100", className)}
    >
      {profileImage ? (
        <AvatarImage src={profileImage} alt={displayName} />
      ) : null}
      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarV2;
