import type { Service } from "@/services/service";

type TechnicianProfile = Service["technicianProfile"];

export type TopTechnician = {
   profile: TechnicianProfile;
   firstServiceId: string;
   serviceCount: number;
};

// Builds a unique technician list from real services: available first, then most experienced.
export function getTopTechnicians(services: Service[], limit: number): TopTechnician[] {
   const map = new Map<string, TopTechnician>();

   for (const service of services) {
      const existing = map.get(service.technicianProfile.id);

      if (existing) {
         existing.serviceCount += 1;
      } else {
         map.set(service.technicianProfile.id, {
            profile: service.technicianProfile,
            firstServiceId: service.id,
            serviceCount: 1,
         });
      }
   }

   return [...map.values()]
      .sort(
         (a, b) =>
            Number(b.profile.isAvailable) - Number(a.profile.isAvailable) ||
            b.profile.experience - a.profile.experience,
      )
      .slice(0, limit);
}
