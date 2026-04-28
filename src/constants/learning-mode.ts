import { Monitor, Users } from "lucide-react";

export enum LearningMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export const LEARNING_MODE_LABELS: Record<LearningMode, string> = {
  [LearningMode.ONLINE]: "Online Classes",
  [LearningMode.OFFLINE]: "Offline / In-Person",
};

export const LEARNING_MODE_OPTIONS: Array<{
  value: LearningMode;
  title: string;
  icon: typeof Monitor;
  features: string[];
}> = [
  {
    value: LearningMode.ONLINE,
    title: LEARNING_MODE_LABELS[LearningMode.ONLINE],
    icon: Monitor,
    features: ["Live sessions", "Recorded replays", "24/7 materials"],
  },
  {
    value: LearningMode.OFFLINE,
    title: LEARNING_MODE_LABELS[LearningMode.OFFLINE],
    icon: Users,
    features: ["In-person mentoring", "Lab access", "Peer networking"],
  },
];

export const getLearningModeLabel = (mode?: LearningMode | "") =>
  mode ? LEARNING_MODE_LABELS[mode as LearningMode] || "—" : "—";
