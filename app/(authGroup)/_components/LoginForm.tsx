"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/authActions";

const LoginForm = () => {
   const searchParams = useSearchParams();

   const redirectTo = searchParams.get("redirectTo") ?? "";

   const [state, action, pending] = useActionState(loginAction.bind(null, redirectTo), null);

   useEffect(() => {
      if (!state) return;

      if (!state.success) {
         toast.error(state.message || "Login failed");
      }
   }, [state]);

   return (
      <form action={action} className="space-y-4">
         <Card className="space-y-4 p-5">
            <Input name="email" type="email" placeholder="Enter Your Email" required />

            <Input name="password" type="password" placeholder="Enter Your Password" required />

            <Button type="submit" className="w-full" disabled={pending}>
               {pending ? "Logging in..." : "Login"}
            </Button>
         </Card>
      </form>
   );
};

export default LoginForm;
