"use server";

import {
  getCurrentUser,
} from "@/data/auth-t";

export async function getAuthenticatedUser() {
  return getCurrentUser();
}