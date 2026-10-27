import { cn } from "@/lib/utils";

type FormFieldProps = {
   label: string;
   htmlFor: string;
   error?: string;
   hint?: string;
   className?: string;
   children: React.ReactNode;
};

export function FormField({ label, htmlFor, error, hint, className, children }: FormFieldProps) {
   return (
      <div className={cn("space-y-1.5", className)}>
         <label htmlFor={htmlFor} className="text-sm font-medium">
            {label}
         </label>

         {children}

         {error ? (
            <p id={`${htmlFor}-error`} role="alert" className="text-xs text-destructive">
               {error}
            </p>
         ) : (
            hint && <p className="text-xs text-muted-foreground">{hint}</p>
         )}
      </div>
   );
}
