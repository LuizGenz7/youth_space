import {
  getServerFirebase,
} from "@/lib/server";

export async function getCurrentUser() {
  const {
    auth,
  } = await getServerFirebase();

  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}