import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function handler(
   request: NextRequest,
   context: {
      params: Promise<{
         path: string[];
      }>;
   },
) {
   if (!BACKEND_API_URL) {
      return NextResponse.json(
         {
            success: false,
            message: "BACKEND_API_URL is not configured",
         },
         { status: 500 },
      );
   }

   const { path } = await context.params;

   const backendUrl = `${BACKEND_API_URL}/api/${path.join("/")}`;

   try {
      const headers = new Headers(request.headers);

      // Host frontend domain থেকে backend domain-এ যাবে না
      headers.delete("host");

      // Next.js internal headers দরকার নেই
      headers.delete("connection");

      const body =
         request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

      const backendResponse = await fetch(backendUrl, {
         method: request.method,
         headers,
         body,
         redirect: "manual",
         cache: "no-store",
      });

      const responseBody = await backendResponse.text();

      const responseHeaders = new Headers();

      const contentType = backendResponse.headers.get("content-type");

      if (contentType) {
         responseHeaders.set("content-type", contentType);
      }

      return new NextResponse(responseBody, {
         status: backendResponse.status,
         headers: responseHeaders,
      });
   } catch (error) {
      console.error("API Proxy Error:", error);

      return NextResponse.json(
         {
            success: false,
            message: "Unable to connect to backend server",
         },
         { status: 502 },
      );
   }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
