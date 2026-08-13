"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
   const router = useRouter();
   const registerMutation = useRegister();

   useEffect(() => {
      if (!registerMutation.isSuccess) return;

      toast.success(registerMutation.data.message || "Registration successful!");

      const role = registerMutation.data.data.user.role;

      if (role === "CUSTOMER") {
         router.push("/dashboard");
      } else if (role === "TECHNICIAN") {
         router.push("/technician-dashboard");
      }
   }, [registerMutation.isSuccess, registerMutation.data, router]);

   useEffect(() => {
      if (!registerMutation.isError) return;

      toast.error(
         registerMutation.error instanceof Error
            ? registerMutation.error.message
            : "Registration failed",
      );
   }, [registerMutation.isError, registerMutation.error]);

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      registerMutation.mutate({
         name: formData.get("name") as string,
         email: formData.get("email") as string,
         password: formData.get("password") as string,
         role: formData.get("role") as "CUSTOMER" | "TECHNICIAN",
      });
   };

   return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
         <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
            <div className="space-y-2 text-center">
               <h1 className="text-3xl font-bold">Create Your Account</h1>

               <p className="text-muted-foreground">Join FixItNow and get started</p>
            </div>

            <form onSubmit={handleSubmit}>
               <Card className="space-y-4 p-5">
                  <Input name="name" type="text" placeholder="Enter your name" required />

                  <Input name="email" type="email" placeholder="Enter your email" required />

                  <Input
                     name="password"
                     type="password"
                     placeholder="Enter your password"
                     required
                  />

                  <div className="space-y-2">
                     <label htmlFor="role" className="text-sm font-medium">
                        Register As
                     </label>

                     <select
                        id="role"
                        name="role"
                        defaultValue="CUSTOMER"
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                     >
                        <option value="CUSTOMER">Customer</option>

                        <option value="TECHNICIAN">Technician</option>
                     </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                     {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
               </Card>
            </form>
         </div>
      </div>
   );
}
