type ChartTooltipProps = {
   // Pointer position inside the chart container
   x: number;
   y: number;
   containerWidth: number;
   title: string;
   value: string;
   seriesName: string;
   color: string;
};

// One tooltip for every chart: value leads, series name follows, a short line key shows identity.
export function ChartTooltip({
   x,
   y,
   containerWidth,
   title,
   value,
   seriesName,
   color,
}: ChartTooltipProps) {
   const width = 168;
   const left = Math.min(Math.max(x + 14, 0), Math.max(containerWidth - width, 0));
   const top = Math.max(y - 64, 0);

   return (
      <div
         role="status"
         className="pointer-events-none absolute z-10 rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md"
         style={{ left, top, width }}
      >
         <p className="text-xs text-muted-foreground">{title}</p>

         <div className="mt-1 flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: color }} />
            <span className="text-sm font-semibold tabular-nums">{value}</span>
            <span className="truncate text-xs text-muted-foreground">{seriesName}</span>
         </div>
      </div>
   );
}
