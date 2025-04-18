"use server";

import { auth, signIn, signOut } from "@/auth";

export async function login(formData) {
  try {
      const response = await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirect: false,
      });
      return response;
  } catch (err) {
      throw err;
  }
}

export async function session() {
    const authResult = await auth();
    return authResult || null;
}

export async function doSignOut() {
    await signOut();
  }