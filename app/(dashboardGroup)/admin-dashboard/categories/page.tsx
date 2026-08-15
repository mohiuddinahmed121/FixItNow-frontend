"use client";

import { createAdminCategory, getAdminCategories } from "@/services/admin";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Category = {
   id: string;
   name: string;
   description?: string | null;
   createdAt?: string;
};

const CategoriesPage = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");

   const [loading, setLoading] = useState(true);
   const [creating, setCreating] = useState(false);

   useEffect(() => {
      let ignore = false;

      const loadCategories = async () => {
         try {
            const result = await getAdminCategories();

            if (ignore) return;

            if (result.success) {
               setCategories(result.data || []);
            } else {
               toast.error(result.message || "Failed to fetch categories.");
            }
         } catch (error) {
            if (!ignore) {
               console.error("Failed to fetch categories:", error);

               toast.error("Failed to fetch categories.");
            }
         } finally {
            if (!ignore) {
               setLoading(false);
            }
         }
      };

      loadCategories();

      return () => {
         ignore = true;
      };
   }, []);

   const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedName = name.trim();
      const trimmedDescription = description.trim();

      if (!trimmedName) {
         toast.error("Category name is required.");
         return;
      }

      try {
         setCreating(true);

         const result = await createAdminCategory({
            name: trimmedName,
            description: trimmedDescription || undefined,
         });

         if (result.success) {
            setCategories((prev) => [result.data, ...prev]);

            setName("");
            setDescription("");

            toast.success(result.message || "Category created successfully.");
         } else {
            toast.error(result.message || "Failed to create category.");
         }
      } catch (error) {
         console.error("Failed to create category:", error);

         toast.error("Failed to create category.");
      } finally {
         setCreating(false);
      }
   };

   return (
      <div className="p-8">
         <div className="mb-8">
            <h1 className="text-4xl font-bold">Categories</h1>

            <p className="mt-2 text-gray-500">Manage service categories.</p>
         </div>

         <div className="mb-8 rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-semibold">Create Category</h2>

            <form onSubmit={handleCreateCategory} className="space-y-4">
               <div>
                  <label className="mb-1 block text-sm font-medium">Category Name</label>

                  <input
                     type="text"
                     value={name}
                     onChange={(event) => setName(event.target.value)}
                     placeholder="Enter category name"
                     className="w-full rounded-md border px-3 py-2 outline-none"
                     required
                  />
               </div>

               <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>

                  <textarea
                     value={description}
                     onChange={(event) => setDescription(event.target.value)}
                     placeholder="Enter category description"
                     rows={4}
                     className="w-full rounded-md border px-3 py-2 outline-none"
                  />
               </div>

               <button
                  type="submit"
                  disabled={creating}
                  className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
               >
                  {creating ? "Creating..." : "Create Category"}
               </button>
            </form>
         </div>

         <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
               <thead>
                  <tr className="border-b bg-gray-50">
                     <th className="px-5 py-4 text-left">Name</th>

                     <th className="px-5 py-4 text-left">Description</th>
                  </tr>
               </thead>

               <tbody>
                  {loading ? (
                     <tr>
                        <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                           Loading categories...
                        </td>
                     </tr>
                  ) : categories.length === 0 ? (
                     <tr>
                        <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                           No categories found.
                        </td>
                     </tr>
                  ) : (
                     categories.map((category) => (
                        <tr key={category.id} className="border-b last:border-0">
                           <td className="px-5 py-4 font-medium">{category.name}</td>

                           <td className="px-5 py-4 text-gray-600">
                              {category.description || "No description"}
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default CategoriesPage;
