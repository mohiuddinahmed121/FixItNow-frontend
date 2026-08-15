"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type Category = {
   id: string;
   name: string;
   description?: string | null;
   createdAt?: string;
};

export default function CategoriesPage() {
   const [categories, setCategories] = useState<Category[]>([]);
   const [loading, setLoading] = useState(true);
   const [creating, setCreating] = useState(false);

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");

   useEffect(() => {
      let ignore = false;

      const loadCategories = async () => {
         try {
            const token = localStorage.getItem("fixitnow_access_token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            const result = await response.json();

            if (!ignore && result.success) {
               setCategories(result.data);
            }

            if (!ignore && !result.success) {
               console.error("Backend Error:", result.message);
            }
         } catch (error) {
            if (!ignore) {
               console.error("Failed to fetch categories:", error);
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

   const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!name.trim()) {
         return;
      }

      try {
         setCreating(true);

         const token = localStorage.getItem("fixitnow_access_token");

         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               name: name.trim(),
               description: description.trim() || undefined,
            }),
         });

         const result = await response.json();

         if (result.success) {
            setCategories((prev) => [result.data, ...prev]);

            setName("");
            setDescription("");

            toast.success("Category created successfully");
         } else {
            toast.error(result.message || "Failed to create category");
         }
      } catch (error) {
         console.error("Failed to create category:", error);
      } finally {
         setCreating(false);
      }
   };

   if (loading) {
      return <div className="p-6">Loading categories...</div>;
   }

   return (
      <div className="p-6">
         <h1 className="text-3xl font-bold">Categories</h1>

         <p className="mt-2 text-muted-foreground">Manage service categories.</p>

         {/* Create Category */}
         <div className="mt-6 max-w-xl rounded-lg border p-5">
            <h2 className="text-xl font-semibold">Create Category</h2>

            <form onSubmit={handleCreateCategory} className="mt-4 space-y-4">
               <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>

                  <input
                     type="text"
                     value={name}
                     onChange={(event) => setName(event.target.value)}
                     placeholder="e.g. Plumbing"
                     required
                     className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
               </div>

               <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>

                  <textarea
                     value={description}
                     onChange={(event) => setDescription(event.target.value)}
                     placeholder="Category description"
                     rows={3}
                     className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
               </div>

               <button
                  type="submit"
                  disabled={creating}
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
               >
                  {creating ? "Creating..." : "Create Category"}
               </button>
            </form>
         </div>

         {/* Categories List */}
         <div className="mt-8 overflow-x-auto rounded-lg border">
            <table className="w-full">
               <thead className="border-b bg-muted/50">
                  <tr>
                     <th className="px-4 py-3 text-left">Name</th>
                     <th className="px-4 py-3 text-left">Description</th>
                     <th className="px-4 py-3 text-left">Created</th>
                  </tr>
               </thead>

               <tbody>
                  {categories.map((category) => (
                     <tr key={category.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{category.name}</td>

                        <td className="px-4 py-3">{category.description || "—"}</td>

                        <td className="px-4 py-3">
                           {category.createdAt
                              ? new Date(category.createdAt).toLocaleDateString()
                              : "—"}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {categories.length === 0 && (
               <div className="p-6 text-center text-muted-foreground">No categories found.</div>
            )}
         </div>
      </div>
   );
}
