import { api } from "@/lib/api";

export interface Review {
   id: string;
   rating: number;
   comment: string | null;
   createdAt: string;

   customer: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
   };
}

export interface TechnicianReviewsResponse {
   success: boolean;
   statusCode: number;
   message: string;

   data: {
      averageRating: number;
      totalReviews: number;
      reviews: Review[];
   };
}

export interface CreateReviewPayload {
   bookingId: string;
   rating: number;
   comment?: string;
}

export interface CreateReviewResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Review;
}

export const reviewService = {
   createReview: async (payload: CreateReviewPayload) => {
      return api<CreateReviewResponse>("/reviews", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },

   getTechnicianReviews: async (technicianProfileId: string) => {
      return api<TechnicianReviewsResponse>(`/reviews/technician/${technicianProfileId}`, {
         method: "GET",
      });
   },
};
