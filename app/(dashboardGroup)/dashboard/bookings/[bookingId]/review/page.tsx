"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCreateReview } from "@/hooks/use-reviews";

export default function ReviewPage() {
   const router = useRouter();
   const params = useParams();

   const bookingId = params.bookingId as string;

   const createReview = useCreateReview();

   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!rating) {
         return;
      }

      createReview.mutate(
         {
            bookingId,
            rating,
            comment: comment.trim() || undefined,
         },
         {
            onSuccess: () => {
               router.push("/dashboard/bookings");
            },
         },
      );
   };

   return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
         <div className="w-full max-w-lg rounded-lg border p-6 shadow-sm">
            <div>
               <h1 className="text-2xl font-bold">Write a Review</h1>

               <p className="mt-2 text-sm text-muted-foreground">
                  Share your experience with this service.
               </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
               <div>
                  <label className="text-sm font-medium">Rating</label>

                  <div className="mt-3 flex gap-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <button
                           key={star}
                           type="button"
                           onClick={() => setRating(star)}
                           className={`text-3xl transition ${
                              star <= rating ? "text-yellow-400" : "text-gray-300"
                           }`}
                        >
                           ★
                        </button>
                     ))}
                  </div>

                  {rating > 0 && (
                     <p className="mt-2 text-sm text-muted-foreground">
                        You selected {rating} out of 5
                     </p>
                  )}
               </div>

               <div>
                  <label htmlFor="comment" className="text-sm font-medium">
                     Comment
                  </label>

                  <textarea
                     id="comment"
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     placeholder="Tell us about your experience..."
                     rows={5}
                     className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
               </div>

               {createReview.isError && (
                  <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                     {createReview.error instanceof Error
                        ? createReview.error.message
                        : "Failed to submit review"}
                  </div>
               )}

               {rating === 0 && (
                  <p className="text-sm text-red-500">Please select a rating before submitting.</p>
               )}

               <div className="flex gap-3">
                  <button
                     type="button"
                     onClick={() => router.back()}
                     className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                     Cancel
                  </button>

                  <button
                     type="submit"
                     disabled={rating === 0 || createReview.isPending}
                     className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {createReview.isPending ? "Submitting..." : "Submit Review"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
