type ApiOptions = RequestInit & {
   token?: string;
};

export const api = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
   const { token, headers, ...restOptions } = options;

   const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

   const response = await fetch(`/api${normalizedEndpoint}`, {
      ...restOptions,
      credentials: "include",
      headers: {
         "Content-Type": "application/json",

         ...(token
            ? {
                 Authorization: `Bearer ${token}`,
              }
            : {}),

         ...headers,
      },
   });

   const contentType = response.headers.get("content-type");

   const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.message ? data.message : "Something went wrong";

      throw new Error(message);
   }

   return data as T;
};
