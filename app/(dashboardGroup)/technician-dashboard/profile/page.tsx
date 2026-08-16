"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMyTechnicianProfile, useUpdateTechnicianProfile } from "@/hooks/use-technician";

export default function TechnicianProfilePage() {
   const { data, isLoading, isError, error } = useMyTechnicianProfile();
   const updateProfile = useUpdateTechnicianProfile();

   const profile = data?.data;

   const [bio, setBio] = useState("");
   const [experience, setExperience] = useState("");
   const [skills, setSkills] = useState("");
   const [location, setLocation] = useState("");
   const [hourlyRate, setHourlyRate] = useState("");
   const [isAvailable, setIsAvailable] = useState(false);

   useEffect(() => {
      if (!profile) return;

      setBio(profile.bio ?? "");
      setExperience(String(profile.experience ?? ""));
      setSkills(profile.skills?.join(", ") ?? "");
      setLocation(profile.location ?? "");
      setHourlyRate(String(profile.hourlyRate ?? ""));
      setIsAvailable(profile.isAvailable);
   }, [profile]);

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

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      updateProfile.mutate({
         bio,
         experience: Number(experience),
         skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
         location,
         hourlyRate: Number(hourlyRate),
         isAvailable,
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
                  value={bio}
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
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-2 w-full rounded-md border p-3 text-sm"
               />
            </div>

            <div>
               <label className="text-sm font-medium">Skills</label>

               <input
                  type="text"
                  value={skills}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2 w-full rounded-md border p-3 text-sm"
               />
            </div>

            <div>
               <label className="text-sm font-medium">Hourly Rate</label>

               <input
                  type="number"
                  min="0"
                  value={hourlyRate}
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
                  onClick={() => setIsAvailable((current) => !current)}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                     isAvailable ? "bg-primary text-primary-foreground" : "border"
                  }`}
               >
                  {isAvailable ? "Available" : "Unavailable"}
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
