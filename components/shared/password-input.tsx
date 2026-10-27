"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = {
   id: string;
   name?: string;
   value: string;
   onChange: (value: string) => void;
   invalid?: boolean;
   describedBy?: string;
   autoComplete: string;
   placeholder?: string;
};

export function PasswordInput({
   id,
   name,
   value,
   onChange,
   invalid = false,
   describedBy,
   autoComplete,
   placeholder,
}: PasswordInputProps) {
   const [visible, setVisible] = useState(false);

   return (
      <div className="relative">
         <Input
            id={id}
            name={name}
            type={visible ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 pr-10"
         />

         <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
         >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
         </button>
      </div>
   );
}
