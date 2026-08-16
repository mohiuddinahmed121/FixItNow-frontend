"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";

export const useCategories = () => {
   return useQuery({
      queryKey: ["categories"],
      queryFn: categoryService.getAllCategories,
   });
};
