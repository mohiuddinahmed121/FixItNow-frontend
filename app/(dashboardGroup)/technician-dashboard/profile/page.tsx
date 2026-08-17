"use client";

import { FormEvent, useState } from "react";
import { useMyTechnicianProfile, useUpdateTechnicianProfile } from "@/hooks/use-technician";

export default function TechnicianProfilePage() {
   const { data, isLoading, isError, error } = useMyTechnicianProfile();
   const updateProfile = useUpdateTechnicianProfile();

   const profile = data?.data;

   const [bio, setBio] = useState<string | null>(null);
   const [experience, setExperience] = useState<string | null>(null);
   const [skills, setSkills] = useState<string | null>(null);
   const [location, setLocation] = useState<string | null>(null);
   const [hourlyRate, setHourlyRate] = useState<string | null>(null);
   const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

   if (isLoading) {
      return (
         <div className="p-6">
            <p>Loading profile...</p>
         </div>
      );
   }

   if (isError || !profile) {
      return (
         <div className="p-6">
            <p className="text-red-500">
               {error instanceof Error ? error.message : "Failed to load technician profile"}
            </p>
         </div>
      );
   }

   const currentBio = bio ?? profile.bio ?? "";
   const currentExperience = experience ?? String(profile.experience ?? "");
   const currentSkills = skills ?? profile.skills?.join(", ") ?? "";
   const currentLocation = location ?? profile.location ?? "";
   const currentHourlyRate = hourlyRate ?? String(profile.hourlyRate ?? "");
   const currentIsAvailable = isAvailable ?? profile.isAvailable;

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      updateProfile.mutate({
         bio: currentBio,
         experience: Number(currentExperience),
         skills: currentSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
         location: currentLocation,
         hourlyRate: Number(currentHourlyRate),
         isAvailable: currentIsAvailable,
      });
   };

   return (
      <div className="max-w-2xl space-y-6 p-6">
         <div>
            <h1 className="text-3xl font-bold">My Profile</h1>

            <p className="mt-2 text-muted-foreground">
               Manage your technician profile and availability.
            </p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-6">
            <div>
               <label className="text-sm font-medium">Bio</label>

               <textarea
                  value={currentBio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers about yourself"
                  className="mt-2 min-h-24 w-full rounded-md border p-3 text-sm"
               />
            </div>

            <div>
               <label className="text-sm font-medium">Experience (years)</label>

               <input
                  type="number"
                  min="0"
                  value={currentExperience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-2 w-full rounded-md border p-3 text-sm"
               />
            </div>

            <div>
               <label className="text-sm font-medium">Skills</label>

               <input
                  type="text"
                  value={currentSkills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Plumbing, Electrical, Painting"
                  className="mt-2 w-full rounded-md border p-3 text-sm"
               />

               <p className="mt-1 text-xs text-muted-foreground">Separate skills with commas.</p>
            </div>

            <div>
               <label className="text-sm font-medium">Location</label>

               <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2 w-full rounded-md border p-3 text-sm"
               />
            </div>

            <div>
               <label className="text-sm font-medium">Hourly Rate</label>

               <input
                  type="number"
                  min="0"
                  value={currentHourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="mt-2 w-full rounded-md border p-3 text-sm"
               />
            </div>

            <div className="flex items-center justify-between rounded-md border p-4">
               <div>
                  <p className="font-medium">Availability</p>

                  <p className="text-sm text-muted-foreground">
                     Customers can book you when you are available.
                  </p>
               </div>

               <button
                  type="button"
                  onClick={() => setIsAvailable(!currentIsAvailable)}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                     currentIsAvailable ? "bg-primary text-primary-foreground" : "border"
                  }`}
               >
                  {currentIsAvailable ? "Available" : "Unavailable"}
               </button>
            </div>

            <button
               type="submit"
               disabled={updateProfile.isPending}
               className="w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
               {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </button>

            {updateProfile.isSuccess && (
               <p className="text-sm text-green-600">Profile updated successfully.</p>
            )}

            {updateProfile.isError && (
               <p className="text-sm text-red-500">
                  {updateProfile.error instanceof Error
                     ? updateProfile.error.message
                     : "Failed to update profile"}
               </p>
            )}
         </form>
      </div>
   );
}
