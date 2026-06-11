import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isAdminRole } from "@/constants/role";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { userService } from "@/services/api/user.service";
import { useAuthStore } from "@/store/auth.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Bell, Camera, CreditCard, Lock, Save, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const navItems = [
  { id: "profile", label: "Profile", icon: User, enabled: true },
  { id: "notifications", label: "Notifications", icon: Bell, enabled: false },
  { id: "security", label: "Security", icon: Lock, enabled: false },
  { id: "billing", label: "Billing", icon: CreditCard, enabled: false },
] as const;

type SettingsForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  level: string;
  program: string;
};

const schema: yup.ObjectSchema<SettingsForm> = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, "First name is too short")
    .required("First name is required"),
  lastName: yup.string().trim().optional().default(""),
  email: yup.string().trim().email().required(),
  phone: yup
    .string()
    .trim()
    .max(20, "Phone is too long")
    .optional()
    .default(""),
  school: yup
    .string()
    .trim()
    .max(150, "Institution is too long")
    .optional()
    .default(""),
  level: yup
    .string()
    .trim()
    .max(50, "Level is too long")
    .optional()
    .default(""),
  program: yup
    .string()
    .trim()
    .max(150, "Program is too long")
    .optional()
    .default(""),
});

const INITIAL_FORM: SettingsForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  school: "",
  level: "",
  program: "",
};

const splitName = (fullName?: string) => {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
};

const StudentSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: currentUser, isLoading, refetch } = useCurrentUser();
  const { setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SettingsForm>({
    resolver: yupResolver(schema),
    defaultValues: INITIAL_FORM,
  });

  useEffect(() => {
    if (!currentUser) return;
    const { firstName, lastName } = splitName(currentUser.fullName);
    reset({
      firstName,
      lastName,
      email: currentUser.email || "",
      phone: currentUser.phoneNumber || "",
      school: currentUser.academicInfo?.institution || "",
      level: currentUser.academicInfo?.level || "",
      program: currentUser.academicInfo?.courseOfStudy || "",
    });
  }, [currentUser, reset]);

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const initials = useMemo(
    () => `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U",
    [firstName, lastName],
  );

  const displayAvatar =
    avatarPreviewUrl || currentUser?.profileImage || undefined;

  const onSubmit = async (form: SettingsForm) => {
    try {
      const fullName = [form.firstName.trim(), form.lastName.trim()]
        .filter(Boolean)
        .join(" ");

      await userService.updateCurrentUser({
        fullName,
        phoneNumber: form.phone.trim() || undefined,
        academicInfo: {
          institution: form.school.trim() || undefined,
          courseOfStudy: form.program.trim() || undefined,
          level: form.level.trim() || undefined,
        },
      });

      const refreshed = await refetch();
      if (refreshed.data) setUser(refreshed.data);

      toast.success("Profile updated", {
        description: "Your settings have been saved.",
      });
    } catch (error) {
      toast.error("Update failed", {
        description:
          error instanceof Error ? error.message : "Unable to update profile",
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please upload an image up to 2MB.",
      });
      e.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      await userService.uploadProfileImage(file);
      const refreshed = await refetch();
      if (refreshed.data) setUser(refreshed.data);
      toast.success("Photo updated");
    } catch (error) {
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Unable to upload image",
      });
      setAvatarPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    if (!currentUser) return;
    const { firstName, lastName } = splitName(currentUser.fullName);
    reset({
      firstName,
      lastName,
      email: currentUser.email || "",
      phone: currentUser.phoneNumber || "",
      school: currentUser.academicInfo?.institution || "",
      level: currentUser.academicInfo?.level || "",
      program: currentUser.academicInfo?.courseOfStudy || "",
    });
    setAvatarPreviewUrl(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6 lg:p-8">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <main className="w-full max-w-6xl p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences and profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <nav className="bg-card border border-border rounded-2xl p-2 h-fit">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === "profile";
            return item.enabled ? (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            ) : (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground/60 cursor-not-allowed"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">
                  Soon
                </span>
              </div>
            );
          })}
        </nav>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent" />
            <div className="px-5 md:px-6 pb-5 md:pb-6 -mt-10">
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20 ring-4 ring-card shadow-md">
                    {displayAvatar ? (
                      <AvatarImage src={displayAvatar} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Upload new photo"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center shadow-md hover:scale-105 transition-transform ring-2 ring-card disabled:opacity-60"
                      >
                        {isUploading ? (
                          <span className="h-3.5 w-3.5 rounded-full border-2 border-background/60 border-t-background animate-spin" />
                        ) : (
                          <Camera className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Upload new photo
                    </TooltipContent>
                  </Tooltip>
                  {avatarPreviewUrl && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={handleAvatarRemove}
                          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md ring-2 ring-card opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Remove local preview
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="pb-1">
                  <p className="text-base font-semibold text-foreground leading-tight">
                    {firstName} {lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isUploading
                      ? "Uploading image..."
                      : "PNG or JPG, up to 2MB."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground">
              Personal information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your basic contact details.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" error={errors.firstName?.message}>
                <Input {...register("firstName")} />
              </Field>
              <Field label="Last name" error={errors.lastName?.message}>
                <Input {...register("lastName")} />
              </Field>
              <Field label="Email">
                <div className="flex h-10 w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground items-center">
                  {watch("email") || "—"}
                </div>
              </Field>
              <Field label="Phone number" error={errors.phone?.message}>
                <Input {...register("phone")} />
              </Field>
            </div>
          </section>

          {!isAdminRole(currentUser?.role || "") && (
            <section className="bg-card border border-border rounded-2xl p-5 md:p-6">
              <h2 className="text-sm font-semibold text-foreground">
                Academic information
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Helps us tailor your learning experience.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="School / Institution"
                  error={errors.school?.message}
                >
                  <Input
                    {...register("school")}
                    placeholder="e.g University of Ibadan"
                  />
                </Field>
                <Field label="Current level" error={errors.level?.message}>
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <Select
                        value={field.value || "none"}
                        onValueChange={(v) =>
                          field.onChange(v === "none" ? "" : v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Not set</SelectItem>
                          <SelectItem value="100">100 Level</SelectItem>
                          <SelectItem value="200">200 Level</SelectItem>
                          <SelectItem value="300">300 Level</SelectItem>
                          <SelectItem value="400">400 Level</SelectItem>
                          <SelectItem value="500">500 Level</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Program of study"
                    error={errors.program?.message}
                  >
                    <Input
                      {...register("program")}
                      placeholder="e.g Computer science"
                    />
                  </Field>
                </div>
              </div>
            </section>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

const Field = ({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      {error ? (
        <span className="text-[10px] text-destructive">{error}</span>
      ) : null}
    </div>
    {children}
  </div>
);

export default StudentSettings;
