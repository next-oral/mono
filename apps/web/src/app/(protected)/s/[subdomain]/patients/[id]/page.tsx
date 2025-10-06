import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import { Separator } from "@repo/design/components/ui/separator";

import { getSession } from "~/auth/server";

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return notFound();

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="text-muted-foreground mb-4 text-sm">
        <Link href="../patients" className="hover:underline">
          ← Back to patients
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patient {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="font-medium">Contact</div>
              <Separator className="my-2" />
              <div className="text-sm">Email: —</div>
            </div>
            <div>
              <div className="font-medium">Address</div>
              <Separator className="my-2" />
              <div className="text-sm">—</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
