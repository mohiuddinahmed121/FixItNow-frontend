"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useCategories } from "@/hooks/use-categories";
import { useService, useUpdateService } from "@/hooks/use-services";

export default function EditServicePage() {
   const params = useParams();
   const router = useRouter();

   const serviceId = params.serviceId as string;

   const {
      data: serviceData,
      isLoading: serviceLoading,
      isError: serviceError,
   } = useService(serviceId);

   const { data: categoryData, isLoading: categoriesLoading } = useCategories();

   const updateService = useUpdateService();

   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [categoryId, setCategoryId] = useState("");

   const service = serviceData?.data;
   const categories = categoryData?.data ?? [];

   useEffect(() => {
      if (!service) return;

      setTitle(service.title);
      setDescription(service.description);
      setPrice(String(service.price));
      setCategoryId(service.category.id);
   }, [service]);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title || !description || !price || !categoryId) {
         return;
      }

      updateService.mutate(
         {
            serviceId,
            payload: {
               title,
               description,
               price: Number(price),
               categoryId,
            },
         },
         {
            onSuccess: () => {
               router.push("/technician-dashboard/services");
            },
         },
      );
   };

   if (serviceLoading) {
      return (
         <div className="p-6">
            <p className="text-muted-foreground">Loading service...</p>
         </div>
      );
   }

   if (serviceError || !service) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <h1 className="text-xl font-semibold">Service not found</h1>

               <p className="mt-2 text-sm text-muted-foreground">We could not load this service.</p>

               <Link
                  href="/technician-dashboard/services"
                  className="mt-4 inline-block rounded-md border px-4 py-2 text-sm"
               >
                  Back to My Services
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-2xl space-y-6 p-6">
         <div>
            <Link
               href="/technician-dashboard/services"
               className="text-sm text-muted-foreground hover:underline"
            >
               ← Back to My Services
            </Link>

            <h1 className="mt-4 text-3xl font-bold">Edit Service</h1>

            <p className="mt-2 text-muted-foreground">Update your service information.</p>
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

            {updateService.isError && (
               <p className="text-sm text-red-500">
                  {updateService.error instanceof Error
                     ? updateService.error.message
                     : "Failed to update service"}
               </p>
            )}

            <div className="flex gap-3">
               <Link
                  href="/technician-dashboard/services"
                  className="rounded-md border px-4 py-2 text-sm font-medium"
               >
                  Cancel
               </Link>

               <button
                  type="submit"
                  disabled={updateService.isPending || categoriesLoading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
               >
                  {updateService.isPending ? "Updating..." : "Update Service"}
               </button>
            </div>
         </form>
      </div>
   );
}
