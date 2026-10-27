// import { Suspense } from "react";
// import LoginForm from "../_components/LoginForm";

// export default function LoginPage() {
//    return (
//       <div className="flex min-h-screen items-center justify-center">
//          <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
//             <div className="space-y-2 text-center">
//                <h1 className="text-3xl font-bold">Welcome Back!</h1>

//                <p className="text-muted-foreground">
//                   Enter your credentials to access your account
//                </p>
//             </div>

//             <Suspense fallback={<div>Loading...</div>}>
//                <LoginForm />
//             </Suspense>
//          </div>
//       </div>
//    );
// }

import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { AuthShell } from "../_components/AuthShell";
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
   return (
      <AuthShell title="Welcome back" subtitle="Log in to manage your bookings and payments.">
         <Suspense fallback={<Skeleton className="h-72 rounded-xl" />}>
            <LoginForm />
         </Suspense>
      </AuthShell>
   );
}
