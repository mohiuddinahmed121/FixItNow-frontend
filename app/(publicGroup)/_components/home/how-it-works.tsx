import { CalendarCheck, CreditCard, Search, Star, UserCheck, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const STEPS: { title: string; description: string; icon: LucideIcon }[] = [
   {
      title: "Browse services",
      description: "Look through services by category and compare price, location and experience.",
      icon: Search,
   },
   {
      title: "Send a booking",
      description: "Pick a date and send your booking request to the technician you like.",
      icon: CalendarCheck,
   },
   {
      title: "Technician accepts",
      description: "The technician reviews your request and accepts or declines it.",
      icon: UserCheck,
   },
   {
      title: "Pay securely",
      description: "Once accepted, pay online through Stripe Checkout. No cash needed.",
      icon: CreditCard,
   },
   {
      title: "Leave a review",
      description: "After the job, rate the technician to help other customers choose.",
      icon: Star,
   },
];

export function HowItWorks() {
   return (
      <section className="section-y">
         <div className="container-page">
            <SectionHeading
               eyebrow="How it works"
               title="From request to review in five steps"
               description="Everything happens on FixItNow, so you always know where your booking stands."
            />

            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
               {STEPS.map(({ title, description, icon: Icon }, index) => (
                  <li
                     key={title}
                     className="relative flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
                  >
                     <span className="absolute -top-3 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full bg-cta text-xs font-bold text-cta-foreground">
                        {index + 1}
                     </span>

                     <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                        <Icon className="size-7" />
                     </span>

                     <h3 className="mb-2 font-semibold">{title}</h3>
                     <p className="text-sm text-muted-foreground">{description}</p>
                  </li>
               ))}
            </ol>
         </div>
      </section>
   );
}
