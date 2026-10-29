"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendContactMessage } from "@/hooks/use-contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 2000;

type Errors = { name?: string; email?: string; subject?: string; message?: string };

const textareaClass =
   "min-h-36 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30";

export function ContactForm() {
   const send = useSendContactMessage();

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [subject, setSubject] = useState("");
   const [message, setMessage] = useState("");
   const [website, setWebsite] = useState("");
   const [errors, setErrors] = useState<Errors>({});
   const [sent, setSent] = useState(false);

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const found: Errors = {};

      if (name.trim().length < 2) found.name = "Name must be at least 2 characters.";

      if (!email.trim()) found.email = "Enter your email address.";
      else if (!EMAIL_PATTERN.test(email.trim())) found.email = "Enter a valid email address.";

      if (subject.trim().length < 3) found.subject = "Subject must be at least 3 characters.";

      if (message.trim().length < 10) found.message = "Message must be at least 10 characters.";
      else if (message.length > MAX_MESSAGE)
         found.message = `Keep your message under ${MAX_MESSAGE} characters.`;

      setErrors(found);

      if (Object.keys(found).length > 0) return;

      send.mutate(
         {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            website,
         },
         {
            onSuccess: () => {
               setSent(true);
               setName("");
               setEmail("");
               setSubject("");
               setMessage("");
            },
            onError: (error) =>
               toast.error(
                  error instanceof Error ? error.message : "We could not send your message.",
               ),
         },
      );
   };

   if (sent) {
      return (
         <div className="flex h-full flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-success text-success-foreground">
               <CheckCircle2 className="size-7" />
            </span>

            <div className="space-y-1">
               <h2 className="text-xl font-semibold">Message sent</h2>
               <p className="text-sm text-muted-foreground">
                  Thank you for contacting us. We have received your message.
               </p>
            </div>

            <Button variant="outline" size="lg" onClick={() => setSent(false)}>
               Send another message
            </Button>
         </div>
      );
   }

   return (
      <form
         onSubmit={handleSubmit}
         noValidate
         className="space-y-5 rounded-xl border border-border bg-card p-6"
      >
         <div>
            <h2 className="text-xl font-semibold">Send us a message</h2>
            <p className="text-sm text-muted-foreground">
               Questions about a booking, a technician or your account? Write to us.
            </p>
         </div>

         <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Your name" htmlFor="contact-name" error={errors.name}>
               <Input
                  id="contact-name"
                  value={name}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  onChange={(event) => setName(event.target.value)}
                  className="h-10"
               />
            </FormField>

            <FormField label="Email" htmlFor="contact-email" error={errors.email}>
               <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10"
               />
            </FormField>
         </div>

         <FormField label="Subject" htmlFor="contact-subject" error={errors.subject}>
            <Input
               id="contact-subject"
               value={subject}
               aria-invalid={!!errors.subject}
               aria-describedby={errors.subject ? "contact-subject-error" : undefined}
               onChange={(event) => setSubject(event.target.value)}
               className="h-10"
            />
         </FormField>

         <FormField
            label="Message"
            htmlFor="contact-message"
            error={errors.message}
            hint={`${message.length}/${MAX_MESSAGE} characters`}
         >
            <textarea
               id="contact-message"
               value={message}
               aria-invalid={!!errors.message}
               aria-describedby={errors.message ? "contact-message-error" : undefined}
               onChange={(event) => setMessage(event.target.value)}
               className={textareaClass}
            />
         </FormField>

         {/* Honeypot field: hidden from people, filled in by simple bots */}
         <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
               Website
               <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
               />
            </label>
         </div>

         <Button type="submit" size="lg" className="h-10 px-5" disabled={send.isPending}>
            {send.isPending ? <Loader2 className="animate-spin" /> : <Send />}
            {send.isPending ? "Sending..." : "Send message"}
         </Button>
      </form>
   );
}
