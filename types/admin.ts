export type BookingStatus =
   | "REQUESTED"
   | "ACCEPTED"
   | "DECLINED"
   | "PAID"
   | "IN_PROGRESS"
   | "COMPLETED"
   | "CANCELED";

export interface AdminUser {
   id: string;
   name: string;
   email: string;
   phone: string | null;
   role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
   activeStatus: "ACTIVE" | "BLOCKED";
   createdAt: string;
}

export interface AdminBooking {
   id: string;
   bookingDate: string;
   status: BookingStatus;
   createdAt: string;

   customer: {
      id: string;
      name: string;
      email: string;
   };

   service: {
      id: string;
      title: string;
      price: number;
      category: {
         id: string;
         name: string;
      };
      technicianProfile: {
         id: string;
         location: string;
         user: {
            name: string;
         };
      };
   };

   payment: {
      amount: number;
      status: "PENDING" | "COMPLETED" | "FAILED";
      paidAt: string | null;
      createdAt: string;
   } | null;

   review: {
      rating: number;
   } | null;
}
