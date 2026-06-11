const Eyebrow = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <div
    className={`font-mono-eyebrow flex items-center gap-3 ${dark ? "text-[hsl(var(--surface-dark-muted))]" : "text-muted-foreground"}`}
  >
    <span
      className={`h-px w-6 ${dark ? "bg-[hsl(var(--surface-dark-border))]" : "bg-border"}`}
    />
    {children}
  </div>
);
export default Eyebrow;
