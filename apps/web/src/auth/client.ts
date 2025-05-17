import { createAuthClient } from "better-auth/client"
import { adminClient, emailOTPClient, organizationClient } from "better-auth/client/plugins"
 
const baseUrl = "http://localhost:3000";


export const authClient = createAuthClient({
    baseURL: baseUrl,
    plugins: [ 
        adminClient(),
        emailOTPClient(),
        organizationClient() 
    ] 
})