import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@repo/design/components/ui/button";
import { Input } from "@repo/design/components/ui/input";
import { Label } from "@repo/design/components/ui/label";

import Loader from "./loader";

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error, data } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (error) throw new Error(JSON.stringify(error));
      return data;
    },
    onSuccess: () => {
      toast.success("OTP sent to email");
    },
    onError: (error) => {
      toast.error(JSON.stringify(error));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const { error, data } = await authClient.signIn.emailOtp({
        email,
        otp,
      });
      if (error) throw new Error(JSON.stringify(error));
      return data;
    },
    onSuccess: async () => {
      await navigate({ to: "/dashboard" });
      toast.success("Signed in successfully");
    },
    onError: (error) => {
      toast.error(JSON.stringify(error));
    },
  });
  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="button"
          className="w-full"
          disabled={!email || sendOtpMutation.isPending}
          onClick={() => {
            if (!email.includes("@")) {
              toast.error("Enter a valid email");
              return;
            }
            sendOtpMutation.mutate({ email });
          }}
        >
          {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          inputMode="numeric"
          placeholder="Enter the 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button
          type="button"
          className="w-full"
          disabled={!email || otp.length === 0 || verifyOtpMutation.isPending}
          onClick={() => verifyOtpMutation.mutate({ email, otp })}
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify & Sign In"}
        </Button>
      </div>

      <div className="pt-1 text-center">
        <Button variant="link" onClick={onSwitchToSignUp}>
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );

  // return (
  //   <div className="mx-auto mt-10 w-full max-w-md p-6">
  //     <h1 className="mb-6 text-center text-3xl font-bold">Welcome Back</h1>

  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault();
  //         e.stopPropagation();
  //         form.handleSubmit();
  //       }}
  //       className="space-y-4"
  //     >
  //       <div>
  //         <form.Field name="email">
  //           {(field) => (
  //             <div className="space-y-2">
  //               <Label htmlFor={field.name}>Email</Label>
  //               <Input
  //                 id={field.name}
  //                 name={field.name}
  //                 type="email"
  //                 value={field.state.value}
  //                 onBlur={field.handleBlur}
  //                 onChange={(e) => field.handleChange(e.target.value)}
  //               />
  //               {field.state.meta.errors.map((error) => (
  //                 <p key={error?.message} className="text-red-500">
  //                   {error?.message}
  //                 </p>
  //               ))}
  //             </div>
  //           )}
  //         </form.Field>
  //       </div>

  //       <div>
  //         <form.Field name="password">
  //           {(field) => (
  //             <div className="space-y-2">
  //               <Label htmlFor={field.name}>Password</Label>
  //               <Input
  //                 id={field.name}
  //                 name={field.name}
  //                 type="password"
  //                 value={field.state.value}
  //                 onBlur={field.handleBlur}
  //                 onChange={(e) => field.handleChange(e.target.value)}
  //               />
  //               {field.state.meta.errors.map((error) => (
  //                 <p key={error?.message} className="text-red-500">
  //                   {error?.message}
  //                 </p>
  //               ))}
  //             </div>
  //           )}
  //         </form.Field>
  //       </div>

  //       <form.Subscribe>
  //         {(state) => (
  //           <Button
  //             type="submit"
  //             className="w-full"
  //             disabled={!state.canSubmit || state.isSubmitting}
  //           >
  //             {state.isSubmitting ? "Submitting..." : "Sign In"}
  //           </Button>
  //         )}
  //       </form.Subscribe>
  //     </form>

  //     <div className="mt-4 text-center">
  //       <Button
  //         variant="link"
  //         onClick={onSwitchToSignUp}
  //         className="text-indigo-600 hover:text-indigo-800"
  //       >
  //         Need an account? Sign Up
  //       </Button>
  //     </div>
  //   </div>
  // );
}
