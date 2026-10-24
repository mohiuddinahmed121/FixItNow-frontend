import {
   Bug,
   Droplets,
   Hammer,
   Paintbrush,
   Snowflake,
   SprayCan,
   Tv,
   Wrench,
   Zap,
   type LucideIcon,
} from "lucide-react";

// Picks an icon from the real category name coming from the backend.
const ICON_RULES: [RegExp, LucideIcon][] = [
   [/plumb|pipe|water|leak/i, Droplets],
   [/electr|wiring|light|power/i, Zap],
   [/clean|maid|sanit|wash/i, SprayCan],
   [/paint|color|wall/i, Paintbrush],
   [/\bac\b|air|cool|hvac|refriger|fridge/i, Snowflake],
   [/carpent|wood|furnit|door|window/i, Hammer],
   [/pest|termite|insect/i, Bug],
   [/appliance|tv|electronic|repair/i, Tv],
];

export function getCategoryIcon(name: string): LucideIcon {
   return ICON_RULES.find(([pattern]) => pattern.test(name))?.[1] ?? Wrench;
}
