"use client";

import { RotateCcw, Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { BlogCard } from "@/components/shared/blog-card";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blog-posts";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export function BlogExplorer() {
   const [search, setSearch] = useState("");
   const [category, setCategory] = useState("");
   const [page, setPage] = useState(1);

   const filtered = useMemo(() => {
      const query = search.trim().toLowerCase();

      return BLOG_POSTS.filter((post) => {
         if (category && post.category !== category) return false;

         if (!query) return true;

         return `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query);
      }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
   }, [search, category]);

   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
   const current = Math.min(page, totalPages);
   const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

   const reset = () => {
      setSearch("");
      setCategory("");
      setPage(1);
   };

   return (
      <section className="container-page space-y-8 py-10">
         <div className="space-y-4">
            <div className="relative mx-auto max-w-xl">
               <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
               <input
                  type="search"
                  aria-label="Search articles"
                  placeholder="Search articles"
                  value={search}
                  onChange={(event) => {
                     setSearch(event.target.value);
                     setPage(1);
                  }}
                  className="h-11 w-full rounded-xl border border-input bg-card pr-4 pl-10 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
               />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
               {["", ...BLOG_CATEGORIES].map((name) => (
                  <button
                     key={name || "all"}
                     type="button"
                     aria-pressed={category === name}
                     onClick={() => {
                        setCategory(name);
                        setPage(1);
                     }}
                     className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition-colors",
                        category === name
                           ? "border-primary bg-primary text-primary-foreground"
                           : "border-border bg-card hover:border-primary hover:text-primary",
                     )}
                  >
                     {name || "All"}
                  </button>
               ))}
            </div>
         </div>

         {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-12 text-center">
               <SearchX className="size-10 text-muted-foreground" />
               <h2 className="text-lg font-semibold">No articles found</h2>
               <p className="max-w-sm text-sm text-muted-foreground">
                  Try a different search word or choose another category.
               </p>
               <Button variant="outline" size="lg" onClick={reset}>
                  <RotateCcw />
                  Reset
               </Button>
            </div>
         ) : (
            <>
               <p className="text-sm text-muted-foreground" aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? "article" : "articles"}
               </p>

               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((post) => (
                     <BlogCard key={post.slug} post={post} />
                  ))}
               </div>

               <Pagination page={current} totalPages={totalPages} onPageChange={setPage} />
            </>
         )}
      </section>
   );
}
