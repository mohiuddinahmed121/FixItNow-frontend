import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/shared/legal-page";

export const metadata: Metadata = {
   title: "Privacy Policy | FixItNow",
   description: "What information FixItNow collects, why, and how it is used.",
};

const SECTIONS: LegalSection[] = [
   {
      heading: "Information we collect",
      paragraphs: ["We collect only the information needed to run the marketplace."],
      list: [
         "Account details: your name, email address and role (customer, technician or administrator). Your password is stored only as a hash, never as plain text.",
         "Technician profile details: bio, years of experience, skills, location, hourly rate and availability.",
         "Booking details: the service you book, the date you choose and any note you write.",
         "Reviews: the rating and comment you leave after a completed job.",
         "Contact messages: the name, email, subject and message you send through the contact form.",
         "Payment records: the amount, status and date of a payment. Card details are entered on Stripe and are never stored by FixItNow.",
      ],
   },
   {
      heading: "How we use it",
      list: [
         "To create your account and sign you in",
         "To show technician profiles, services and reviews",
         "To create, accept, pay for and track bookings",
         "To reply to the messages you send us",
         "To let administrators keep the platform safe, including blocking accounts that break the terms",
      ],
   },
   {
      heading: "Cookies and local storage",
      paragraphs: [
         "When you sign in, FixItNow stores two secure, HTTP-only cookies in your browser: an access token and a refresh token. They keep you signed in and are removed when you log out.",
         "Your light or dark theme choice is saved in your browser's local storage so the site remembers it. It stays on your device.",
      ],
   },
   {
      heading: "Payments",
      paragraphs: [
         "Payments are processed by Stripe. When you pay, you are handled by Stripe's checkout and your card details go to Stripe directly. We receive the payment result so we can mark your booking as paid. Stripe's own privacy policy applies to the information it handles.",
      ],
   },
   {
      heading: "Who can see your information",
      list: [
         "Technicians see the name, date and note of customers who book them.",
         "Customers see a technician's public profile, services and reviews.",
         "Reviews show the reviewer's name next to the rating and comment.",
         "Administrators can see accounts, bookings and contact messages in order to run the platform.",
      ],
      paragraphs: ["We do not sell your personal information."],
   },
   {
      heading: "Keeping your information safe",
      paragraphs: [
         "Passwords are hashed, sign-in cookies are HTTP-only, and payments are handled by Stripe. No online service is completely risk-free, so please choose a strong, unique password and log out on shared devices.",
      ],
   },
   {
      heading: "Your choices",
      list: [
         "Update your name and password from your profile page at any time.",
         "Log out to remove your sign-in cookies from the browser.",
         "To ask for your account or messages to be corrected or removed, send us a message through the contact form.",
      ],
   },
   {
      heading: "Changes to this policy",
      paragraphs: [
         "If we change how we handle information, we will update this page and the date at the top.",
      ],
   },
];

export default function PrivacyPage() {
   return (
      <LegalPage
         eyebrow="Legal"
         title="Privacy Policy"
         description="What we collect, why we collect it, and the choices you have."
         updated="29 October 2026"
         sections={SECTIONS}
      />
   );
}
