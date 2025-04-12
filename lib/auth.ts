import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  user: {
    modelName: "users",
    additionalFields: {
      companyName: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      companyAddress: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      companyPhone: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      companyEmail: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
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
  socialProviders: {
    google: {
      enabled: true,

      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [username()],
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
});
