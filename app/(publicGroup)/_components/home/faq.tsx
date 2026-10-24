import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const FAQS = [
   {
      question: "Do I need an account to browse services?",
      answer:
         "No. Anyone can browse services and technician details. You only need a free customer account when you are ready to book.",
   },
   {
      question: "How does booking work?",
      answer:
         "You send a booking request to a technician. They can accept or decline it, and you can follow the status from your dashboard.",
   },
   {
      question: "When do I pay?",
      answer:
         "Payment opens after the technician accepts your booking. You pay online with Stripe Checkout, and the booking is marked as paid automatically.",
   },
   {
      question: "Can I leave a review?",
      answer:
         "Yes. After your booking is completed you can rate the technician and add a comment, which then appears on their service pages.",
   },
   {
      question: "How do I offer my services as a technician?",
      answer:
         "Create an account and choose Technician during registration. Then set up your profile and add the services you provide.",
   },
];

export function Faq() {
   return (
      <section className="section-y">
         <div className="container-page">
            <SectionHeading
               eyebrow="FAQ"
               title="Questions, answered"
               description="Quick answers about booking, paying and reviewing."
            />

            <div className="mx-auto max-w-3xl space-y-3">
               {FAQS.map(({ question, answer }) => (
                  <details
                     key={question}
                     className="group rounded-xl border border-border bg-card px-5 py-4 open:border-primary/50"
                  >
                     <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                        {question}
                        <Plus className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45" />
                     </summary>
                     <p className="pt-3 text-sm text-muted-foreground text-pretty">{answer}</p>
                  </details>
               ))}
            </div>
         </div>
      </section>
   );
}
