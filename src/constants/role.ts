export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const isAdminRole = (role?: string | null) =>
  role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN;
