import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
   title: "Help Center | FixItNow",
   description: "Answers about bookings, payments, accounts and technician profiles.",
};

type Topic = { title: string; items: { question: string; answer: string }[] };

const TOPICS: Topic[] = [
   {
      title: "Booking a service",
      items: [
         {
            question: "How do I book a technician?",
            answer:
               "Create a customer account, open a service from the Services page and send a booking request with your preferred date and a short note. The technician then accepts or declines it.",
         },
         {
            question: "Do I need an account to browse?",
            answer:
               "No. Anyone can browse services, read reviews and view technician details. You need a customer account only to send a booking.",
         },
         {
            question: "What do the booking statuses mean?",
            answer:
               "Requested means your request is waiting for the technician. Accepted or Declined is their answer. Paid means payment is complete. In progress and Completed show the state of the work, and Canceled means the booking was stopped.",
         },
         {
            question: "Where can I see my bookings?",
            answer:
               "Sign in and open My Bookings in your dashboard. Every booking is listed there with its current status.",
         },
      ],
   },
   {
      title: "Payments",
      items: [
         {
            question: "When do I pay?",
            answer:
               "Only after the technician accepts your booking. A Pay button then appears on that booking in your dashboard.",
         },
         {
            question: "How is payment made?",
            answer:
               "Payments are handled securely by Stripe. Your card details are entered on Stripe and are never stored by FixItNow.",
         },
         {
            question: "My booking still shows as not paid after I paid.",
            answer:
               "Confirmation comes back from Stripe and can take a moment. Refresh your bookings page after a minute. If it still has not changed, send us a message with the booking details.",
         },
      ],
   },
   {
      title: "Reviews",
      items: [
         {
            question: "Can I review a technician?",
            answer:
               "Yes, once your booking is completed you can leave a rating and a comment on that booking.",
         },
         {
            question: "Why can I not review yet?",
            answer:
               "Reviews open only for completed bookings, so the technician has to mark the job as completed first.",
         },
      ],
   },
   {
      title: "Accounts",
      items: [
         {
            question: "How do I change my name or password?",
            answer:
               "Open Profile from the menu under your name. You can edit your name there and change your password.",
         },
         {
            question: "I cannot sign in.",
            answer:
               "Check that your email and password are correct. If your account has been blocked by an administrator, you will see a message saying so. In that case, contact us.",
         },
      ],
   },
   {
      title: "For technicians",
      items: [
         {
            question: "How do I start receiving bookings?",
            answer:
               "Register as a technician, complete your profile with your skills, experience, location and hourly rate, and add the services you offer.",
         },
         {
            question: "How do I handle a request?",
            answer:
               "Open your technician dashboard, review the request and accept or decline it. After accepting, update the booking status as the work progresses.",
         },
      ],
   },
];

export default function HelpPage() {
   return (
      <main className="flex-1">
         <PageHero
            eyebrow="Help Center"
            title="How can we help?"
            description="Quick answers about bookings, payments, accounts and technician profiles."
         />

         <div className="container-page max-w-3xl space-y-10 py-12">
            {TOPICS.map((topic) => (
               <section key={topic.title} className="space-y-3">
                  <h2 className="text-xl font-semibold tracking-tight">{topic.title}</h2>

                  <div className="divide-y divide-border rounded-xl border border-border bg-card">
                     {topic.items.map((item) => (
                        <details key={item.question} className="group px-5 py-4">
                           <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                              {item.question}
                              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                           </summary>
                           <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
                        </details>
                     ))}
                  </div>
               </section>
            ))}

            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-accent/50 p-6 sm:flex-row sm:items-center">
               <div>
                  <h2 className="font-semibold">Still need help?</h2>
                  <p className="text-sm text-muted-foreground">
                     Send us a message and we will get back to you.
                  </p>
               </div>

               <Link
                  href="/contact"
                  className={buttonVariants({ size: "lg", className: "h-10 px-4" })}
               >
                  Contact us
               </Link>
            </div>
         </div>
      </main>
   );
}
