"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";

export default function LoginForm() {
   const router = useRouter();
   const loginMutation = useLogin();

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      loginMutation.mutate(
         {
            email,
            password,
         },
         {
            onSuccess: (response) => {
               const role = response.data.user.role;

               if (role === "CUSTOMER") {
                  router.push("/dashboard");
               } else if (role === "TECHNICIAN") {
                  router.push("/technician-dashboard");
               } else if (role === "ADMIN") {
                  router.push("/admin-dashboard");
               } else {
                  router.push("/");
               }
            },
            onError: (error) => {
               console.error("Login failed:", error);
            },
         },
      );
   };

   return (
      <form onSubmit={handleSubmit}>
         <Card className="space-y-4 p-6">
            <Input
               type="email"
               name="email"
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />

            <Input
               type="password"
               name="password"
               placeholder="Enter your password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
               {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            {loginMutation.isError && (
               <p className="text-sm text-red-500">
                  Login failed. Please check your email and password.
               </p>
            )}
         </Card>
      </form>
   );
}
