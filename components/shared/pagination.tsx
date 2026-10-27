import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
   page: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   className?: string;
};

function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
   const pages = new Set([1, totalPages, page - 1, page, page + 1]);

   const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

   const items: (number | "ellipsis")[] = [];

   sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) items.push("ellipsis");

      items.push(p);
   });

   return items;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
   if (totalPages <= 1) return null;

   return (
      <nav
         aria-label="Pagination"
         className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}
      >
         <Button
            variant="outline"
            size="lg"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
         >
            <ChevronLeft />
            Prev
         </Button>

         {getPageItems(page, totalPages).map((item, index) =>
            item === "ellipsis" ? (
               <span key={`e${index}`} className="px-1 text-muted-foreground" aria-hidden="true">
                  &hellip;
               </span>
            ) : (
               <Button
                  key={item}
                  variant={item === page ? "default" : "outline"}
                  size="lg"
                  aria-current={item === page ? "page" : undefined}
                  aria-label={`Page ${item}`}
                  className="min-w-8"
                  onClick={() => onPageChange(item)}
               >
                  {item}
               </Button>
            ),
         )}

         <Button
            variant="outline"
            size="lg"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
         >
            Next
            <ChevronRight />
         </Button>
      </nav>
   );
}
