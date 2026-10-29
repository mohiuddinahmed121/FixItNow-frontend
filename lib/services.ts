export type ServiceLite = {
   id?: string;
   name: string;
   category: string;
   price?: number | string;
};

type RawService = {
   id?: string | number;
   _id?: string;
   name?: string;
   title?: string;
   category?: string | { name?: string };
   price?: number | string;
};

let cache: ServiceLite[] = [];
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

export async function getServices(): Promise<ServiceLite[]> {
   if (cache.length > 0 && Date.now() - cachedAt < CACHE_MS) return cache;

   try {
      // TODO: adjust this endpoint to match your backend's services route
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
         signal: AbortSignal.timeout(3000),
      });
      const json: unknown = await res.json();

      const payload = json as { data?: unknown };
      const raw = Array.isArray(payload?.data) ? payload.data : json;
      const list: RawService[] = Array.isArray(raw) ? raw : [];

      cache = list.map((s) => {
         const id = s.id ?? s._id;
         const category =
            typeof s.category === "string" ? s.category : (s.category?.name ?? "General");
         return {
            id: id !== undefined ? String(id) : undefined,
            name: s.name ?? s.title ?? "Service",
            category,
            price: s.price,
         };
      });
      cachedAt = Date.now();
      return cache;
   } catch {
      return cache;
   }
}
