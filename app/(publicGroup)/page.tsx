// export default function HomePage() {
//    return (
//       <main className="flex-1">
//          <section className="mx-auto max-w-7xl px-4 py-20 text-center">
//             <h1 className="text-4xl font-bold">Welcome to FixItNow</h1>

//             <p className="mt-4 text-muted-foreground">
//                Find trusted home service professionals and book quality services.
//             </p>
//          </section>
//       </main>
//    );
// }

import { Categories } from "./_components/home/categories";
import { Cta } from "./_components/home/cta";
import { Faq } from "./_components/home/faq";
import { FeaturedServices } from "./_components/home/featured-services";
import { Hero } from "./_components/home/hero";
import { HowItWorks } from "./_components/home/how-it-works";
import { Reviews } from "./_components/home/reviews";
import { Stats } from "./_components/home/stats";
import { TopTechnicians } from "./_components/home/top-technicians";
import { WhyUs } from "./_components/home/why-us";

export default function HomePage() {
   return (
      <main className="flex-1">
         <Hero />
         <Stats />
         <Categories />
         <FeaturedServices />
         <HowItWorks />
         <WhyUs />
         <TopTechnicians />
         <Reviews />
         <Faq />
         <Cta />
      </main>
   );
}
