"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useZero } from "@rocicorp/zero/react";
import { format } from "date-fns";

import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import { MedicalRecords } from "@repo/design/src/components/patients/medical-records";
import { PatientInformation } from "@repo/design/src/components/patients/patient-information";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Button } from "@repo/design/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/design/src/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/src/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design/src/components/ui/tabs";
import { Ellipsis } from "@repo/design/src/icons";

import { useZeroQuery } from "~/providers/zero";

export default function PatientDetailsPage() {
  const parameters = useParams();
  const { id } = parameters;

  const z = useZero<Schema, Mutators>();

  const { data: patientWithAddress } = useZeroQuery(
    z.query.patient.where("id", "=", String(id)).related("address").one(),
  );
  const { data: dentists } = useZeroQuery(z.query.dentist);

  if (!patientWithAddress)
    return (
      <div className="flex h-full items-center justify-center">
        Patient not found
      </div>
    );

  return (
    <div className="w-full py-5">
      <div className="flex flex-wrap-reverse items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <Suspense>
            <Avatar className="bg-secondary/70 size-20">
              <AvatarImage src={""} />
              <AvatarFallback className="text-2xl font-medium uppercase sm:text-3xl">
                {patientWithAddress.firstName.charAt(0)}
                {patientWithAddress.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Suspense>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-medium sm:text-base">
              {patientWithAddress.firstName} {patientWithAddress.lastName}
            </h2>
            <Suspense>
              <p className="text-xs opacity-70 sm:text-sm">
                Added{" "}
                {format(
                  new Date(patientWithAddress.createdAt ?? "1111-05-17"),
                  "dd MMM, yyyy",
                )}
              </p>
            </Suspense>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Edit Details</Button>
            </DialogTrigger>
            <DialogContent></DialogContent>
          </Dialog>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="size-fit"></PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="patient information" className="mt-10 gap-0">
        <TabsList className="*:text-muted-foreground mb-0 h-fit bg-transparent px-2 pb-0 *:rounded-b-none *:text-xs *:data-[state=active]:bg-blue-50 *:data-[state=active]:text-blue-700 *:data-[state=active]:shadow-none sm:px-4 *:sm:text-sm *:dark:data-[state=active]:bg-blue-950 *:dark:data-[state=active]:text-blue-400">
          <TabsTrigger value="patient information" className="px-3 py-2">
            Patient information
          </TabsTrigger>
          <TabsTrigger value="appointments" className="px-3 py-2">
            Appointments
          </TabsTrigger>
          <TabsTrigger value="medical records" className="px-3 py-2">
            Medical records
          </TabsTrigger>
        </TabsList>
        <hr />
        <TabsContent value="patient information">
          <PatientInformation patient={patientWithAddress} />
        </TabsContent>

        <TabsContent value="medical records" className="">
          <MedicalRecords dentists={dentists} />
        </TabsContent>
      </Tabs>

      {/* <div className="text-muted-foreground mb-4 text-sm">
        <Link href="../patients" className="hover:underline">
          ← Back to patients
        </Link>
      </div> */}
    </div>
  );
}
