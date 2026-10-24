"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
   const toggleTheme = () => {
      const isDark = document.documentElement.classList.toggle("dark");

      try {
         localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch {
         // storage can be blocked (private mode); the toggle still works for this visit
      }
   };

   return (
      <Button variant="ghost" size="icon-lg" onClick={toggleTheme} aria-label="Toggle dark mode">
         {/* Icons switch with CSS only, so there is no hydration mismatch */}
         <Sun className="hidden dark:block" />
         <Moon className="dark:hidden" />
      </Button>
   );
}
