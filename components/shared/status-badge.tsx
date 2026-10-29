import { STATUS_LABEL } from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types/admin";

const TONE: Record<BookingStatus, string> = {
   REQUESTED: "bg-muted text-muted-foreground",
   ACCEPTED: "bg-accent text-accent-foreground",
   DECLINED: "bg-destructive/10 text-destructive",
   PAID: "bg-primary/10 text-primary",
   IN_PROGRESS: "bg-accent text-accent-foreground",
   COMPLETED: "bg-success/15 text-success",
   CANCELED: "bg-destructive/10 text-destructive",
};

// Status is always written out as text, so colour is never the only signal.
export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
   return (
      <span
         className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
            TONE[status],
            className,
         )}
      >
         {STATUS_LABEL[status]}
      </span>
   );
}
