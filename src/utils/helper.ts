export const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
