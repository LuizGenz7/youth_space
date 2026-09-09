import { cookies } from "next/headers";

export async function getAuthIdToken() {
  const cookieStore = await cookies();

  return cookieStore.get("firebase-auth-token")?.value || null;
}