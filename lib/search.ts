import type { Category } from "@/services/category";
import type { Service } from "@/services/service";

export type Suggestion = {
   label: string;
   type: "Service" | "Category" | "Skill" | "Location";
};

const normalize = (value: string) => value.toLowerCase().trim();

// Edit distance, used so a small typo like "plumbng" still finds "plumbing".
function editDistance(a: string, b: string): number {
   const row = Array.from({ length: b.length + 1 }, (_, i) => i);

   for (let i = 1; i <= a.length; i++) {
      let previous = row[0];

      row[0] = i;

      for (let j = 1; j <= b.length; j++) {
         const current = row[j];

         row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));

         previous = current;
      }
   }

   return row[b.length];
}

function tokenMatches(token: string, text: string): boolean {
   if (text.includes(token)) return true;

   if (token.length < 4) return false;

   return text
      .split(/[^a-z0-9]+/)
      .some((word) => word.length >= 4 && editDistance(token, word) <= 1);
}

export function serviceSearchText(service: Service): string {
   const tech = service.technicianProfile;

   return normalize(
      [
         service.title,
         service.description,
         service.category.name,
         tech.user.name,
         tech.location,
         tech.skills.join(" "),
      ].join(" "),
   );
}

// Every word the user typed must match somewhere in the service (typos allowed).
export function matchesSearch(service: Service, query: string): boolean {
   const tokens = normalize(query).split(/\s+/).filter(Boolean);

   if (tokens.length === 0) return true;

   const text = serviceSearchText(service);

   return tokens.every((token) => tokenMatches(token, text));
}

function scoreCandidate(label: string, query: string): number {
   const value = normalize(label);

   if (value === query) return 5;
   if (value.startsWith(query)) return 4;
   if (value.split(/\s+/).some((word) => word.startsWith(query))) return 3;
   if (value.includes(query)) return 2;
   if (query.length >= 4 && tokenMatches(query, value)) return 1;

   return 0;
}

// Suggestions come only from real data: service titles, categories, skills and locations.
export function buildSuggestions(
   services: Service[],
   categories: Category[],
   query: string,
   limit = 6,
): Suggestion[] {
   const q = normalize(query);

   if (q.length < 2) return [];

   const candidates = new Map<string, Suggestion>();

   const add = (label: string, type: Suggestion["type"]) => {
      const key = normalize(label);

      if (key && !candidates.has(key)) candidates.set(key, { label, type });
   };

   categories.forEach((category) => add(category.name, "Category"));

   services.forEach((service) => {
      add(service.title, "Service");
      add(service.technicianProfile.location, "Location");
      service.technicianProfile.skills.forEach((skill) => add(skill, "Skill"));
   });

   return [...candidates.values()]
      .map((candidate) => ({ candidate, score: scoreCandidate(candidate.label, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.candidate.label.length - b.candidate.label.length)
      .slice(0, limit)
      .map(({ candidate }) => candidate);
}
