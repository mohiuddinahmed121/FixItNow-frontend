import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import QueryProvider from "@/providers/query-provider";

import AuthProvider from "@/providers/auth-provider";
// import { Navbar } from "@/components/shared/navbar";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata = {
   title: "FixItNow | Your Trusted Home Service Platform",
   description: "Book trusted home service professionals with FixItNow.",
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
         <body className="min-h-full flex flex-col">
            <QueryProvider>
               <AuthProvider>
                  <Toaster position="top-right" richColors />

                  {children}
               </AuthProvider>
            </QueryProvider>
         </body>
      </html>
   );
}
