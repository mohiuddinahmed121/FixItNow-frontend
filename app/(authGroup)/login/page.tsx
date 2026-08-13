import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
   return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
         <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
            <div className="space-y-2 text-center">
               <h1 className="text-3xl font-bold">Welcome Back!</h1>

               <p className="text-muted-foreground">
                  Enter your credentials to access your FixItNow account
               </p>
            </div>

            <LoginForm />
         </div>
      </div>
   );
}
