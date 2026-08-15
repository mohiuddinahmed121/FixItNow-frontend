"use client";

import { getAdminUsers, updateAdminUserStatus } from "@/services/admin";
import { useEffect, useState } from "react";

type User = {
   id: string;
   name: string;
   email: string;
   role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
   activeStatus: "ACTIVE" | "BLOCKED";
};

const UsersPage = () => {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [updatingId, setUpdatingId] = useState<string | null>(null);

   const fetchUsers = async () => {
      try {
         setLoading(true);

         const result = await getAdminUsers();

         if (result.success) {
            setUsers(result.data || []);
         } else {
            console.error("Failed to fetch users:", result.message);
         }
      } catch (error) {
         console.error("Failed to fetch users:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, []);

   const updateUserStatus = async (userId: string, activeStatus: "ACTIVE" | "BLOCKED") => {
      try {
         setUpdatingId(userId);

         const result = await updateAdminUserStatus(userId, activeStatus);

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
            console.error("Failed to update user status:", result.message);
         }
      } catch (error) {
         console.error("Failed to update user status:", error);
      } finally {
         setUpdatingId(null);
      }
   };

   return (
      <div className="p-8">
         <div className="mb-8">
            <h1 className="text-4xl font-bold">Users</h1>

            <p className="mt-2 text-gray-500">Manage all registered users.</p>
         </div>

         <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
               <thead>
                  <tr className="border-b bg-gray-50">
                     <th className="px-5 py-4 text-left">Name</th>

                     <th className="px-5 py-4 text-left">Email</th>

                     <th className="px-5 py-4 text-left">Role</th>

                     <th className="px-5 py-4 text-left">Status</th>

                     <th className="px-5 py-4 text-left">Action</th>
                  </tr>
               </thead>

               <tbody>
                  {loading ? (
                     <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                           Loading users...
                        </td>
                     </tr>
                  ) : users.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                           No users found.
                        </td>
                     </tr>
                  ) : (
                     users.map((user) => (
                        <tr key={user.id} className="border-b last:border-0">
                           <td className="px-5 py-4">{user.name}</td>

                           <td className="px-5 py-4">{user.email}</td>

                           <td className="px-5 py-4">{user.role}</td>

                           <td className="px-5 py-4">
                              <span
                                 className={
                                    user.activeStatus === "ACTIVE"
                                       ? "text-green-600"
                                       : "text-red-600"
                                 }
                              >
                                 {user.activeStatus}
                              </span>
                           </td>

                           <td className="px-5 py-4">
                              {user.activeStatus === "ACTIVE" ? (
                                 <button
                                    onClick={() => updateUserStatus(user.id, "BLOCKED")}
                                    disabled={updatingId === user.id}
                                    className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                                 >
                                    {updatingId === user.id ? "Updating..." : "Block"}
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => updateUserStatus(user.id, "ACTIVE")}
                                    disabled={updatingId === user.id}
                                    className="rounded bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                                 >
                                    {updatingId === user.id ? "Updating..." : "Activate"}
                                 </button>
                              )}
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

export default UsersPage;
