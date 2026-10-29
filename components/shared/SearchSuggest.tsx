"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Sparkles } from "lucide-react";

type Suggestion = { label: string; kind: "service" | "category" | "ai"; id?: string };

type Props = {
   searchPath?: string; // explore page, gets ?search=...
   detailsPath?: string; // details page base, gets /{id}
   placeholder?: string;
};

export default function SearchSuggest({
   searchPath = "/services",
   detailsPath = "/services",
   placeholder = "Search services, or describe your problem...",
}: Props) {
   const router = useRouter();
   const [query, setQuery] = useState("");
   const [rawItems, setRawItems] = useState<Suggestion[]>([]);
   const [rawLoading, setRawLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const [active, setActive] = useState(-1);
   const boxRef = useRef<HTMLDivElement>(null);

   // derived values (no setState needed when the query gets short)
   const trimmed = query.trim();
   const items = trimmed.length >= 2 ? rawItems : [];
   const loading = rawLoading && trimmed.length >= 2;
   const showList = open && trimmed.length >= 2;

   // debounced fetch
   useEffect(() => {
      if (trimmed.length < 2) return;

      const controller = new AbortController();
      const timer = setTimeout(async () => {
         setRawLoading(true);
         try {
            const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(trimmed)}`, {
               signal: controller.signal,
            });
            const data: { suggestions?: Suggestion[] } = await res.json();
            setRawItems(data.suggestions ?? []);
            setActive(-1);
         } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return;
            setRawItems([]);
         } finally {
            if (!controller.signal.aborted) setRawLoading(false);
         }
      }, 300);

      return () => {
         clearTimeout(timer);
         controller.abort();
      };
   }, [trimmed]);

   // close on outside click
   useEffect(() => {
      function onClick(e: MouseEvent) {
         if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
   }, []);

   function choose(s: Suggestion) {
      setOpen(false);
      setQuery(s.label);
      if (s.kind !== "category" && s.id) {
         router.push(`${detailsPath}/${s.id}`);
      } else {
         router.push(`${searchPath}?search=${encodeURIComponent(s.label)}`);
      }
   }

   function submit() {
      if (!trimmed) return;
      setOpen(false);
      router.push(`${searchPath}?search=${encodeURIComponent(trimmed)}`);
   }

   function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "ArrowDown") {
         e.preventDefault();
         setActive((i) => (i + 1) % Math.max(items.length, 1));
      } else if (e.key === "ArrowUp") {
         e.preventDefault();
         setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
      } else if (e.key === "Enter") {
         e.preventDefault();
         if (active >= 0 && items[active]) choose(items[active]);
         else submit();
      } else if (e.key === "Escape") {
         setOpen(false);
      }
   }

   return (
      <div ref={boxRef} className="relative w-full max-w-xl">
         <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
               value={query}
               onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
               }}
               onFocus={() => setOpen(true)}
               onKeyDown={onKeyDown}
               placeholder={placeholder}
               aria-label="Search services"
               className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
         </div>

         {showList && (
            <ul
               role="listbox"
               className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-background text-foreground shadow-lg"
            >
               {items.length === 0 && !loading && (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                     No suggestions. Press Enter to search.
                  </li>
               )}
               {items.map((s, i) => (
                  <li key={`${s.kind}-${s.label}`} role="option" aria-selected={i === active}>
                     <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => choose(s)}
                        className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted ${
                           i === active ? "bg-muted" : ""
                        }`}
                     >
                        <span className="truncate">{s.label}</span>
                        {s.kind === "ai" ? (
                           <span className="flex shrink-0 items-center gap-1 text-xs text-primary">
                              <Sparkles className="h-3 w-3" /> AI suggested
                           </span>
                        ) : (
                           <span className="shrink-0 text-xs capitalize text-muted-foreground">
                              {s.kind}
                           </span>
                        )}
                     </button>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
