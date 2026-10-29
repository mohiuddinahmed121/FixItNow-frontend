import { Skeleton } from "@/components/ui/skeleton";

type ChartCardProps = {
   title: string;
   subtitle: string;
   loading?: boolean;
   // Every chart also ships its numbers as a table, so nothing depends on hovering
   table: { headers: [string, string]; rows: [string, string][] };
   children: React.ReactNode;
};

export function ChartCard({ title, subtitle, loading, table, children }: ChartCardProps) {
   return (
      <section className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
         <div className="mb-4">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
         </div>

         <div className="flex-1">
            {loading ? <Skeleton className="h-60 rounded-lg" /> : children}
         </div>

         {!loading && (
            <details className="group mt-3 text-sm">
               <summary className="cursor-pointer text-muted-foreground select-none hover:text-foreground">
                  View as table
               </summary>

               <table className="mt-2 w-full text-left">
                  <thead>
                     <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="py-1.5 font-medium">{table.headers[0]}</th>
                        <th className="py-1.5 text-right font-medium">{table.headers[1]}</th>
                     </tr>
                  </thead>
                  <tbody>
                     {table.rows.map(([label, value]) => (
                        <tr key={label} className="border-b border-border/60 last:border-0">
                           <td className="py-1.5">{label}</td>
                           <td className="py-1.5 text-right tabular-nums">{value}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </details>
         )}
      </section>
   );
}
