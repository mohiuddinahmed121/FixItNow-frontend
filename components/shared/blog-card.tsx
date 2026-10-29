import { CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/shared/category-icon";
import { buttonVariants } from "@/components/ui/button";
import { formatPostDate, getReadingMinutes, type BlogPost } from "@/lib/blog-posts";

// Same size and layout rules as ServiceCard: fixed visual height, clamped text, footer pinned down.
export function BlogCard({ post }: { post: BlogPost }) {
   return (
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
         <div className="relative grid h-40 shrink-0 place-items-center bg-linear-to-br from-primary/15 via-accent to-cta/15">
            <CategoryIcon
               name={post.category}
               className="size-14 text-primary/70 transition-transform duration-300 group-hover:scale-110"
            />

            <span className="absolute top-3 left-3 max-w-[70%] truncate rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium">
               {post.category}
            </span>
         </div>

         <div className="flex flex-1 flex-col gap-3 p-4">
            <h3 className="line-clamp-2 min-h-12 text-base font-semibold">{post.title}</h3>

            <p className="line-clamp-3 min-h-15 text-sm text-muted-foreground">{post.excerpt}</p>

            <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
               <li className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-primary" />
                  {formatPostDate(post.publishedAt)}
               </li>
               <li className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  {getReadingMinutes(post)} min read
               </li>
            </ul>

            <div className="border-t border-border pt-3">
               <Link
                  href={`/blog/${post.slug}`}
                  className={buttonVariants({ size: "lg", className: "w-full" })}
               >
                  Read Article
               </Link>
            </div>
         </div>
      </article>
   );
}
