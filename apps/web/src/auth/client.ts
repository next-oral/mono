import { createAuthClient } from "better-auth/client"
import { adminClient, emailOTPClient, organizationClient } from "better-auth/client/plugins"
import { baseUrl } from "./server"
 
export const authClient = createAuthClient({
    baseURL: baseUrl,
    plugins: [ 
        adminClient(),
        emailOTPClient(),
        organizationClient() 
    ] 
})