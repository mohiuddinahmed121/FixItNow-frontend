import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";

export type LegalSection = {
   heading: string;
   paragraphs?: string[];
   list?: string[];
};

type LegalPageProps = {
   eyebrow: string;
   title: string;
   description: string;
   updated: string;
   sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, description, updated, sections }: LegalPageProps) {
   return (
      <main className="flex-1">
         <PageHero eyebrow={eyebrow} title={title} description={description} />

         <div className="container-page grid gap-10 py-12 lg:grid-cols-4">
            {/* Table of contents */}
            <nav aria-label="On this page" className="hidden lg:block">
               <div className="sticky top-24 space-y-3">
                  <p className="text-sm font-semibold">On this page</p>
                  <ol className="space-y-2 border-l border-border pl-4 text-sm">
                     {sections.map((section, index) => (
                        <li key={section.heading}>
                           <a
                              href={`#section-${index + 1}`}
                              className="text-muted-foreground transition-colors hover:text-primary"
                           >
                              {section.heading}
                           </a>
                        </li>
                     ))}
                  </ol>
               </div>
            </nav>

            <article className="max-w-3xl space-y-10 lg:col-span-3">
               <p className="text-sm text-muted-foreground">Last updated: {updated}</p>

               {sections.map((section, index) => (
                  <section
                     key={section.heading}
                     id={`section-${index + 1}`}
                     className="scroll-mt-24 space-y-3"
                  >
                     <h2 className="text-xl font-semibold tracking-tight">
                        {index + 1}. {section.heading}
                     </h2>

                     {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph} className="leading-7 text-pretty">
                           {paragraph}
                        </p>
                     ))}

                     {section.list && (
                        <ul className="list-disc space-y-1.5 pl-6 marker:text-primary">
                           {section.list.map((item) => (
                              <li key={item} className="leading-7">
                                 {item}
                              </li>
                           ))}
                        </ul>
                     )}
                  </section>
               ))}

               <p className="border-t border-border pt-6 text-sm text-muted-foreground">
                  Questions about this page? Reach us through the{" "}
                  <Link href="/contact" className="font-medium text-primary hover:underline">
                     contact form
                  </Link>
                  .
               </p>
            </article>
         </div>
      </main>
   );
}
