export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export interface RegisterPayload {
   name: string;
   email: string;
   password: string;
   role: "CUSTOMER" | "TECHNICIAN";
}

export interface LoginPayload {
   email: string;
   password: string;
}

export interface User {
   id: string;
   name: string;
   email: string;
   role: UserRole;
   activeStatus: string;
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
