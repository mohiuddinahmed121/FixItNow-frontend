import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { SITE } from "@/lib/site-config";
import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
   title: "Contact | FixItNow",
   description: "Get in touch with the FixItNow team.",
};

type Detail = { label: string; value: string; href: string; icon: LucideIcon };

export default function ContactPage() {
   const details: Detail[] = [];

   if (SITE.email) {
      details.push({ label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, icon: Mail });
   }
   if (SITE.phone) {
      details.push({
         label: "Phone",
         value: SITE.phone,
         href: `tel:${SITE.phone.replace(/\s+/g, "")}`,
         icon: Phone,
      });
   }
   if (SITE.address) {
      details.push({ label: "Address", value: SITE.address, href: "", icon: MapPin });
   }

   return (
      <main className="flex-1">
         <PageHero
            eyebrow="Contact"
            title="We would love to hear from you"
            description="Send us a message and we will get back to you."
         />

         <section className="container-page grid gap-8 py-12 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
               {details.map(({ label, value, href, icon: Icon }) => (
                  <div
                     key={label}
                     className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                  >
                     <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="size-5" />
                     </span>

                     <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">{label}</p>

                        {href ? (
                           <a href={href} className="font-medium break-words hover:text-primary">
                              {value}
                           </a>
                        ) : (
                           <p className="font-medium">{value}</p>
                        )}
                     </div>
                  </div>
               ))}

               <div className="rounded-xl border border-border bg-card p-5">
                  <h2 className="font-semibold">Looking for quick answers?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                     Many questions about booking, payment and reviews are answered in our FAQ on
                     the home page.
                  </p>
                  <Link
                     href="/#faq"
                     className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                  >
                     Read the FAQ
                  </Link>
               </div>
            </div>

            <div className="lg:col-span-3">
               <ContactForm />
            </div>
         </section>
      </main>
   );
}
