"use client";

import { useMutation } from "@tanstack/react-query";

import { Button } from "@repo/design/src/components/ui/button";
import { Input } from "@repo/design/src/components/ui/input";
import { Label } from "@repo/design/src/components/ui/label";

import { useTRPC } from "~/trpc/react";

function SubdomainInput({
  defaultValue,
  rootDomain,
}: {
  defaultValue?: string;
  rootDomain: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="subdomain">Subdomain</Label>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            id="subdomain"
            name="subdomain"
            placeholder="your-subdomain"
            defaultValue={defaultValue}
            className="w-full rounded-r-none focus:z-10"
            required
          />
        </div>
        <span className="border-input flex min-h-[36px] items-center rounded-r-md border border-l-0 bg-gray-100 px-3 text-gray-500">
          .{rootDomain}
        </span>
      </div>
    </div>
  );
}

export function SubdomainForm({
  domain,
}: {
  domain: { root: string; protocol: string };
}) {
  const trpc = useTRPC();

  const createDomain = useMutation(trpc.domain.create.mutationOptions());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const domain = await createDomain.mutateAsync({ subdomain: "london" });
    console.log(domain);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SubdomainInput rootDomain={domain.root} />

      <Button
        type="submit"
        className="w-full"
        disabled={createDomain.isPending}
      >
        {createDomain.isPending ? "Creating..." : "Create Subdomain"}
      </Button>
    </form>
  );
}
