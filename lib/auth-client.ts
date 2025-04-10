import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [usernameClient()],
});
export const { useSession } = authClient;
export const useAuth = () => useSession().data;
