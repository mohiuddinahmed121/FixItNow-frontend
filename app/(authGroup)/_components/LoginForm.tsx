"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginForm() {
   const router = useRouter();
   const searchParams = useSearchParams();

   const redirectTo = searchParams.get("redirectTo") ?? "";

   const loginMutation = useLogin();

   useEffect(() => {
      if (!loginMutation.isSuccess) return;

      toast.success(loginMutation.data.message || "Login successful!");

      const role = loginMutation.data.data.user.role;

      if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
         router.push(redirectTo);
         return;
      }

      if (role === "CUSTOMER") {
         router.push("/dashboard");
      } else if (role === "TECHNICIAN") {
         router.push("/technician-dashboard");
      } else if (role === "ADMIN") {
         router.push("/admin-dashboard");
      }
   }, [loginMutation.isSuccess, loginMutation.data, redirectTo, router]);

   useEffect(() => {
      if (!loginMutation.isError) return;

      toast.error(
         loginMutation.error instanceof Error ? loginMutation.error.message : "Login failed",
      );
   }, [loginMutation.isError, loginMutation.error]);

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      loginMutation.mutate({
         email,
         password,
      });
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <Card className="space-y-4 p-5">
            <Input name="email" type="email" placeholder="Enter Your Email" required />

            <Input name="password" type="password" placeholder="Enter Your Password" required />

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
               {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
         </Card>
      </form>
   );
}
