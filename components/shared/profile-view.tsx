"use client";

import {
   CalendarDays,
   Eye,
   EyeOff,
   KeyRound,
   Loader2,
   Mail,
   Phone,
   ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useChangePassword, useMyProfile, useUpdateMyProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import type { ProfileUser } from "@/services/profile";

const PHONE_PATTERN = /^\+?[0-9\s-]{7,20}$/;

const ROLE_LABEL: Record<ProfileUser["role"], string> = {
   CUSTOMER: "Customer",
   TECHNICIAN: "Technician",
   ADMIN: "Administrator",
};

function formatDate(value: string) {
   return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });
}

function errorMessage(error: unknown, fallback: string) {
   return error instanceof Error ? error.message : fallback;
}

/* ---------- Header card ---------- */

function ProfileHeader({ profile }: { profile: ProfileUser }) {
   const active = profile.activeStatus === "ACTIVE";

   return (
      <section className="rounded-xl border border-border bg-card p-6">
         <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <span className="grid size-20 shrink-0 place-items-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
               {profile.name.charAt(0).toUpperCase()}
            </span>

            <div className="min-w-0 flex-1 space-y-3">
               <div>
                  <h2 className="truncate text-2xl font-bold">{profile.name}</h2>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                     <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        <ShieldCheck className="size-3.5" />
                        {ROLE_LABEL[profile.role]}
                     </span>

                     <span
                        className={cn(
                           "rounded-full px-3 py-1 text-xs font-semibold",
                           active
                              ? "bg-success text-success-foreground"
                              : "bg-destructive/10 text-destructive",
                        )}
                     >
                        {active ? "Active" : "Blocked"}
                     </span>
                  </div>
               </div>

               <ul className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <li className="flex items-center justify-center gap-2 sm:justify-start">
                     <Mail className="size-4 shrink-0 text-primary" />
                     <span className="truncate">{profile.email}</span>
                  </li>

                  {profile.phone && (
                     <li className="flex items-center justify-center gap-2 sm:justify-start">
                        <Phone className="size-4 shrink-0 text-primary" />
                        {profile.phone}
                     </li>
                  )}

                  <li className="flex items-center justify-center gap-2 sm:justify-start">
                     <CalendarDays className="size-4 shrink-0 text-primary" />
                     Member since {formatDate(profile.createdAt)}
                  </li>
               </ul>
            </div>
         </div>
      </section>
   );
}

/* ---------- Personal information form ---------- */

function PersonalInfoForm({ profile }: { profile: ProfileUser }) {
   const router = useRouter();
   const updateMe = useUpdateMyProfile();

   const [name, setName] = useState(profile.name);
   const [phone, setPhone] = useState(profile.phone ?? "");
   const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
   const [saved, setSaved] = useState(false);

   const isDirty = name.trim() !== profile.name || phone.trim() !== (profile.phone ?? "");

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const next: typeof errors = {};

      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();

      if (trimmedName.length < 2) next.name = "Name must be at least 2 characters.";
      else if (trimmedName.length > 100) next.name = "Name must be 100 characters or fewer.";

      if (trimmedPhone && !PHONE_PATTERN.test(trimmedPhone)) {
         next.phone = "Enter 7-20 digits. A leading + is allowed.";
      }

      setErrors(next);
      setSaved(false);

      if (Object.keys(next).length > 0) return;

      updateMe.mutate(
         { name: trimmedName, phone: trimmedPhone === "" ? null : trimmedPhone },
         {
            onSuccess: () => {
               setSaved(true);
               toast.success("Profile updated successfully.");
               // Refreshes server components so the navbar shows the new name
               router.refresh();
            },
            onError: (error) => toast.error(errorMessage(error, "Failed to update profile.")),
         },
      );
   };

   return (
      <form
         onSubmit={handleSubmit}
         noValidate
         className="space-y-5 rounded-xl border border-border bg-card p-6"
      >
         <div>
            <h2 className="text-lg font-semibold">Personal information</h2>
            <p className="text-sm text-muted-foreground">Update your name and phone number.</p>
         </div>

         <FormField label="Full name" htmlFor="profile-name" error={errors.name}>
            <Input
               id="profile-name"
               value={name}
               autoComplete="name"
               aria-invalid={!!errors.name}
               aria-describedby={errors.name ? "profile-name-error" : undefined}
               onChange={(event) => {
                  setName(event.target.value);
                  setSaved(false);
               }}
               className="h-10"
            />
         </FormField>

         <FormField
            label="Email address"
            htmlFor="profile-email"
            hint="Your email is your login and cannot be changed here."
         >
            <Input id="profile-email" value={profile.email} disabled className="h-10" />
         </FormField>

         <FormField
            label="Phone number"
            htmlFor="profile-phone"
            error={errors.phone}
            hint="Optional. Leave it empty to remove your number."
         >
            <Input
               id="profile-phone"
               type="tel"
               value={phone}
               autoComplete="tel"
               aria-invalid={!!errors.phone}
               aria-describedby={errors.phone ? "profile-phone-error" : undefined}
               onChange={(event) => {
                  setPhone(event.target.value);
                  setSaved(false);
               }}
               className="h-10"
            />
         </FormField>

         {saved && !isDirty && (
            <p role="status" className="text-sm font-medium text-success">
               Your changes have been saved.
            </p>
         )}

         <Button
            type="submit"
            size="lg"
            className="h-10 px-5"
            disabled={updateMe.isPending || !isDirty}
         >
            {updateMe.isPending && <Loader2 className="animate-spin" />}
            {updateMe.isPending ? "Saving..." : "Save changes"}
         </Button>
      </form>
   );
}

/* ---------- Change password form ---------- */

function PasswordInput({
   id,
   value,
   onChange,
   invalid,
   describedBy,
   autoComplete,
}: {
   id: string;
   value: string;
   onChange: (value: string) => void;
   invalid: boolean;
   describedBy?: string;
   autoComplete: string;
}) {
   const [visible, setVisible] = useState(false);

   return (
      <div className="relative">
         <Input
            id={id}
            type={visible ? "text" : "password"}
            value={value}
            autoComplete={autoComplete}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 pr-10"
         />

         <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
         >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
         </button>
      </div>
   );
}

type PasswordErrors = { current?: string; next?: string; confirm?: string };

function ChangePasswordForm() {
   const changePassword = useChangePassword();

   const [current, setCurrent] = useState("");
   const [next, setNext] = useState("");
   const [confirm, setConfirm] = useState("");
   const [errors, setErrors] = useState<PasswordErrors>({});
   const [done, setDone] = useState(false);

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const found: PasswordErrors = {};

      if (!current) found.current = "Enter your current password.";

      if (next.length < 8) found.next = "New password must be at least 8 characters.";
      else if (next === current)
         found.next = "New password must be different from the current one.";

      if (confirm !== next) found.confirm = "Passwords do not match.";

      setErrors(found);
      setDone(false);

      if (Object.keys(found).length > 0) return;

      changePassword.mutate(
         { currentPassword: current, newPassword: next },
         {
            onSuccess: () => {
               setDone(true);
               setCurrent("");
               setNext("");
               setConfirm("");
               toast.success("Password changed successfully.");
            },
            onError: (error) => {
               const message = errorMessage(error, "Failed to change password.");

               // The backend tells us when the current password is wrong
               if (/current password is incorrect/i.test(message)) {
                  setErrors({ current: message });
               } else {
                  toast.error(message);
               }
            },
         },
      );
   };

   return (
      <form
         onSubmit={handleSubmit}
         noValidate
         className="space-y-5 rounded-xl border border-border bg-card p-6"
      >
         <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
               <KeyRound className="size-5" />
            </span>

            <div>
               <h2 className="text-lg font-semibold">Change password</h2>
               <p className="text-sm text-muted-foreground">
                  Use at least 8 characters that you do not use anywhere else.
               </p>
            </div>
         </div>

         <FormField label="Current password" htmlFor="current-password" error={errors.current}>
            <PasswordInput
               id="current-password"
               value={current}
               onChange={setCurrent}
               invalid={!!errors.current}
               describedBy={errors.current ? "current-password-error" : undefined}
               autoComplete="current-password"
            />
         </FormField>

         <FormField label="New password" htmlFor="new-password" error={errors.next}>
            <PasswordInput
               id="new-password"
               value={next}
               onChange={setNext}
               invalid={!!errors.next}
               describedBy={errors.next ? "new-password-error" : undefined}
               autoComplete="new-password"
            />
         </FormField>

         <FormField label="Confirm new password" htmlFor="confirm-password" error={errors.confirm}>
            <PasswordInput
               id="confirm-password"
               value={confirm}
               onChange={setConfirm}
               invalid={!!errors.confirm}
               describedBy={errors.confirm ? "confirm-password-error" : undefined}
               autoComplete="new-password"
            />
         </FormField>

         {done && (
            <p role="status" className="text-sm font-medium text-success">
               Your password has been updated.
            </p>
         )}

         <Button type="submit" size="lg" className="h-10 px-5" disabled={changePassword.isPending}>
            {changePassword.isPending && <Loader2 className="animate-spin" />}
            {changePassword.isPending ? "Updating..." : "Update password"}
         </Button>
      </form>
   );
}

/* ---------- Page ---------- */

function ProfileSkeleton() {
   return (
      <div className="space-y-6">
         <Skeleton className="h-40 rounded-xl" />
         <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
         </div>
      </div>
   );
}

export function ProfileView({ children }: { children?: React.ReactNode }) {
   const { data, isLoading, isError, error, refetch } = useMyProfile();

   const profile = data?.data;

   return (
      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="mt-1 text-muted-foreground">
               Manage your personal details and account security.
            </p>
         </div>

         {isLoading ? (
            <ProfileSkeleton />
         ) : isError || !profile ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
               <h2 className="text-lg font-semibold">We could not load your profile</h2>
               <p className="mt-2 text-sm text-destructive">
                  {errorMessage(error, "Something went wrong. Please try again.")}
               </p>
               <Button className="mt-4" onClick={() => refetch()}>
                  Try again
               </Button>
            </div>
         ) : (
            <>
               <ProfileHeader profile={profile} />

               {children}

               <div className="grid items-start gap-6 lg:grid-cols-2">
                  {/* key remounts the form with fresh values after each successful save */}
                  <PersonalInfoForm key={profile.updatedAt} profile={profile} />
                  <ChangePasswordForm />
               </div>
            </>
         )}
      </div>
   );
}
