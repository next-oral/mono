"use client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design/components/ui/card";
import { Separator } from "@repo/design/components/ui/separator";

import { getSession } from "~/auth/server";
import { useZero } from "@rocicorp/zero/react";
import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import { useZeroQuery } from "~/providers/zero";

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  // const { id } = await params;

  const parameters = useParams();
  const { id } = parameters;

  // const session = await getSession();
  // if (!session) return notFound();
  const z = useZero<Schema, Mutators>();

  const { data: patient } = useZeroQuery(
    z.query.patient.where("id", "=", id).related("address").one(),
  )
  console.log("Params", patient);

  return (
    <div className="w-full">

      fdscgfs

      {/* <div className="text-muted-foreground mb-4 text-sm">
        <Link href="../patients" className="hover:underline">
          ← Back to patients
        </Link>
      </div> */}
      {/* <Card>
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
      </Card> */}
    </div>
  );
}
