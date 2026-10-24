import { Mail, MapPin, Phone, Wrench } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

// lucide-react no longer ships brand icons, so brand logos are inline SVGs.
function GithubIcon(props: SVGProps<SVGSVGElement>) {
   return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
         <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
   );
}

type SocialLink = {
   label: string;
   href: string;
   icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/*
  Fill in your real details here. Any empty value is hidden automatically,
  so the footer never shows dummy content.
*/
const CONTACT = {
   email: "",
   phone: "",
   address: "",
};

const SOCIAL_LINKS: SocialLink[] = [
   { label: "GitHub", href: "https://github.com/mohiuddinahmed121", icon: GithubIcon },
   // Add more the same way: { label: "Facebook", href: "https://facebook.com/yourpage", icon: FacebookIcon },
];

const FOOTER_COLUMNS = [
   {
      title: "Company",
      links: [
         { label: "About Us", href: "/about" },
         { label: "Blog", href: "/blog" },
         { label: "Contact", href: "/contact" },
      ],
   },
   {
      title: "Services",
      links: [
         { label: "All Services", href: "/services" },
         { label: "Create Account", href: "/register" },
         { label: "Login", href: "/login" },
      ],
   },
   {
      title: "Support",
      links: [
         { label: "Help Center", href: "/help" },
         { label: "Privacy Policy", href: "/privacy" },
         { label: "Terms of Service", href: "/terms" },
      ],
   },
];

export function Footer() {
   const hasContact = CONTACT.email || CONTACT.phone || CONTACT.address;

   return (
      <footer className="mt-auto border-t border-border bg-card">
         <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="space-y-4 lg:col-span-2">
               <Link href="/" className="inline-flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                     <Wrench className="size-5" />
                  </span>
                  <span className="text-xl font-bold tracking-tight">FixItNow</span>
               </Link>

               <p className="max-w-sm text-sm text-muted-foreground">
                  A home service marketplace that connects customers with trusted technicians for
                  repair, maintenance and installation work.
               </p>

               {hasContact && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                     {CONTACT.email && (
                        <li className="flex items-center gap-2">
                           <Mail className="size-4 shrink-0 text-primary" />
                           <a
                              href={`mailto:${CONTACT.email}`}
                              className="transition-colors hover:text-foreground"
                           >
                              {CONTACT.email}
                           </a>
                        </li>
                     )}
                     {CONTACT.phone && (
                        <li className="flex items-center gap-2">
                           <Phone className="size-4 shrink-0 text-primary" />
                           <a
                              href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                              className="transition-colors hover:text-foreground"
                           >
                              {CONTACT.phone}
                           </a>
                        </li>
                     )}
                     {CONTACT.address && (
                        <li className="flex items-center gap-2">
                           <MapPin className="size-4 shrink-0 text-primary" />
                           <span>{CONTACT.address}</span>
                        </li>
                     )}
                  </ul>
               )}

               <ul className="flex items-center gap-2">
                  {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                     <li key={label}>
                        <a
                           href={href}
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label={label}
                           className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                           <Icon className="size-4" />
                        </a>
                     </li>
                  ))}
               </ul>
            </div>

            {/* Link columns */}
            {FOOTER_COLUMNS.map((column) => (
               <nav key={column.title} aria-label={column.title}>
                  <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
                  <ul className="space-y-2.5">
                     {column.links.map((link) => (
                        <li key={link.href}>
                           <Link
                              href={link.href}
                              className="text-sm text-muted-foreground transition-colors hover:text-primary"
                           >
                              {link.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </nav>
            ))}
         </div>

         <div className="border-t border-border">
            <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-sm text-muted-foreground sm:flex-row">
               <p>&copy; {new Date().getFullYear()} FixItNow. All rights reserved.</p>
               <p>Built by Mohiuddin Ahmed</p>
            </div>
         </div>
      </footer>
   );
}
