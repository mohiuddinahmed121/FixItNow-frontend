// import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "sonner";
// import "./globals.css";

// import QueryProvider from "@/providers/query-provider";

// const geistSans = Geist({
//    variable: "--font-geist-sans",
//    subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//    variable: "--font-geist-mono",
//    subsets: ["latin"],
// });

// export const metadata = {
//    title: "FixItNow | Your Trusted Home Service Platform",
//    description: "Book trusted home service professionals with FixItNow.",
// };

// export default function RootLayout({
//    children,
// }: Readonly<{
//    children: React.ReactNode;
// }>) {
//    return (
//       <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
//          <body className="min-h-full flex flex-col">
//             <QueryProvider>
//                <Toaster position="top-right" richColors />

//                {children}
//             </QueryProvider>
//          </body>
//       </html>
//    );
// }

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import QueryProvider from "@/providers/query-provider";

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

// Runs before first paint so the saved (or system) theme is applied without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="en"
         suppressHydrationWarning
         className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
         <head>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
         </head>
         <body className="min-h-full flex flex-col">
            <QueryProvider>
               <Toaster position="top-right" richColors />

               {children}
            </QueryProvider>
         </body>
      </html>
   );
}
