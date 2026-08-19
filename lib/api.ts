type ApiOptions = RequestInit & {
   token?: string;
};

export const api = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
   const { token, headers, ...restOptions } = options;

   const response = await fetch(`/api${endpoint}`, {
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

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
   }

   return data;
};
