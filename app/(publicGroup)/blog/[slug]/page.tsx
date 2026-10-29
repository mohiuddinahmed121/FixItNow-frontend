import { ArrowLeft, ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/shared/blog-card";
import { buttonVariants } from "@/components/ui/button";
import {
   BLOG_POSTS,
   formatPostDate,
   getPostBySlug,
   getReadingMinutes,
   getRelatedPosts,
} from "@/lib/blog-posts";

type BlogPostPageProps = {
   params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
   return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
   const { slug } = await params;
   const post = getPostBySlug(slug);

   if (!post) return { title: "Article not found | FixItNow" };

   return { title: `${post.title} | FixItNow`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
   const { slug } = await params;
   const post = getPostBySlug(slug);

   if (!post) notFound();

   const related = getRelatedPosts(post);

   return (
      <main className="flex-1">
         <article className="container-page max-w-3xl py-10">
            <Link
               href="/blog"
               className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
               <ArrowLeft className="size-4" />
               All articles
            </Link>

            <header className="mt-6 space-y-4">
               <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
                  {post.category}
               </span>

               <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
                  {post.title}
               </h1>

               <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                     <User className="size-4 text-primary" />
                     {post.author}
                  </li>
                  <li className="flex items-center gap-1.5">
                     <CalendarDays className="size-4 text-primary" />
                     {formatPostDate(post.publishedAt)}
                  </li>
                  <li className="flex items-center gap-1.5">
                     <Clock className="size-4 text-primary" />
                     {getReadingMinutes(post)} min read
                  </li>
               </ul>
            </header>

            <p className="mt-8 text-lg text-pretty text-muted-foreground">{post.intro}</p>

            <div className="mt-8 space-y-8">
               {post.sections.map((section) => (
                  <section key={section.heading} className="space-y-3">
                     <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>

                     {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph} className="leading-7 text-pretty">
                           {paragraph}
                        </p>
                     ))}

                     {section.list && (
                        <ul className="list-disc space-y-1.5 pl-6 marker:text-primary">
                           {section.list.map((item) => (
                              <li key={item} className="leading-7">
                                 {item}
                              </li>
                           ))}
                        </ul>
                     )}
                  </section>
               ))}
            </div>

            <aside className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-accent/50 p-6 sm:flex-row sm:items-center">
               <div>
                  <h2 className="font-semibold">Need help with this?</h2>
                  <p className="text-sm text-muted-foreground">
                     Find a technician on FixItNow and book in a few clicks.
                  </p>
               </div>

               <Link
                  href={`/services?search=${encodeURIComponent(post.category)}`}
                  className={buttonVariants({ size: "lg", className: "h-10 shrink-0 px-4" })}
               >
                  Browse services
                  <ArrowRight />
               </Link>
            </aside>
         </article>

         {related.length > 0 && (
            <section className="border-t border-border bg-muted/40">
               <div className="container-page py-12">
                  <h2 className="mb-6 text-2xl font-bold tracking-tight">Keep reading</h2>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {related.map((item) => (
                        <BlogCard key={item.slug} post={item} />
                     ))}
                  </div>
               </div>
            </section>
         )}
      </main>
   );
}
