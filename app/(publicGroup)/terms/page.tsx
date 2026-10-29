import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/shared/legal-page";

export const metadata: Metadata = {
   title: "Terms of Service | FixItNow",
   description: "The rules for using FixItNow as a customer or a technician.",
};

const SECTIONS: LegalSection[] = [
   {
      heading: "About FixItNow",
      paragraphs: [
         "FixItNow is an online marketplace that connects customers with independent technicians for home repair, maintenance and installation work. By creating an account or using the site, you agree to these terms.",
      ],
   },
   {
      heading: "Accounts",
      list: [
         "You must give accurate information when you register.",
         "You choose a role when you sign up: customer or technician.",
         "You are responsible for keeping your password secure and for activity on your account.",
         "Administrators may block an account that breaks these terms or harms other users.",
      ],
   },
   {
      heading: "Technicians",
      paragraphs: [
         "Technicians are independent professionals. FixItNow does not employ them and does not carry out the work itself. Technicians are responsible for the accuracy of their profile and services, for accepting only jobs they can complete, and for the quality of their work.",
      ],
   },
   {
      heading: "Bookings",
      paragraphs: [
         "A booking begins as a request from the customer. The technician can accept or decline it. A booking moves through these statuses:",
      ],
      list: [
         "Requested: the customer has sent the request.",
         "Accepted or Declined: the technician has responded.",
         "Paid: the customer has paid for an accepted booking.",
         "In progress and Completed: the technician updates the work as it happens.",
         "Canceled: the booking was canceled before it was completed.",
      ],
   },
   {
      heading: "Payments",
      paragraphs: [
         "Payment opens only after a technician accepts a booking, and is made online through Stripe. The price shown on the service is the amount charged through the platform. Agree any extra costs, such as spare parts, with the technician before the work begins.",
      ],
   },
   {
      heading: "Reviews",
      paragraphs: [
         "Customers may review a technician after a booking is completed. Reviews must be honest and based on your own experience. We may remove content that is abusive, false or unrelated to the job.",
      ],
   },
   {
      heading: "Acceptable use",
      list: [
         "Do not use FixItNow for anything unlawful.",
         "Do not post false, misleading or abusive content.",
         "Do not attempt to access other users' accounts or interfere with the site.",
         "Do not use the contact form to send spam.",
      ],
   },
   {
      heading: "Responsibility",
      paragraphs: [
         "We work to keep FixItNow available and accurate, but the site is provided as it is and may occasionally be unavailable. Because technicians are independent, disputes about the quality or cost of work are between the customer and the technician. If something goes wrong, tell us through the contact form and we will help where we can.",
      ],
   },
   {
      heading: "Changes to these terms",
      paragraphs: [
         "We may update these terms from time to time. The date at the top shows when they last changed, and continuing to use FixItNow after a change means you accept the new terms.",
      ],
   },
];

export default function TermsPage() {
   return (
      <LegalPage
         eyebrow="Legal"
         title="Terms of Service"
         description="The rules for using FixItNow as a customer or a technician."
         updated="29 October 2026"
         sections={SECTIONS}
      />
   );
}
