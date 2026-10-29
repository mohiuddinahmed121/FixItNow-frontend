export type BlogSection = {
   heading: string;
   paragraphs?: string[];
   list?: string[];
};

export type BlogPost = {
   slug: string;
   title: string;
   excerpt: string;
   category: string;
   publishedAt: string;
   author: string;
   intro: string;
   sections: BlogSection[];
};

const AUTHOR = "FixItNow Team";

export const BLOG_POSTS: BlogPost[] = [
   {
      slug: "signs-your-home-wiring-needs-a-professional",
      title: "7 Signs Your Home Wiring Needs a Professional",
      excerpt:
         "Tripping breakers, warm outlets and flickering lights are more than annoyances. Here is what they can mean and when to call an electrician.",
      category: "Electrical",
      publishedAt: "2026-10-05",
      author: AUTHOR,
      intro: "Most electrical problems start small. A light that flickers or a plug that feels warm is easy to ignore, but these are often early signs of a loose connection or an overloaded circuit. Knowing what to look for helps you act before a small fault becomes a safety risk.",
      sections: [
         {
            heading: "Warning signs you should not ignore",
            list: [
               "A circuit breaker that trips again and again",
               "A burning or hot-plastic smell near outlets or the switchboard",
               "Outlets or switch plates that feel warm to the touch",
               "Lights that flicker or dim when an appliance starts",
               "Buzzing, crackling or sizzling sounds from walls or outlets",
               "Scorch marks or discoloured sockets",
               "Outlets that feel loose or no longer hold a plug firmly",
            ],
         },
         {
            heading: "Why these problems happen",
            paragraphs: [
               "Heat is the common thread. A loose connection or damaged wire resists the flow of current, and that resistance turns into heat. Over time the heat can damage insulation around the wire.",
               "Older homes can also have wiring that was never designed for today's loads. An air conditioner, a water heater and a microwave running on the same circuit can ask for more than it was built to carry.",
            ],
         },
         {
            heading: "What you can safely do yourself",
            list: [
               "Unplug devices from an outlet that feels warm and stop using it",
               "Spread heavy appliances across different outlets and circuits",
               "Avoid plugging extension cords into other extension cords",
               "Use bulbs with the wattage printed on the fitting",
               "Label your breakers so you can switch off the right circuit quickly",
            ],
         },
         {
            heading: "What to leave to a professional",
            paragraphs: [
               "Work inside the switchboard, replacing wiring and adding new circuits should always be done by a qualified electrician. If you smell burning or see sparks, switch off the power at the main and call a professional straight away.",
            ],
         },
         {
            heading: "What to tell the electrician",
            paragraphs: [
               "A clear description saves time. Say which outlet or switch is affected, when the problem happens, and which appliances were running at the time. Photos of scorch marks or damaged fittings also help.",
            ],
         },
      ],
   },
   {
      slug: "stop-small-leaks-becoming-big-repairs",
      title: "Five Habits That Stop Small Leaks Becoming Big Repairs",
      excerpt:
         "A dripping tap or a damp cabinet rarely fixes itself. These five simple checks help you catch leaks early and keep repair costs down.",
      category: "Plumbing",
      publishedAt: "2026-10-08",
      author: AUTHOR,
      intro: "Water damage is slow and expensive. A small leak can soften a cabinet, stain a wall and raise your water bill for months before anyone notices. The good news is that a few quick habits will catch most leaks early.",
      sections: [
         {
            heading: "1. Know where your main shut-off valve is",
            paragraphs: [
               "If a pipe bursts, the first job is to stop the water. Find the main shut-off valve now, make sure everyone at home knows where it is, and check that it turns freely.",
            ],
         },
         {
            heading: "2. Run a simple water meter check",
            paragraphs: [
               "Turn off every tap and appliance that uses water, then note the reading on your water meter. Wait an hour or two without using any water and read it again. If the number has moved, water is going somewhere, which points to a hidden leak.",
            ],
         },
         {
            heading: "3. Test the toilet with food colouring",
            paragraphs: [
               "Put a few drops of food colouring in the toilet tank and do not flush. If colour shows up in the bowl after about 15 minutes, the flapper is leaking. It is one of the most common causes of wasted water and is usually a quick repair.",
            ],
         },
         {
            heading: "4. Look under sinks and around fixtures monthly",
            paragraphs: [
               "Open the cabinet under each sink and check the pipes and joints. Look for dampness, water stains, corrosion and a cabinet floor that feels soft. Check around the base of toilets and behind washing machines too.",
            ],
         },
         {
            heading: "5. Fix drips and slow drains early",
            paragraphs: [
               "A dripping tap usually needs only a worn washer or cartridge replaced. A slow drain is a warning that something is building up inside the pipe. A drain strainer keeps hair and food out, and harsh chemical cleaners should be used sparingly because they can be hard on older pipes.",
            ],
         },
         {
            heading: "When to call a plumber",
            list: [
               "Damp patches or peeling paint on walls and ceilings",
               "A musty smell you cannot trace",
               "A water bill that rises without a change in use",
               "Water pressure that drops suddenly",
               "A meter that keeps moving when all taps are off",
            ],
         },
      ],
   },
   {
      slug: "what-an-ac-service-covers",
      title: "What an AC Service Covers and When You Need One",
      excerpt:
         "Weak cooling, water drips and strange noises all point to a service. Learn what a proper AC service includes and why 'gas refilling' is not the whole story.",
      category: "AC Repair",
      publishedAt: "2026-10-12",
      author: AUTHOR,
      intro: "An air conditioner works hard in hot weather, and dust builds up quickly inside it. A regular service keeps it cooling well, protects the compressor and often lowers your electricity use. Here is how to tell when yours needs attention.",
      sections: [
         {
            heading: "How often should you service it?",
            paragraphs: [
               "A good rule is a full service at least once a year, ideally just before the hot season starts. Filters need more frequent care. In heavy use they may need cleaning every few weeks, so check your unit's manual for the recommended interval.",
            ],
         },
         {
            heading: "Signs your AC needs attention",
            list: [
               "Cooling is weaker than it used to be",
               "Ice forms on the pipes or the indoor unit",
               "Water drips from the indoor unit",
               "Unusual rattling, buzzing or grinding noises",
               "A bad smell when the unit starts",
               "The unit switches on and off frequently",
               "Your electricity bill has gone up without a change in use",
            ],
         },
         {
            heading: "What a proper service includes",
            list: [
               "Cleaning or replacing the filters",
               "Cleaning the indoor coil and the outdoor unit",
               "Checking and clearing the drain line",
               "Checking fan motors and electrical connections",
               "Measuring the temperature drop and refrigerant pressure",
               "Testing the thermostat or remote control",
            ],
         },
         {
            heading: "A note on gas refilling",
            paragraphs: [
               "The refrigerant in an air conditioner runs in a sealed system and does not get used up. If the level is low, there is a leak somewhere. Topping up the gas without finding and fixing the leak only helps for a short time, so ask your technician to locate the leak.",
            ],
         },
         {
            heading: "Keep it running well between services",
            list: [
               "Clear leaves and debris from around the outdoor unit",
               "Keep doors and windows closed while the AC runs",
               "Clean the filters regularly",
               "Avoid setting the temperature far lower than you need",
            ],
         },
      ],
   },
   {
      slug: "checklist-before-booking-a-technician",
      title: "A Checklist Before You Book a Home Service Technician",
      excerpt:
         "A few minutes of preparation helps you pick the right technician, avoid surprises and get the job done right the first time.",
      category: "Booking Tips",
      publishedAt: "2026-10-15",
      author: AUTHOR,
      intro: "Hiring someone to work in your home is easier when you know what to ask. This short checklist covers what to prepare, what to compare and what to confirm before the technician arrives.",
      sections: [
         {
            heading: "Describe the problem clearly",
            paragraphs: [
               "Write down what is wrong, where it is and when it started. A couple of photos help a technician understand the job and bring the right tools. The more precise you are, the less time is lost on the first visit.",
            ],
         },
         {
            heading: "Compare more than the price",
            list: [
               "Years of experience in the type of work you need",
               "Reviews from customers who completed a booking",
               "Whether the technician is available on your date",
               "Location, so travel time is reasonable",
               "The service price and the hourly rate",
            ],
         },
         {
            heading: "Confirm the details before the visit",
            paragraphs: [
               "Check the date and time, what the price includes, and whether materials or spare parts are charged separately. Agreeing on this up front prevents disagreements later.",
            ],
         },
         {
            heading: "Book and pay through the platform",
            paragraphs: [
               "On FixItNow you send a booking request, the technician accepts it, and you then pay securely online through Stripe. Every step is recorded in your dashboard, so you always know the status of your booking.",
            ],
         },
         {
            heading: "After the job",
            paragraphs: [
               "Check the finished work while the technician is still there. Once you are happy, leave a review. Honest reviews help other customers choose and help good technicians get noticed.",
            ],
         },
      ],
   },
   {
      slug: "prepare-your-home-for-a-painting-job",
      title: "How to Prepare Your Home for a Painting Job",
      excerpt:
         "Good preparation is half of a good paint finish. Here is what to do before the painters arrive and what to agree on in advance.",
      category: "Painting",
      publishedAt: "2026-10-18",
      author: AUTHOR,
      intro: "Fresh paint can change how a room feels, but the result depends heavily on what happens before the first coat. A little preparation from you makes the work faster and the finish cleaner.",
      sections: [
         {
            heading: "Clear the space",
            paragraphs: [
               "Move small furniture and fragile items out of the room. Push larger pieces to the centre and cover them, along with the floor. Take down pictures, mirrors and curtains so the painter can reach every wall.",
            ],
         },
         {
            heading: "Fix surface problems first",
            paragraphs: [
               "Cracks, holes and peeling paint should be repaired and sanded before painting. If you see damp patches, find out what is causing the damp first. Painting over it only hides the problem for a short time and it usually comes back.",
            ],
         },
         {
            heading: "Agree the plan before work starts",
            list: [
               "Colours, tested on a small patch and viewed in both daylight and evening light",
               "The finish, such as matt, satin or gloss",
               "How many coats will be applied",
               "Who supplies the paint and materials",
               "How long the job will take",
            ],
         },
         {
            heading: "Ventilation and drying",
            paragraphs: [
               "Keep windows open while painting and while the paint dries. Allow the recommended drying time between coats, and keep children and pets out of the room until it is dry and the smell has faded.",
            ],
         },
         {
            heading: "Do a final walk-through",
            paragraphs: [
               "Before you finish the job, look at every wall in good light. Check corners, edges around switches and ceilings for missed spots or drips, and ask for them to be corrected before the final payment.",
            ],
         },
      ],
   },
   {
      slug: "get-your-home-ready-before-the-next-monsoon",
      title: "Getting Your Home Ready Before the Next Monsoon",
      excerpt:
         "Heavy rain exposes every weak point in a house. A short inspection now can prevent leaks, damp walls and electrical hazards later.",
      category: "Seasonal Care",
      publishedAt: "2026-10-22",
      author: AUTHOR,
      intro: "Monsoon rain tests a home's roof, walls, drains and wiring all at once. Problems that are easy to fix in dry weather become urgent and costly in the middle of a storm, so it pays to check early.",
      sections: [
         {
            heading: "Check the roof and ceilings",
            paragraphs: [
               "Look for stains, cracks and flaking paint on ceilings, which can show an old leak. On the roof, check the surface and the edges and joints where water tends to enter, and have any damage sealed before the rain.",
            ],
         },
         {
            heading: "Clear drains and water outlets",
            paragraphs: [
               "Clean rooftop and balcony outlets, drainage pipes and gutters. Blocked outlets cause water to pool and push it into places it should never reach.",
            ],
         },
         {
            heading: "Seal windows and exterior walls",
            paragraphs: [
               "Gaps around window frames and cracks in outer walls let water in. Damp walls lead to peeling paint and mould, so seal the gaps and consider waterproofing exposed walls.",
            ],
         },
         {
            heading: "Electrical safety in damp weather",
            list: [
               "Keep sockets, extension cords and appliances away from water",
               "Never touch switches or appliances with wet hands",
               "Have damp, sparking or crackling outlets checked by an electrician",
               "If water reaches the switchboard, switch off the main power if it is safe to do so and call a professional",
            ],
         },
         {
            heading: "Ventilate to prevent mould",
            paragraphs: [
               "Open windows on dry intervals, fix leaks quickly and keep damp clothes out of closed rooms. Mould grows where moisture stays, so dealing with the source is more effective than cleaning the surface.",
            ],
         },
         {
            heading: "Book early",
            paragraphs: [
               "It is much easier to arrange a technician before the rains than in the middle of a leak. An inspection now also gives you time to compare options instead of rushing.",
            ],
         },
      ],
   },
];

export const BLOG_CATEGORIES = [...new Set(BLOG_POSTS.map((post) => post.category))];

export function getPostBySlug(slug: string): BlogPost | undefined {
   return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getReadingMinutes(post: BlogPost): number {
   const text = [
      post.intro,
      ...post.sections.flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.list ?? [])]),
   ].join(" ");

   return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

export function formatPostDate(value: string): string {
   return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
   });
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
   const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);
   const sameCategory = others.filter((p) => p.category === post.category);
   const rest = others.filter((p) => p.category !== post.category);

   return [...sameCategory, ...rest].slice(0, limit);
}
