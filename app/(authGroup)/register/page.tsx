"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerAction } from "../_actions/registerAction";
import { useActionState } from "react";

const initialState = null;

export default function RegisterPage() {
   const [state, formAction, isPending] = useActionState(registerAction, initialState);

   return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
         <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
            <div className="space-y-2 text-center">
               <h1 className="text-3xl font-bold">Create Your Account</h1>

               <p className="text-muted-foreground">Join FixItNow and get started</p>
            </div>

            {state && !state.success && (
               <p className="text-center text-sm text-red-500">{state.message}</p>
            )}

            <form action={formAction}>
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

                  <Button type="submit" className="w-full" disabled={isPending}>
                     {isPending ? "Creating Account..." : "Create Account"}
                  </Button>
               </Card>
            </form>
         </div>
      </div>
   );
}
