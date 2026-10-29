import { useEffect, useState, type RefObject } from "react";

// Measures an element so charts can draw in real pixels (text stays readable on phones).
export function useElementWidth(ref: RefObject<HTMLElement | null>) {
   const [width, setWidth] = useState(0);

   useEffect(() => {
      const element = ref.current;

      if (!element) return;

      const observer = new ResizeObserver(([entry]) => {
         setWidth(Math.round(entry.contentRect.width));
      });

      observer.observe(element);

      return () => observer.disconnect();
   }, [ref]);

   return width;
}

// Round axis maximum and clean tick values. `integer` keeps count charts on whole numbers.
export function niceScale(max: number, { count = 4, integer = false } = {}) {
   if (max <= 0) {
      const top = integer ? count : 1;

      return { top, ticks: Array.from({ length: count + 1 }, (_, i) => (top / count) * i) };
   }

   const rough = max / count;
   const power = 10 ** Math.floor(Math.log10(rough));
   const normal = rough / power;

   let step = (normal <= 1 ? 1 : normal <= 2 ? 2 : normal <= 5 ? 5 : 10) * power;

   if (integer) step = Math.max(1, Math.ceil(step));

   const top = Math.ceil(max / step) * step;
   const ticks: number[] = [];

   for (let value = 0; value <= top + step / 1000; value += step) ticks.push(value);

   return { top, ticks };
}

export function formatCompact(value: number): string {
   const abs = Math.abs(value);

   if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
   if (abs >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;

   return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export const formatMoney = (value: number) => `$${formatCompact(value)}`;

export const formatMoneyFull = (value: number) =>
   `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
