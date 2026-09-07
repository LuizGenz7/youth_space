import CompleteProfilePage from "@/components/profile/CompleteProfileForm";
import { requireAuth } from "@/lib/auth";

export const instant = false;

export default async function Page() {
   await requireAuth();

  return <CompleteProfilePage />;
}