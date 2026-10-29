import { ArrowRight, Server, ShieldCheck, UserRound, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/site-config";
import { Cta } from "../_components/home/cta";
import { Stats } from "../_components/home/stats";

export const metadata: Metadata = {
   title: "About | FixItNow",
   description:
      "FixItNow is a home service marketplace that connects customers with technicians for repair, maintenance and installation work.",
};

const ROLES = [
   {
      title: "For customers",
      icon: UserRound,
      points: [
         "Browse services and compare technicians",
         "Create and manage bookings",
         "Pay securely online",
         "Review the technician after the job",
      ],
   },
   {
      title: "For technicians",
      icon: Wrench,
      points: [
         "Create a profile and list your services",
         "Accept or decline booking requests",
         "Update the status of each booking",
         "Set your availability",
      ],
   },
   {
      title: "For administrators",
      icon: ShieldCheck,
      points: [
         "Manage users and block accounts when needed",
         "Manage service categories",
         "Oversee every booking on the platform",
      ],
   },
];

const FLOW = [
   "Customer sends a booking",
   "Technician accepts",
   "Customer pays with Stripe",
   "Payment is confirmed",
   "Booking is marked paid",
];

const STACK = [
   { label: "Frontend", value: "Next.js, React, TypeScript, TanStack Query, Tailwind CSS" },
   { label: "Backend", value: "Node.js, Express, TypeScript" },
   { label: "Data", value: "PostgreSQL with Prisma" },
   { label: "Payments & auth", value: "Stripe and JWT authentication" },
];

export default function AboutPage() {
   return (
      <main className="flex-1">
         <PageHero
            eyebrow="About FixItNow"
            title="Home services, made simple"
            description="FixItNow is a home service marketplace that connects customers with technicians for repair, maintenance and installation work."
         >
            <div className="pt-2">
               <Link
                  href="/services"
                  className={buttonVariants({ size: "lg", className: "h-10 px-5" })}
               >
                  Browse services
                  <ArrowRight />
               </Link>
            </div>
         </PageHero>

         <Stats />

         <section className="section-y">
            <div className="container-page">
               <SectionHeading
                  eyebrow="Who it is for"
                  title="One platform, three roles"
                  description="Each role has its own dashboard and only sees what it needs."
               />

               <div className="grid gap-6 md:grid-cols-3">
                  {ROLES.map(({ title, icon: Icon, points }) => (
                     <div
                        key={title}
                        className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6"
                     >
                        <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                           <Icon className="size-5" />
                        </span>

                        <h3 className="text-lg font-semibold">{title}</h3>

                        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-primary">
                           {points.map((point) => (
                              <li key={point}>{point}</li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section className="section-y bg-muted/40">
            <div className="container-page">
               <SectionHeading
                  eyebrow="Payments"
                  title="How a booking is paid"
                  description="Payment only opens after a technician has agreed to the job, so you never pay for a request nobody accepted."
               />

               <ol className="grid gap-4 md:grid-cols-5">
                  {FLOW.map((step, index) => (
                     <li
                        key={step}
                        className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center"
                     >
                        <span className="grid size-9 place-items-center rounded-full bg-cta text-sm font-bold text-cta-foreground">
                           {index + 1}
                        </span>
                        <span className="text-sm font-medium">{step}</span>
                     </li>
                  ))}
               </ol>
            </div>
         </section>

         <section className="section-y">
            <div className="container-page grid items-start gap-8 lg:grid-cols-2">
               <div className="space-y-6">
                  <SectionHeading
                     align="left"
                     eyebrow="Built with"
                     title="The technology behind it"
                     description="A separate frontend and backend, connected through a secure API."
                     className="mb-0"
                  />

                  <dl className="space-y-4">
                     {STACK.map(({ label, value }) => (
                        <div
                           key={label}
                           className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                        >
                           <Server className="mt-0.5 size-5 shrink-0 text-primary" />
                           <div>
                              <dt className="text-sm font-semibold">{label}</dt>
                              <dd className="text-sm text-muted-foreground">{value}</dd>
                           </div>
                        </div>
                     ))}
                  </dl>
               </div>

               <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                  <h2 className="text-2xl font-bold tracking-tight">Built by</h2>

                  <div className="flex items-center gap-4">
                     <span className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                        M
                     </span>
                     <div>
                        <p className="text-lg font-semibold">Mohiuddin Ahmed</p>
                        <p className="text-sm text-muted-foreground">
                           Computer Science &amp; Engineering, University of Asia Pacific
                        </p>
                     </div>
                  </div>

                  <p className="text-muted-foreground">
                     FixItNow was built as a full-stack project covering authentication, role-based
                     access, bookings, online payments and reviews.
                  </p>

                  <a
                     href={SITE.github}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "h-10 px-4",
                     })}
                  >
                     View on GitHub
                  </a>
               </div>
            </div>
         </section>

         <Cta />
      </main>
   );
}
