"use client";

import { useCurrentUser } from "@/hooks/use-auth";
import { createContext, useContext } from "react";

interface AuthContextType {
   user: ReturnType<typeof useCurrentUser>["data"];
   isLoading: boolean;
   isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
   const { data: user, isLoading } = useCurrentUser();

   const value: AuthContextType = {
      user,
      isLoading,
      isAuthenticated: !!user,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth must be used inside AuthProvider");
   }

   return context;
}
