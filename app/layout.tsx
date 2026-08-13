import { cn } from "@/lib/utils";
import { Inter, Geist } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
   title: "FixItNow | Your Trusted Home Service Platform",
   description: "Find trusted home service professionals and book quality services with FixItNow.",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
         <body className="min-h-full flex flex-col">
            <QueryProvider>
               <Toaster position="top-right" richColors />

               {/* Navbar will be added here */}

               {children}

               {/* Footer will be added here */}
            </QueryProvider>
         </body>
      </html>
   );
}
