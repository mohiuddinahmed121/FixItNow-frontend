export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export interface User {
   id: string;
   name: string;
   email: string;
   role: UserRole;
   activeStatus?: "ACTIVE" | "BLOCKED";
   createdAt?: string;
   updatedAt?: string;
}

export interface LoginPayload {
   email: string;
   password: string;
}

export interface RegisterPayload {
   name: string;
   email: string;
   password: string;
   role: "CUSTOMER" | "TECHNICIAN";
}

export interface AuthResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: {
      accessToken: string;
      user: User;
   };
}

export interface MeResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: User;
}
