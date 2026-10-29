import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";
import { BlogExplorer } from "./_components/blog-explorer";

export const metadata: Metadata = {
   title: "Blog | FixItNow",
   description:
      "Practical home maintenance advice for wiring, plumbing, cooling, painting and more.",
};

export default function BlogPage() {
   return (
      <main className="flex-1">
         <PageHero
            eyebrow="FixItNow Blog"
            title="Home care advice that saves you time and money"
            description="Practical guides on electrical, plumbing, cooling, painting and booking the right technician."
         />

         <BlogExplorer />
      </main>
   );
}
