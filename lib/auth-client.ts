import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({});
export const { useSession } = authClient;
export const useAuth = () => useSession().data;
