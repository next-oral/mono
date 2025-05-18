import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getQueryClient, trpc } from "~/trpc/server";

export async function GenerateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;

  const queryClient = getQueryClient();
  const domain = await queryClient.ensureQueryData(
    trpc.domain.getDomainConfig.queryOptions(),
  );
  const sub = await queryClient.ensureQueryData(
    trpc.domain.getDomain.queryOptions({ domain: subdomain }),
  );

  if (!sub) {
    return {
      title: domain.root,
    };
  }

  return {
    title: `${subdomain}.${domain.root}`,
    description: `Subdomain page for ${subdomain}.${domain.root}`,
  };
}

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const queryClient = getQueryClient();

  const domain = await queryClient.ensureQueryData(
    trpc.domain.getDomainConfig.queryOptions(),
  );
  const sub = await queryClient.ensureQueryData(
    trpc.domain.getDomain.queryOptions({ domain: subdomain }),
  );

  if (!sub) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="absolute top-4 right-4">
        <Link
          href={`${domain.protocol}://${domain.root}`}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          {domain.root}
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-9xl">{}</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to {subdomain}.{domain.root}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            This is your custom subdomain page
          </p>
        </div>
      </div>
    </div>
  );
}
