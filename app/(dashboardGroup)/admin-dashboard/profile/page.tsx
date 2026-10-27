import { ProfileView } from "@/components/shared/profile-view";
import { PlatformSummary } from "./_components/platform-summary";

export default function AdminProfilePage() {
   return (
      <ProfileView>
         <PlatformSummary />
      </ProfileView>
   );
}
