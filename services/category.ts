import { api } from "@/lib/api";

export interface Category {
   id: string;
   name: string;
   description: string | null;
   createdAt: string;
   updatedAt: string;
}

export interface CategoriesResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Category[];
}

export const categoryService = {
   getAllCategories: async () => {
      return api<CategoriesResponse>("/categories", {
         method: "GET",
      });
   },
};
