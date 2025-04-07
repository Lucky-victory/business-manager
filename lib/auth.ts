import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
});
