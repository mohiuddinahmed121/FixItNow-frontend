import { CalendarCheck, CreditCard, ShieldCheck, Wrench } from "lucide-react";

const HIGHLIGHTS = [
   { icon: ShieldCheck, text: "Compare technicians by price, experience and location" },
   { icon: CalendarCheck, text: "Send a booking and track its status from your dashboard" },
   { icon: CreditCard, text: "Pay securely online with Stripe once your booking is accepted" },
];

type AuthShellProps = {
   title: string;
   subtitle: string;
   children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
   return (
      <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
         {/* Brand panel (desktop only) */}
         <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
            <div
               aria-hidden="true"
               className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-primary-foreground/10 blur-2xl"
            />

            <div className="relative flex items-center gap-2">
               <span className="grid size-10 place-items-center rounded-lg bg-primary-foreground/15">
                  <Wrench className="size-5" />
               </span>
               <span className="text-2xl font-bold tracking-tight">FixItNow</span>
            </div>

            <div className="relative space-y-8">
               <h2 className="max-w-md text-4xl leading-tight font-bold tracking-tight text-balance">
                  Home services, handled by people you can trust.
               </h2>

               <ul className="space-y-4">
                  {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                     <li key={text} className="flex items-start gap-3 text-primary-foreground/90">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary-foreground/15">
                           <Icon className="size-4" />
                        </span>
                        {text}
                     </li>
                  ))}
               </ul>
            </div>

            <p className="relative text-sm text-primary-foreground/70">
               &copy; {new Date().getFullYear()} FixItNow
            </p>
         </aside>

         {/* Form side */}
         <div className="flex items-center justify-center px-4 py-10 sm:px-8">
            <div className="w-full max-w-md space-y-6">
               <div className="space-y-2 text-center lg:text-left">
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  <p className="text-muted-foreground">{subtitle}</p>
               </div>

               {children}
            </div>
         </div>
      </div>
   );
}
