import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
   throw new Error("BACKEND_API_URL is not configured");
}

type RouteContext = {
   params: Promise<{
      path: string[];
   }>;
};

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;

const getBackendUrl = (path: string[]) => {
   return `${BACKEND_API_URL}/api/${path.join("/")}`;
};

const getHeaders = (request: NextRequest, accessToken?: string) => {
   const headers = new Headers();

   const contentType = request.headers.get("content-type");

   if (contentType) {
      headers.set("content-type", contentType);
   }

   const accept = request.headers.get("accept");

   if (accept) {
      headers.set("accept", accept);
   }

   if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
   }

   return headers;
};

const refreshAccessToken = async (refreshToken: string) => {
   const response = await fetch(`${BACKEND_API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
         Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
   });

   if (!response.ok) {
      return null;
   }

   const result = await response.json();

   if (!result.success || !result.data?.accessToken) {
      return null;
   }

   return result.data.accessToken as string;
};

const makeResponse = async (backendResponse: Response, newAccessToken?: string) => {
   const body = await backendResponse.arrayBuffer();

   const response = new NextResponse(body, {
      status: backendResponse.status,
      headers: {
         "Content-Type": backendResponse.headers.get("content-type") ?? "application/json",
      },
   });

   if (newAccessToken) {
      response.cookies.set("accessToken", newAccessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: ACCESS_TOKEN_MAX_AGE,
         path: "/",
      });
   }

   return response;
};

const handler = async (request: NextRequest, context: RouteContext) => {
   const { path } = await context.params;

   const cookieStore = await cookies();

   let accessToken = cookieStore.get("accessToken")?.value;
   const refreshToken = cookieStore.get("refreshToken")?.value;

   /*
    * Read the request body ONCE.
    * This allows us to reuse it if token refresh is required.
    */
   const hasBody = !["GET", "HEAD"].includes(request.method);

   const requestBody = hasBody ? await request.arrayBuffer() : undefined;

   /*
    * First request
    */
   let backendResponse = await fetch(getBackendUrl(path), {
      method: request.method,
      headers: getHeaders(request, accessToken),
      body: requestBody,
      cache: "no-store",
   });

   /*
    * Access token expired.
    * Try refresh token.
    */
   if (backendResponse.status === 401 && refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);

      if (newAccessToken) {
         accessToken = newAccessToken;

         /*
          * Retry original request using new access token.
          */
         backendResponse = await fetch(getBackendUrl(path), {
            method: request.method,
            headers: getHeaders(request, newAccessToken),
            body: requestBody,
            cache: "no-store",
         });

         return makeResponse(backendResponse, newAccessToken);
      }
   }

   /*
    * Access token and refresh token both failed.
    */
   if (backendResponse.status === 401) {
      const response = await makeResponse(backendResponse);

      response.cookies.delete("accessToken");

      return response;
   }

   return makeResponse(backendResponse);
};

export async function GET(request: NextRequest, context: RouteContext) {
   return handler(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
   return handler(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
   return handler(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
   return handler(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
   return handler(request, context);
}
