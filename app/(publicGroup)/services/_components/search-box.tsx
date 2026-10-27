"use client";

import { Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { buildSuggestions } from "@/lib/search";
import type { Category } from "@/services/category";
import type { Service } from "@/services/service";

type SearchBoxProps = {
   value: string;
   onChange: (value: string) => void;
   services: Service[];
   categories: Category[];
};

export function SearchBox({ value, onChange, services, categories }: SearchBoxProps) {
   const listId = useId();
   const [open, setOpen] = useState(false);
   const [active, setActive] = useState(-1);

   const suggestions = useMemo(
      () => buildSuggestions(services, categories, value),
      [services, categories, value],
   );

   const showList = open && suggestions.length > 0;

   const choose = (label: string) => {
      onChange(label);
      setOpen(false);
      setActive(-1);
   };

   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
         setOpen(false);

         return;
      }

      if (!showList) return;

      if (event.key === "ArrowDown") {
         event.preventDefault();
         setActive((i) => (i + 1) % suggestions.length);
      } else if (event.key === "ArrowUp") {
         event.preventDefault();
         setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      } else if (event.key === "Enter" && active >= 0) {
         event.preventDefault();
         choose(suggestions[active].label);
      }
   };

   return (
      <div className="relative w-full">
         <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

         <input
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label="Search services"
            autoComplete="off"
            value={value}
            placeholder="Search by service, category, skill, technician or location"
            onChange={(event) => {
               onChange(event.target.value);
               setOpen(true);
               setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={handleKeyDown}
            className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-10 text-sm shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
         />

         {value && (
            <button
               type="button"
               aria-label="Clear search"
               onMouseDown={(event) => event.preventDefault()}
               onClick={() => onChange("")}
               className="absolute top-1/2 right-3 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
               <X className="size-4" />
            </button>
         )}

         {showList && (
            <ul
               id={listId}
               role="listbox"
               className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg"
            >
               {suggestions.map((suggestion, index) => (
                  <li
                     key={`${suggestion.type}-${suggestion.label}`}
                     role="option"
                     aria-selected={index === active}
                     onMouseDown={(event) => event.preventDefault()}
                     onClick={() => choose(suggestion.label)}
                     onMouseEnter={() => setActive(index)}
                     className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                        index === active ? "bg-accent text-accent-foreground" : ""
                     }`}
                  >
                     <span className="truncate">{suggestion.label}</span>
                     <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {suggestion.type}
                     </span>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
