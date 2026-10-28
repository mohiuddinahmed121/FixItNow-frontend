import { NextRequest, NextResponse } from "next/server";

type Msg = { role: "user" | "assistant"; content: string };

type ServiceItem = {
   name?: string;
   title?: string;
   category?: string | { name?: string };
   price?: number | string;
};

const SYSTEM_PROMPT = `You are FixItNow Assistant, a helpful guide for a home service marketplace
that connects customers with technicians (plumbing, electrical, cleaning, etc.).
Help users: find the right service, understand how booking works
(Customer books -> Technician accepts -> Stripe payment -> service done -> review),
and answer FAQs. Be short and friendly. Reply in the same language as the user (Bangla or English).
If asked something unrelated to home services or this platform, politely say you can only help with FixItNow.
Only recommend services from the list below. Never invent prices.`;

const FAILED_REPLY =
   "Sorry, I couldn't process that right now. Please try again in a moment, or visit our Help page.";

// Used only when every AI provider fails, so the chat never feels broken.
const FAQ_FALLBACKS: { keywords: string[]; answer: string }[] = [
   {
      keywords: ["pay", "payment", "stripe", "card", "price", "cost"],
      answer:
         "Payments are handled securely online through Stripe. You can see the price on the service page before you confirm your booking.",
   },
   {
      keywords: ["book", "booking", "order"],
      answer:
         "Booking is simple: choose a service, pick a technician, and confirm your booking. The technician accepts it, you pay securely online, and after the service is done you can leave a review.",
   },
   {
      keywords: ["technician", "become", "join", "provider"],
      answer:
         "Technicians can register with a technician account, list their services, accept bookings, and update job status from their dashboard.",
   },
   {
      keywords: ["review", "rating", "feedback"],
      answer:
         "After a service is completed, you can rate the technician and leave a review from your bookings page.",
   },
   {
      keywords: ["cancel", "refund"],
      answer:
         "For cancellations or refunds, please open your booking details or contact us from the Contact page.",
   },
];

function faqAnswer(text: string): string | null {
   const q = text.toLowerCase();
   const hit = FAQ_FALLBACKS.find((f) => f.keywords.some((k) => q.includes(k)));
   return hit ? hit.answer : null;
}

function categoryName(category: ServiceItem["category"]): string {
   if (!category) return "General";
   return typeof category === "string" ? category : (category.name ?? "General");
}

let cachedServices = "";
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

async function getServicesContext(): Promise<string> {
   if (cachedServices && Date.now() - cachedAt < CACHE_MS) return cachedServices;

   try {
      // TODO: adjust this endpoint to match your backend's services route
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
         signal: AbortSignal.timeout(3000),
      });
      const json: unknown = await res.json();

      const payload = json as { data?: unknown };
      const raw = Array.isArray(payload?.data) ? payload.data : json;
      const list: ServiceItem[] = Array.isArray(raw) ? raw : [];

      cachedServices = list
         .slice(0, 30)
         .map(
            (s) =>
               `- ${s.name ?? s.title ?? "Service"} (${categoryName(s.category)})${
                  s.price !== undefined ? ` - ${s.price}` : ""
               }`,
         )
         .join("\n");
      cachedAt = Date.now();
      return cachedServices;
   } catch {
      return cachedServices;
   }
}

// ---------- Provider 1: Groq (OpenAI-compatible) ----------
async function askGroq(system: string, messages: Msg[]): Promise<string | null> {
   const key = process.env.GROQ_API_KEY;
   if (!key) return null;

   try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
         },
         body: JSON.stringify({
            model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: system }, ...messages],
            temperature: 0.4,
            max_tokens: 500,
         }),
         signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) {
         console.error("Groq error:", res.status, await res.text());
         return null;
      }

      const data = await res.json();
      const text: unknown = data?.choices?.[0]?.message?.content;
      return typeof text === "string" && text.trim() ? text.trim() : null;
   } catch (err) {
      console.error("Groq request failed:", err instanceof Error ? err.name : err);
      return null;
   }
}

// ---------- Provider 2: Gemini (fallback) ----------
async function askGemini(system: string, messages: Msg[]): Promise<string | null> {
   const key = process.env.GEMINI_API_KEY;
   if (!key) return null;

   const model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

   try {
      const res = await fetch(
         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
         {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               systemInstruction: { parts: [{ text: system }] },
               contents: messages.map((m) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
               })),
            }),
            signal: AbortSignal.timeout(15000),
         },
      );

      if (!res.ok) {
         console.error("Gemini error:", res.status, await res.text());
         return null;
      }

      const data = await res.json();
      const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return typeof text === "string" && text.trim() ? text.trim() : null;
   } catch (err) {
      console.error("Gemini request failed:", err instanceof Error ? err.name : err);
      return null;
   }
}

export async function POST(req: NextRequest) {
   try {
      const { messages } = (await req.json()) as { messages: Msg[] };
      if (!Array.isArray(messages) || messages.length === 0) {
         return NextResponse.json({ error: "Messages required" }, { status: 400 });
      }

      // Conversation must start with a user message
      const history = messages.slice(-10);
      const firstUser = history.findIndex((m) => m.role === "user");
      const trimmed = firstUser === -1 ? [] : history.slice(firstUser);
      if (trimmed.length === 0) {
         return NextResponse.json({ error: "Messages required" }, { status: 400 });
      }

      const services = await getServicesContext();
      const system = `${SYSTEM_PROMPT}\n\nAvailable services:\n${services || "(none loaded)"}`;

      const reply =
         (await askGroq(system, trimmed)) ??
         (await askGemini(system, trimmed)) ??
         faqAnswer(trimmed[trimmed.length - 1].content) ??
         FAILED_REPLY;

      return NextResponse.json({ reply });
   } catch (err) {
      console.error("Chat route error:", err);
      return NextResponse.json({ reply: FAILED_REPLY });
   }
}
