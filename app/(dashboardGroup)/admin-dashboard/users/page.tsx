"use client";

import { useEffect, useState } from "react";

type User = {
   id: string;
   name: string;
   email: string;
   role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
   activeStatus: "ACTIVE" | "BLOCKED";
   createdAt: string;
};

export default function UsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [updatingId, setUpdatingId] = useState<string | null>(null);

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

   useEffect(() => {
      let ignore = false;

      const loadUsers = async () => {
         try {
            const token = localStorage.getItem("fixitnow_access_token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            const result = await response.json();

            if (!ignore && result.success) {
               setUsers(result.data);
            }
         } catch (error) {
            if (!ignore) {
               console.error("Failed to fetch users:", error);
            }
         } finally {
            if (!ignore) {
               setLoading(false);
            }
         }
      };

      loadUsers();

      return () => {
         ignore = true;
      };
   }, []);

   const updateUserStatus = async (userId: string, activeStatus: "ACTIVE" | "BLOCKED") => {
      try {
         setUpdatingId(userId);

         const token = localStorage.getItem("fixitnow_access_token");

         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               activeStatus,
            }),
         });

         const result = await response.json();

         if (result.success) {
            setUsers((prevUsers) =>
               prevUsers.map((user) =>
                  user.id === userId
                     ? {
                          ...user,
                          activeStatus,
                       }
                     : user,
               ),
            );
         } else {
            console.error(result.message);
         }
      } catch (error) {
         console.error("Failed to update user status:", error);
      } finally {
         setUpdatingId(null);
      }
   };

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
                     <th className="px-4 py-3 text-left">Action</th>
                     <th className="px-4 py-3 text-left">Created</th>
                  </tr>
               </thead>

               <tbody>
                  {users.map((user) => (
                     <tr key={user.id} className="border-b">
                        <td className="px-4 py-3">{user.name}</td>

                        <td className="px-4 py-3">{user.email}</td>

                        <td className="px-4 py-3">{user.role}</td>

                        <td className="px-4 py-3">
                           <span
                              className={
                                 user.activeStatus === "ACTIVE"
                                    ? "font-medium text-green-600"
                                    : "font-medium text-red-600"
                              }
                           >
                              {user.activeStatus}
                           </span>
                        </td>

                        <td className="px-4 py-3">
                           <button
                              disabled={updatingId === user.id}
                              onClick={() =>
                                 updateUserStatus(
                                    user.id,
                                    user.activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                                 )
                              }
                              className="rounded-md border px-3 py-1 text-sm hover:bg-muted disabled:opacity-50"
                           >
                              {updatingId === user.id
                                 ? "Updating..."
                                 : user.activeStatus === "ACTIVE"
                                   ? "Block"
                                   : "Activate"}
                           </button>
                        </td>

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
