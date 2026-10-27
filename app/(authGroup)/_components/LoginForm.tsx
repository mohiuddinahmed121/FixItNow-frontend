"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState, useTransition } from "react";

import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "../_actions/authActions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DemoAccount = { label: string; email: string; password: string };

/*
  Demo accounts come from your .env file, so no credentials live in the code.
  A demo button only shows when both its email and password are set.
*/
const DEMO_ACCOUNTS = [
   {
      label: "Customer",
      email: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL,
      password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD,
   },
   {
      label: "Technician",
      email: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL,
      password: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD,
   },
   {
      label: "Admin",
      email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
      password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD,
   },
].filter((account): account is DemoAccount => !!account.email && !!account.password);

type Errors = { email?: string; password?: string };

const LoginForm = () => {
   const searchParams = useSearchParams();
   const redirectTo = searchParams.get("redirectTo") ?? "";

   const [state, action, pending] = useActionState(loginAction.bind(null, redirectTo), null);
   const [, startTransition] = useTransition();

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errors, setErrors] = useState<Errors>({});

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      const found: Errors = {};

      if (!email.trim()) found.email = "Enter your email address.";
      else if (!EMAIL_PATTERN.test(email.trim())) found.email = "Enter a valid email address.";

      if (!password) found.password = "Enter your password.";

      setErrors(found);

      // Stop the server action until the form is valid
      if (Object.keys(found).length > 0) event.preventDefault();
   };

   const loginWithDemo = (account: DemoAccount) => {
      const formData = new FormData();

      formData.set("email", account.email);
      formData.set("password", account.password);

      setEmail(account.email);
      setPassword(account.password);
      setErrors({});

      startTransition(() => action(formData));
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
                  {state.message || "Login failed. Please try again."}
               </div>
            )}

            <FormField label="Email" htmlFor="login-email" error={errors.email}>
               <Input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10"
               />
            </FormField>

            <FormField label="Password" htmlFor="login-password" error={errors.password}>
               <PasswordInput
                  id="login-password"
                  name="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  invalid={!!errors.password}
                  describedBy={errors.password ? "login-password-error" : undefined}
               />
            </FormField>

            <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
               {pending && <Loader2 className="animate-spin" />}
               {pending ? "Logging in..." : "Login"}
            </Button>
         </form>

         {DEMO_ACCOUNTS.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  Or try a demo account
                  <span className="h-px flex-1 bg-border" />
               </div>

               <div className="grid grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map((account) => (
                     <Button
                        key={account.label}
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-10"
                        disabled={pending}
                        onClick={() => loginWithDemo(account)}
                     >
                        {account.label}
                     </Button>
                  ))}
               </div>
            </div>
         )}

         <p className="text-center text-sm text-muted-foreground">
            Do not have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
               Create one
            </Link>
         </p>
      </div>
   );
};

export default LoginForm;
