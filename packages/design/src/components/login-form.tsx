import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@repo/design/components/ui/button";
import { Input } from "@repo/design/components/ui/input";
import { cn } from "@repo/design/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const loginForm = z.object({
  email: z.string().email("Please provide a valid email"),
});
type LoginForm = z.infer<typeof loginForm>;

interface LoginFormProps extends React.ComponentProps<"form"> {
  isPending?: boolean;
  handleSubmit: SubmitHandler<LoginForm>;
}
export function LoginForm({
  className,
  handleSubmit,
  isPending,
  ...props
}: LoginFormProps) {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      email: "",
    },
  });
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to Next Oral</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Sign in to continue
          </p>
        </div>
        <div className="grid gap-6">
          <div className="flex flex-col gap-4">
            <Button variant="outline" className="w-full">
              <svg
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                width="256"
                height="256"
                preserveAspectRatio="xMidYMid"
              >
                <path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" />
                <path fill="#80CC28" d="M256 121.666H134.335V0H256z" />
                <path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" />
                <path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" />
              </svg>
              Microsoft
            </Button>
            <Button variant="outline" className="w-full">
              <svg
                width="256"
                height="262"
                viewBox="0 0 256 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              Google
            </Button>
          </div>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={cn("flex flex-col gap-6")}
            {...props}
          >
            <div className="inline-flex h-3 items-center justify-center gap-2.5">
              <div className="h-px grow bg-zinc-950/10 dark:bg-white/10"></div>
              <div className="text-center text-[11px] text-zinc-950/50 dark:text-white/30">
                OR
              </div>
              <div className="h-px grow bg-zinc-950/10 dark:bg-white/10"></div>
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        {...field}
                        {...form.register("email")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              isLoading={isPending}
              loadingMessage="Sending OTP...."
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
}
