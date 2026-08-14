"use client";

import { useEffect, useState } from "react";

type User = {
   id: string;
   name: string;
   email: string;
   role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
   activeStatus: "ACTIVE" | "INACTIVE";
   createdAt: string;
};

export default function UsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const token = localStorage.getItem("fixitnow_access_token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            const result = await response.json();

            if (result.success) {
               setUsers(result.data);
            }
         } catch (error) {
            console.error("Failed to fetch users:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchUsers();
   }, []);

   if (loading) {
      return <div className="p-6">Loading users...</div>;
   }

   return (
      <div className="p-6">
         <h1 className="text-3xl font-bold">Users</h1>

         <p className="mt-2 text-muted-foreground">Manage all registered users.</p>

         <div className="mt-6 overflow-x-auto rounded-lg border">
            <table className="w-full">
               <thead className="border-b bg-muted/50">
                  <tr>
                     <th className="px-4 py-3 text-left">Name</th>
                     <th className="px-4 py-3 text-left">Email</th>
                     <th className="px-4 py-3 text-left">Role</th>
                     <th className="px-4 py-3 text-left">Status</th>
                     <th className="px-4 py-3 text-left">Created</th>
                  </tr>
               </thead>

               <tbody>
                  {users.map((user) => (
                     <tr key={user.id} className="border-b">
                        <td className="px-4 py-3">{user.name}</td>

                        <td className="px-4 py-3">{user.email}</td>

                        <td className="px-4 py-3">{user.role}</td>

                        <td className="px-4 py-3">{user.activeStatus}</td>

                        <td className="px-4 py-3">
                           {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {users.length === 0 && (
               <div className="p-6 text-center text-muted-foreground">No users found.</div>
            )}
         </div>
      </div>
   );
}
