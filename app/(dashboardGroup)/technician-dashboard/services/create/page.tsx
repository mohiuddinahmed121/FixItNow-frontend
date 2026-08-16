"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCategories } from "@/hooks/use-categories";
import { useCreateService } from "@/hooks/use-services";

export default function CreateServicePage() {
   const router = useRouter();

   const { data: categoryData, isLoading: categoriesLoading } = useCategories();
   const createService = useCreateService();

   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [categoryId, setCategoryId] = useState("");

   const categories = categoryData?.data ?? [];

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title || !description || !price || !categoryId) {
         return;
      }

      createService.mutate(
         {
            title,
            description,
            price: Number(price),
            categoryId,
         },
         {
            onSuccess: () => {
               router.push("/technician-dashboard");
            },
         },
      );
   };

   return (
      <div className="max-w-2xl space-y-6 p-6">
         <div>
            <Link
               href="/technician-dashboard"
               className="text-sm text-muted-foreground hover:underline"
            >
               ← Back to Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold">Create Service</h1>

            <p className="mt-2 text-muted-foreground">Create a new service for customers.</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-6">
            <div className="space-y-2">
               <label htmlFor="title" className="text-sm font-medium">
                  Service Title
               </label>

               <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. AC Repair"
                  className="w-full rounded-md border px-3 py-2"
                  required
               />
            </div>

            <div className="space-y-2">
               <label htmlFor="description" className="text-sm font-medium">
                  Description
               </label>

               <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your service..."
                  rows={5}
                  className="w-full rounded-md border px-3 py-2"
                  required
               />
            </div>

            <div className="space-y-2">
               <label htmlFor="price" className="text-sm font-medium">
                  Price
               </label>

               <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="1200"
                  className="w-full rounded-md border px-3 py-2"
                  required
               />
            </div>

            <div className="space-y-2">
               <label htmlFor="category" className="text-sm font-medium">
                  Category
               </label>

               <select
                  id="category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                  disabled={categoriesLoading}
                  required
               >
                  <option value="">
                     {categoriesLoading ? "Loading categories..." : "Select a category"}
                  </option>

                  {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.name}
                     </option>
                  ))}
               </select>
            </div>

            {createService.isError && (
               <p className="text-sm text-red-500">
                  {createService.error instanceof Error
                     ? createService.error.message
                     : "Failed to create service"}
               </p>
            )}

            <div className="flex gap-3">
               <Link
                  href="/technician-dashboard"
                  className="rounded-md border px-4 py-2 text-sm font-medium"
               >
                  Cancel
               </Link>

               <button
                  type="submit"
                  disabled={createService.isPending || categoriesLoading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
               >
                  {createService.isPending ? "Creating..." : "Create Service"}
               </button>
            </div>
         </form>
      </div>
   );
}
