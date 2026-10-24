import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://everlastingmemories.onrender.com",
});

export const { signIn, signUp, signOut, useSession } = authClient;