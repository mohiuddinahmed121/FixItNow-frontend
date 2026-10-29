"use client";

import { useRef, useState } from "react";

import { ChartTooltip } from "./chart-tooltip";
import { formatCompact, niceScale, useElementWidth } from "./chart-utils";

type Point = { label: string; fullLabel?: string; value: number };

type LineChartProps = {
   data: Point[];
   seriesName: string;
   color?: string;
   integer?: boolean;
   formatTick?: (value: number) => string;
   formatValue?: (value: number) => string;
};

const HEIGHT = 240;
const MARGIN = { top: 22, right: 28, bottom: 30, left: 40 };

export function LineChart({
   data,
   seriesName,
   color = "var(--chart-1)",
   integer = true,
   formatTick = formatCompact,
   formatValue = (value) => String(value),
}: LineChartProps) {
   const ref = useRef<HTMLDivElement>(null);
   const width = useElementWidth(ref);
   const [active, setActive] = useState<number | null>(null);

   const innerW = Math.max(width - MARGIN.left - MARGIN.right, 0);
   const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
   const { top: yMax, ticks } = niceScale(Math.max(...data.map((d) => d.value), 0), { integer });

   const x = (i: number) =>
      MARGIN.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
   const y = (value: number) => MARGIN.top + innerH - (value / yMax) * innerH;

   const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
   const area = `${line} L${x(data.length - 1)},${MARGIN.top + innerH} L${x(0)},${MARGIN.top + innerH} Z`;

   const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      const px = event.clientX - box.left;

      let nearest = 0;

      data.forEach((_, i) => {
         if (Math.abs(x(i) - px) < Math.abs(x(nearest) - px)) nearest = i;
      });

      setActive(nearest);
   };

   const handleKey = (event: React.KeyboardEvent<SVGSVGElement>) => {
      if (event.key === "ArrowRight") {
         event.preventDefault();
         setActive((i) => Math.min((i ?? -1) + 1, data.length - 1));
      } else if (event.key === "ArrowLeft") {
         event.preventDefault();
         setActive((i) => Math.max((i ?? data.length) - 1, 0));
      }
   };

   const lastIndex = data.length - 1;

   return (
      <div ref={ref} className="relative w-full">
         {width > 0 && (
            <svg
               width={width}
               height={HEIGHT}
               role="img"
               tabIndex={0}
               aria-label={`${seriesName} by month. Use the left and right arrow keys to read each value.`}
               className="block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
               style={{ touchAction: "pan-y" }}
               onPointerMove={handleMove}
               onPointerLeave={() => setActive(null)}
               onFocus={() => setActive((i) => i ?? lastIndex)}
               onBlur={() => setActive(null)}
               onKeyDown={handleKey}
            >
               {/* Gridlines and y ticks */}
               {ticks.map((tick) => (
                  <g key={tick}>
                     <line
                        x1={MARGIN.left}
                        x2={width - MARGIN.right}
                        y1={y(tick)}
                        y2={y(tick)}
                        style={{ stroke: "var(--border)" }}
                        strokeWidth={1}
                     />
                     <text
                        x={MARGIN.left - 8}
                        y={y(tick)}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-[11px]"
                     >
                        {formatTick(tick)}
                     </text>
                  </g>
               ))}

               {/* X labels */}
               {data.map((d, i) => (
                  <text
                     key={d.label + i}
                     x={x(i)}
                     y={HEIGHT - 8}
                     textAnchor="middle"
                     className="fill-muted-foreground text-[11px]"
                  >
                     {d.label}
                  </text>
               ))}

               {/* Crosshair */}
               {active !== null && (
                  <line
                     x1={x(active)}
                     x2={x(active)}
                     y1={MARGIN.top}
                     y2={MARGIN.top + innerH}
                     style={{ stroke: "var(--muted-foreground)" }}
                     strokeWidth={1}
                  />
               )}

               {/* Area wash, line, markers */}
               <path d={area} style={{ fill: color }} opacity={0.1} />
               <path
                  d={line}
                  fill="none"
                  style={{ stroke: color }}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
               />

               {data.map((d, i) => (
                  <circle
                     key={d.label + i}
                     cx={x(i)}
                     cy={y(d.value)}
                     r={active === i ? 5 : 4}
                     style={{ fill: color, stroke: "var(--card)" }}
                     strokeWidth={2}
                  />
               ))}

               {/* Only the latest value is labeled; the tooltip and table carry the rest */}
               <text
                  x={x(lastIndex)}
                  y={y(data[lastIndex].value) - 12}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-semibold"
               >
                  {formatValue(data[lastIndex].value)}
               </text>
            </svg>
         )}

         {active !== null && width > 0 && (
            <ChartTooltip
               x={x(active)}
               y={y(data[active].value)}
               containerWidth={width}
               title={data[active].fullLabel ?? data[active].label}
               value={formatValue(data[active].value)}
               seriesName={seriesName}
               color={color}
            />
         )}
      </div>
   );
}
