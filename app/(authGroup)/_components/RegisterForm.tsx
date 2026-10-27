"use client";

import { Loader2, UserRound, Wrench } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerAction } from "../_actions/registerAction";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Role = "CUSTOMER" | "TECHNICIAN";

const ROLES: { value: Role; title: string; description: string; icon: typeof UserRound }[] = [
   {
      value: "CUSTOMER",
      title: "Customer",
      description: "I want to book services",
      icon: UserRound,
   },
   { value: "TECHNICIAN", title: "Technician", description: "I offer services", icon: Wrench },
];

type Errors = { name?: string; email?: string; password?: string; confirm?: string };

export default function RegisterForm() {
   const [state, action, pending] = useActionState(registerAction, null);

   const [role, setRole] = useState<Role>("CUSTOMER");
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirm, setConfirm] = useState("");
   const [errors, setErrors] = useState<Errors>({});

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      const found: Errors = {};

      if (name.trim().length < 2) found.name = "Name must be at least 2 characters.";

      if (!email.trim()) found.email = "Enter your email address.";
      else if (!EMAIL_PATTERN.test(email.trim())) found.email = "Enter a valid email address.";

      if (password.length < 8) found.password = "Password must be at least 8 characters.";

      if (confirm !== password) found.confirm = "Passwords do not match.";

      setErrors(found);

      if (Object.keys(found).length > 0) event.preventDefault();
   };

   const failed = state && !state.success;

   return (
      <div className="space-y-6">
         <form action={action} onSubmit={handleSubmit} noValidate className="space-y-5">
            {failed && (
               <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
               >
                  {state.message || "Registration failed. Please try again."}
               </div>
            )}

            <fieldset className="space-y-2">
               <legend className="text-sm font-medium">I want to join as</legend>

               <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(({ value, title, description, icon: Icon }) => (
                     <label
                        key={value}
                        className={cn(
                           "flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                           role === value
                              ? "border-primary bg-accent text-accent-foreground"
                              : "border-border bg-card hover:bg-muted",
                        )}
                     >
                        <input
                           type="radio"
                           name="role"
                           value={value}
                           checked={role === value}
                           onChange={() => setRole(value)}
                           className="sr-only"
                        />
                        <Icon className="size-5 text-primary" />
                        <span className="text-sm font-semibold">{title}</span>
                        <span className="text-xs text-muted-foreground">{description}</span>
                     </label>
                  ))}
               </div>
            </fieldset>

            <FormField label="Full name" htmlFor="register-name" error={errors.name}>
               <Input
                  id="register-name"
                  name="name"
                  value={name}
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "register-name-error" : undefined}
                  onChange={(event) => setName(event.target.value)}
                  className="h-10"
               />
            </FormField>

            <FormField label="Email" htmlFor="register-email" error={errors.email}>
               <Input
                  id="register-email"
                  name="email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10"
               />
            </FormField>

            <FormField
               label="Password"
               htmlFor="register-password"
               error={errors.password}
               hint="Use at least 8 characters."
            >
               <PasswordInput
                  id="register-password"
                  name="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  invalid={!!errors.password}
                  describedBy={errors.password ? "register-password-error" : undefined}
               />
            </FormField>

            <FormField label="Confirm password" htmlFor="register-confirm" error={errors.confirm}>
               <PasswordInput
                  id="register-confirm"
                  value={confirm}
                  onChange={setConfirm}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  invalid={!!errors.confirm}
                  describedBy={errors.confirm ? "register-confirm-error" : undefined}
               />
            </FormField>

            <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
               {pending && <Loader2 className="animate-spin" />}
               {pending ? "Creating account..." : "Create account"}
            </Button>
         </form>

         <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
               Log in
            </Link>
         </p>
      </div>
   );
}
