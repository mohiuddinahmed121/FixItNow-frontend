import { NextRequest, NextResponse } from "next/server";
import { getServices, type ServiceLite } from "@/lib/services";

type Suggestion = { label: string; kind: "service" | "category" | "ai"; id?: string };

const aiCache = new Map<string, Suggestion[]>();

function localMatches(q: string, services: ServiceLite[]): Suggestion[] {
   const query = q.toLowerCase();

   const serviceHits = services
      .filter((s) => s.name.toLowerCase().includes(query))
      .sort((a, b) => {
         const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1;
         const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1;
         return aStarts - bStarts;
      })
      .slice(0, 5)
      .map<Suggestion>((s) => ({ label: s.name, kind: "service", id: s.id }));

   const categories = Array.from(new Set(services.map((s) => s.category)))
      .filter((c) => c.toLowerCase().includes(query))
      .slice(0, 2)
      .map<Suggestion>((c) => ({ label: c, kind: "category" }));

   return [...categories, ...serviceHits];
}

async function aiMatches(q: string, services: ServiceLite[]): Promise<Suggestion[]> {
   const key = process.env.GROQ_API_KEY;
   if (!key || services.length === 0) return [];

   const cacheKey = q.toLowerCase();
   const cached = aiCache.get(cacheKey);
   if (cached) return cached;

   const names = services.slice(0, 60).map((s) => s.name);

   try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
         method: "POST",
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
         body: JSON.stringify({
            model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
            messages: [
               {
                  role: "system",
                  content:
                     "You match a home-service problem to the best services. " +
                     "Reply with ONLY a JSON array of up to 3 service names copied exactly from the list. " +
                     "If nothing fits, reply []. The user may write in Bangla or English.\n" +
                     `Services: ${JSON.stringify(names)}`,
               },
               { role: "user", content: q },
            ],
            temperature: 0,
            max_tokens: 800,
            reasoning_effort: "low",
         }),
         signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) {
         console.error("Search AI error:", res.status, await res.text());
         return [];
      }

      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content ?? "";
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) return [];

      const parsed: unknown = JSON.parse(match[0]);
      if (!Array.isArray(parsed)) return [];

      const byName = new Map(services.map((s) => [s.name.toLowerCase(), s]));
      const result: Suggestion[] = [];
      for (const item of parsed) {
         if (typeof item !== "string") continue;
         const found = byName.get(item.toLowerCase());
         if (found) result.push({ label: found.name, kind: "ai", id: found.id });
      }

      if (aiCache.size > 100) aiCache.clear();
      aiCache.set(cacheKey, result);
      return result;
   } catch (err) {
      console.error("Search AI failed:", err instanceof Error ? err.name : err);
      return [];
   }
}

export async function GET(req: NextRequest) {
   const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 100);
   if (q.length < 2) return NextResponse.json({ suggestions: [] });

   const services = await getServices();
   const local = localMatches(q, services);

   // Ask AI only when instant matches are few
   let ai: Suggestion[] = [];
   if (local.length < 3 && q.length >= 4) {
      ai = await aiMatches(q, services);
   }

   const seen = new Set(local.map((s) => s.label.toLowerCase()));
   const merged = [...local, ...ai.filter((s) => !seen.has(s.label.toLowerCase()))];

   return NextResponse.json({ suggestions: merged.slice(0, 7) });
}
