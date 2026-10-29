type PageHeroProps = {
   eyebrow?: string;
   title: string;
   description?: string;
   children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
   return (
      <section className="border-b border-border bg-linear-to-b from-accent/60 to-background">
         <div className="container-page space-y-5 py-14 text-center">
            {eyebrow && (
               <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
                  {eyebrow}
               </span>
            )}

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-5xl">
               {title}
            </h1>

            {description && (
               <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
                  {description}
               </p>
            )}

            {children}
         </div>
      </section>
   );
}
