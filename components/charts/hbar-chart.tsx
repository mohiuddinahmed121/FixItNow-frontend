"use client";

import { useRef, useState } from "react";

import { ChartTooltip } from "./chart-tooltip";
import { useElementWidth } from "./chart-utils";

type Row = { label: string; value: number };

type HBarChartProps = {
   data: Row[];
   seriesName: string;
   color?: string;
   formatValue?: (value: number) => string;
};

const ROW_HEIGHT = 34;
const BAR_HEIGHT = 18;
const VALUE_SPACE = 44;

export function HBarChart({
   data,
   seriesName,
   color = "var(--chart-1)",
   formatValue = (value) => String(value),
}: HBarChartProps) {
   const ref = useRef<HTMLDivElement>(null);
   const width = useElementWidth(ref);
   const [active, setActive] = useState<number | null>(null);

   const labelW = Math.min(132, Math.round(width * 0.38));
   const maxChars = Math.max(Math.floor(labelW / 7), 4);
   const trackW = Math.max(width - labelW - VALUE_SPACE, 0);
   const max = Math.max(...data.map((d) => d.value), 1);
   const height = data.length * ROW_HEIGHT + 8;

   const barLength = (value: number) => (value / max) * trackW;

   const shorten = (label: string) =>
      label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;

   return (
      <div ref={ref} className="relative w-full">
         {width > 0 && (
            <svg
               width={width}
               height={height}
               role="img"
               tabIndex={0}
               aria-label={`${seriesName}. Use the up and down arrow keys to read each value.`}
               className="block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
               onPointerLeave={() => setActive(null)}
               onFocus={() => setActive((i) => i ?? 0)}
               onBlur={() => setActive(null)}
               onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                     event.preventDefault();
                     setActive((i) => Math.min((i ?? -1) + 1, data.length - 1));
                  } else if (event.key === "ArrowUp") {
                     event.preventDefault();
                     setActive((i) => Math.max((i ?? data.length) - 1, 0));
                  }
               }}
            >
               {/* Baseline */}
               <line
                  x1={labelW}
                  x2={labelW}
                  y1={4}
                  y2={height - 4}
                  style={{ stroke: "var(--border)" }}
                  strokeWidth={1}
               />

               {data.map((row, i) => {
                  const top = 4 + i * ROW_HEIGHT;
                  const barY = top + (ROW_HEIGHT - BAR_HEIGHT) / 2;
                  const length = Math.max(barLength(row.value), row.value > 0 ? 4 : 0);
                  const r = Math.min(4, length, BAR_HEIGHT / 2);

                  // 4px rounded data end on the right, square at the left baseline
                  const path = `M${labelW},${barY} L${labelW + length - r},${barY} Q${labelW + length},${barY} ${labelW + length},${barY + r} L${labelW + length},${barY + BAR_HEIGHT - r} Q${labelW + length},${barY + BAR_HEIGHT} ${labelW + length - r},${barY + BAR_HEIGHT} L${labelW},${barY + BAR_HEIGHT} Z`;

                  return (
                     <g key={row.label}>
                        <text
                           x={labelW - 10}
                           y={top + ROW_HEIGHT / 2}
                           textAnchor="end"
                           dominantBaseline="middle"
                           className="fill-muted-foreground text-xs"
                        >
                           {shorten(row.label)}
                        </text>

                        {length > 0 && (
                           <path
                              d={path}
                              style={{ fill: color }}
                              opacity={active === null || active === i ? 1 : 0.55}
                           />
                        )}

                        <text
                           x={labelW + length + 8}
                           y={top + ROW_HEIGHT / 2}
                           dominantBaseline="middle"
                           className="fill-foreground text-xs font-semibold"
                        >
                           {formatValue(row.value)}
                        </text>

                        <rect
                           x={0}
                           y={top}
                           width={width}
                           height={ROW_HEIGHT}
                           fill="transparent"
                           onPointerMove={() => setActive(i)}
                        />
                     </g>
                  );
               })}
            </svg>
         )}

         {active !== null && width > 0 && (
            <ChartTooltip
               x={labelW + barLength(data[active].value)}
               y={4 + active * ROW_HEIGHT + ROW_HEIGHT / 2 + 30}
               containerWidth={width}
               title={data[active].label}
               value={formatValue(data[active].value)}
               seriesName={seriesName}
               color={color}
            />
         )}
      </div>
   );
}
