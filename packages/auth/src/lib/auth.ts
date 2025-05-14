import { db } from "@repo/database/client";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: { 
      clientId: "process.env.GOOGLE_CLIENT_ID!", 
      clientSecret: "process.env.GOOGLE_CLIENT_SECRET!", 
  }, 
    microsoft: { 
        clientId: "env.MICROSOFT_CLIENT_ID", 
        clientSecret: "env.MICROSOFT_CLIENT_SECRET", 
        tenantId: 'common', 
        requireSelectAccount: true
    }, 
},
  plugins: [admin(), organization()],
});
