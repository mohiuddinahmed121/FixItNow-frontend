"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
   "How does booking work?",
   "Which service do I need for a leaking tap?",
   "How do I pay?",
];

export default function ChatWidget() {
   const [open, setOpen] = useState(false);
   const [input, setInput] = useState("");
   const [loading, setLoading] = useState(false);
   const [messages, setMessages] = useState<Msg[]>([
      { role: "assistant", content: "Hi! I'm the FixItNow assistant. How can I help you today?" },
   ]);
   const bottomRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages, open]);

   async function send(text: string) {
      const content = text.trim();
      if (!content || loading) return;
      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages(next);
      setInput("");
      setLoading(true);
      try {
         const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: next }),
         });
         const data = await res.json();
         setMessages([
            ...next,
            {
               role: "assistant",
               content: data.reply ?? "Sorry, something went wrong. Please try again.",
            },
         ]);
      } catch {
         setMessages([...next, { role: "assistant", content: "Network error. Please try again." }]);
      } finally {
         setLoading(false);
      }
   }

   return (
      <>
         {!open && (
            <button
               onClick={() => setOpen(true)}
               aria-label="Open chat assistant"
               className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
            >
               <MessageCircle className="h-6 w-6" />
            </button>
         )}

         {open && (
            <div className="fixed bottom-5 right-5 z-50 flex h-[32rem] max-h-[80vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border bg-background text-foreground shadow-xl">
               <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
                  <span className="font-semibold">FixItNow Assistant</span>
                  <button onClick={() => setOpen(false)} aria-label="Close chat">
                     <X className="h-5 w-5" />
                  </button>
               </div>

               <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.map((m, i) => (
                     <div
                        key={i}
                        className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                     >
                        <div
                           className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                              m.role === "user"
                                 ? "bg-primary text-primary-foreground"
                                 : "bg-muted text-foreground"
                           }`}
                        >
                           {m.content}
                        </div>
                     </div>
                  ))}
                  {loading && (
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Typing...
                     </div>
                  )}
                  {messages.length === 1 && (
                     <div className="flex flex-wrap gap-2 pt-1">
                        {QUICK_QUESTIONS.map((q) => (
                           <button
                              key={q}
                              onClick={() => send(q)}
                              className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                           >
                              {q}
                           </button>
                        ))}
                     </div>
                  )}
                  <div ref={bottomRef} />
               </div>

               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     send(input);
                  }}
                  className="flex items-center gap-2 border-t p-3"
               >
                  <input
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Ask about services or booking..."
                     className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                     type="submit"
                     disabled={loading || !input.trim()}
                     aria-label="Send message"
                     className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                  >
                     <Send className="h-4 w-4" />
                  </button>
               </form>
            </div>
         )}
      </>
   );
}
