"use client";

import { useMutation } from "@tanstack/react-query";
import { contactService } from "@/services/contact";

export const useSendContactMessage = () => {
   return useMutation({
      mutationFn: contactService.sendMessage,
   });
};
