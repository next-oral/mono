"use client"

import { LoginForm } from "@repo/design/components/login-form"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { authClient } from "~/auth/client"

export default function LoginPage() {

  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      setIsPending(true)
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in"
      })
      if (error) throw new Error(error.message)

      return router.push(`/verify?email=${email}`);
    } catch (error) {
      console.log(error)
    }
    finally{
      setIsPending(false)
    }
  }
  return <LoginForm isPending={isPending} handleSubmit={handleSubmit} />
}
