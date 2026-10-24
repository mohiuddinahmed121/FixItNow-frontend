import {
   BadgeCheck,
   CreditCard,
   LayoutDashboard,
   MessageSquareText,
   ShieldCheck,
   Wallet,
   type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
   {
      title: "Secure online payments",
      description: "Payments run through Stripe, and your booking is marked paid automatically.",
      icon: CreditCard,
   },
   {
      title: "Real customer reviews",
      description: "Only customers with a completed booking can review, so ratings stay honest.",
      icon: MessageSquareText,
   },
   {
      title: "Clear pricing",
      description: "Every service shows its price and the technician's hourly rate up front.",
      icon: Wallet,
   },
   {
      title: "Booking dashboard",
      description: "Track every booking, payment and status update from your own dashboard.",
      icon: LayoutDashboard,
   },
   {
      title: "Accept or decline control",
      description: "Technicians confirm each request, so you know someone is ready to come.",
      icon: BadgeCheck,
   },
   {
      title: "Protected accounts",
      description: "Role-based access keeps customers, technicians and admins in their own areas.",
      icon: ShieldCheck,
   },
];

export function WhyUs() {
   return (
      <section className="section-y bg-muted/40">
         <div className="container-page">
            <SectionHeading
               eyebrow="Why FixItNow"
               title="Built to make home services simple"
               description="The tools customers and technicians need, in one place."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {FEATURES.map(({ title, description, icon: Icon }) => (
                  <div
                     key={title}
                     className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6"
                  >
                     <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                        <Icon className="size-5" />
                     </span>
                     <h3 className="font-semibold">{title}</h3>
                     <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
