import { NextRequest, NextResponse } from "next/server";

type Msg = { role: "user" | "assistant"; content: string };

type ServiceItem = {
   name?: string;
   title?: string;
   category?: string | { name?: string };
   price?: number | string;
};

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

const SYSTEM_PROMPT = `You are FixItNow Assistant, a helpful guide for a home service marketplace
that connects customers with technicians (plumbing, electrical, cleaning, etc.).
Help users: find the right service, understand how booking works
(Customer books -> Technician accepts -> Stripe payment -> service done -> review),
and answer FAQs. Be short and friendly. Reply in the same language as the user (Bangla or English).
If asked something unrelated to home services or this platform, politely say you can only help with FixItNow.
Only recommend services from the list below. Never invent prices.`;

function categoryName(category: ServiceItem["category"]): string {
   if (!category) return "General";
   return typeof category === "string" ? category : (category.name ?? "General");
}

async function getServicesContext(): Promise<string> {
   try {
      // TODO: adjust this endpoint to match your backend's services route
      const init: NextFetchInit = { next: { revalidate: 300 } };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, init);
      const json: unknown = await res.json();

      const payload = json as { data?: unknown };
      const raw = Array.isArray(payload?.data) ? payload.data : json;
      const list: ServiceItem[] = Array.isArray(raw) ? raw : [];

      return list
         .slice(0, 30)
         .map(
            (s) =>
               `- ${s.name ?? s.title ?? "Service"} (${categoryName(s.category)})${
                  s.price !== undefined ? ` - ${s.price}` : ""
               }`,
         )
         .join("\n");
   } catch {
      return "";
   }
}

export async function POST(req: NextRequest) {
   try {
      const { messages } = (await req.json()) as { messages: Msg[] };
      if (!Array.isArray(messages) || messages.length === 0) {
         return NextResponse.json({ error: "Messages required" }, { status: 400 });
      }

      // Gemini needs the conversation to start with a user message
      const history = messages.slice(-10);
      const firstUser = history.findIndex((m) => m.role === "user");
      const trimmed = firstUser === -1 ? [] : history.slice(firstUser);
      if (trimmed.length === 0) {
         return NextResponse.json({ error: "Messages required" }, { status: 400 });
      }

      const services = await getServicesContext();
      //const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
      const model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

      const res = await fetch(
         `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
         {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               systemInstruction: {
                  parts: [
                     {
                        text: `${SYSTEM_PROMPT}\n\nAvailable services:\n${services || "(none loaded)"}`,
                     },
                  ],
               },
               contents: trimmed.map((m) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
               })),
            }),
         },
      );

      // if (!res.ok) {
      //    return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
      // }
      if (!res.ok) {
         const errText = await res.text();
         console.error("Gemini error:", res.status, errText);
         return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
      }

      const data = await res.json();
      const reply: string =
         data?.candidates?.[0]?.content?.parts?.[0]?.text ??
         "Sorry, I couldn't process that. Please try again.";
      return NextResponse.json({ reply });
   } catch {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
   }
}
