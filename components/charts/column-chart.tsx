"use client";

import { useRef, useState } from "react";

import { ChartTooltip } from "./chart-tooltip";
import { formatCompact, niceScale, useElementWidth } from "./chart-utils";

type Point = { label: string; fullLabel?: string; value: number };

type ColumnChartProps = {
   data: Point[];
   seriesName: string;
   color?: string;
   integer?: boolean;
   formatTick?: (value: number) => string;
   formatValue?: (value: number) => string;
};

const HEIGHT = 240;
const MARGIN = { top: 22, right: 16, bottom: 30, left: 44 };
const MAX_BAR = 24;

export function ColumnChart({
   data,
   seriesName,
   color = "var(--chart-2)",
   integer = false,
   formatTick = formatCompact,
   formatValue = (value) => String(value),
}: ColumnChartProps) {
   const ref = useRef<HTMLDivElement>(null);
   const width = useElementWidth(ref);
   const [active, setActive] = useState<number | null>(null);

   const innerW = Math.max(width - MARGIN.left - MARGIN.right, 0);
   const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
   const { top: yMax, ticks } = niceScale(Math.max(...data.map((d) => d.value), 0), { integer });

   const band = innerW / data.length;
   const barW = Math.min(MAX_BAR, band * 0.6);
   const baseline = MARGIN.top + innerH;

   const y = (value: number) => baseline - (value / yMax) * innerH;
   const center = (i: number) => MARGIN.left + band * i + band / 2;

   // 4px rounded data end, square at the baseline
   const barPath = (i: number, value: number) => {
      const height = baseline - y(value);

      if (height <= 0) return "";

      const r = Math.min(4, barW / 2, height);
      const x0 = center(i) - barW / 2;
      const x1 = center(i) + barW / 2;
      const top = y(value);

      return `M${x0},${baseline} L${x0},${top + r} Q${x0},${top} ${x0 + r},${top} L${x1 - r},${top} Q${x1},${top} ${x1},${top + r} L${x1},${baseline} Z`;
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
               onPointerLeave={() => setActive(null)}
               onFocus={() => setActive((i) => i ?? lastIndex)}
               onBlur={() => setActive(null)}
               onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                     event.preventDefault();
                     setActive((i) => Math.min((i ?? -1) + 1, data.length - 1));
                  } else if (event.key === "ArrowLeft") {
                     event.preventDefault();
                     setActive((i) => Math.max((i ?? data.length) - 1, 0));
                  }
               }}
            >
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

               {data.map((d, i) => (
                  <g key={d.label + i}>
                     <path
                        d={barPath(i, d.value)}
                        style={{ fill: color }}
                        opacity={active === null || active === i ? 1 : 0.55}
                     />

                     <text
                        x={center(i)}
                        y={HEIGHT - 8}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[11px]"
                     >
                        {d.label}
                     </text>

                     {/* The hit area is the whole band, much larger than the bar */}
                     <rect
                        x={MARGIN.left + band * i}
                        y={MARGIN.top}
                        width={band}
                        height={innerH}
                        fill="transparent"
                        onPointerMove={() => setActive(i)}
                     />
                  </g>
               ))}

               {/* Only the latest column is labeled */}
               {data[lastIndex].value > 0 && (
                  <text
                     x={center(lastIndex)}
                     y={y(data[lastIndex].value) - 8}
                     textAnchor="middle"
                     className="fill-foreground text-xs font-semibold"
                  >
                     {formatValue(data[lastIndex].value)}
                  </text>
               )}
            </svg>
         )}

         {active !== null && width > 0 && (
            <ChartTooltip
               x={center(active)}
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
