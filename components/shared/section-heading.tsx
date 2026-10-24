import { cn } from "@/lib/utils";

type SectionHeadingProps = {
   eyebrow?: string;
   title: string;
   description?: string;
   align?: "left" | "center";
   className?: string;
};

export function SectionHeading({
   eyebrow,
   title,
   description,
   align = "center",
   className,
}: SectionHeadingProps) {
   return (
      <div
         className={cn(
            "mb-10 max-w-2xl space-y-3",
            align === "center" && "mx-auto text-center",
            className,
         )}
      >
         {eyebrow && (
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
               {eyebrow}
            </span>
         )}
         <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">{title}</h2>
         {description && <p className="text-muted-foreground text-pretty">{description}</p>}
      </div>
   );
}
