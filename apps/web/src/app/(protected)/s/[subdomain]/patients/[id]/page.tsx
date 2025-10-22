"use client";

import { useZero } from "@rocicorp/zero/react";
import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import { useZeroQuery } from "~/providers/zero";
import { Dialog, DialogContent, DialogTrigger } from "@repo/design/src/components/ui/dialog";
import { Button } from "@repo/design/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design/src/components/ui/popover";
import { Ellipsis } from "@repo/design/src/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/src/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design/src/components/ui/tabs";
import { FileIconTemplate } from "@repo/design/src/components/file-icon-template";
import { useParams } from "next/navigation";
import imageAttachment from "../../../../../../images/screenshots/patients.png"
import Image from "next/image";
import { useEffect, useState } from "react";
import { differenceInYears, format, intervalToDuration } from "date-fns";

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {

  const parameters = useParams();
  const { id } = parameters;

  const z = useZero<Schema, Mutators>();

  const { data: patient } = useZeroQuery(
    z.query.patient.where("id", "=", String(id)).related("address").one(),
  );
  const { data: patientWithAppointments } = useZeroQuery(
    z.query.patient.where("id", "=", String(id)).related("appointments").one(),
  );

  console.log(patientWithAppointments)

  return (
    <div className="w-full">

      <div className="flex justify-between flex-wrap-reverse items-center gap-3 px-2 sm:px-4">
        <div className="flex gap-2 items-center">
          <Avatar className="bg-secondary/70 size-20">
            <AvatarImage src={""} />
            <AvatarFallback className="uppercase text-2xl sm:text-3xl font-medium">{patient?.firstName.charAt(0)}{patient?.lastName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <h2 className="font-medium text-sm sm:text-base">{patient?.firstName} {" "} {patient?.lastName}</h2>
            <p className="text-xs sm:text-sm opacity-70">Added {format(new Date(patient?.createdAt), "dd MMM, yyyy")}</p>
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
              <Button variant="outline"><Ellipsis /></Button>
            </PopoverTrigger>
            <PopoverContent className="size-fit"></PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="patient information" className="mt-10 gap-0">
        <TabsList className="mb-0 px-2 sm:px-4 *:text-xs *:sm:text-sm pb-0 bg-transparent h-fit *:text-muted-foreground *:rounded-b-none *:data-[state=active]:shadow-none *:data-[state=active]:bg-blue-50 *:data-[state=active]:text-blue-700 *:dark:data-[state=active]:bg-blue-950 *:dark:data-[state=active]:text-blue-400">
          <TabsTrigger value="patient information" className="px-3 py-2">Patient information</TabsTrigger>
          <TabsTrigger value="appointments" className="px-3 py-2">Appointments</TabsTrigger>
          <TabsTrigger value="medical records" className="px-3 py-2">Medical records</TabsTrigger>
        </TabsList>
        <hr />
        <TabsContent value="patient information" className="">
          <div className="flex flex-col gap-5 py-5 px-2 sm:px-4 ">
            <h4 className="opacity-70 text-xs">Details</h4>

            <div className="mt-3 gap-5 flex flex-wrap *:min-w-[31%]">
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">First name</legend>
                <p className="capitalize text-sm sm:text-base">{patient?.firstName}</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Middle name</legend>
                <p className="capitalize text-sm sm:text-base">{patient?.middleName}</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Last name</legend>
                <p className="capitalize text-sm sm:text-base">{patient?.lastName}</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Phone number</legend>
                <p className="capitalize text-sm sm:text-base">{patient?.phone}</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Email</legend>
                <p className="lowercase text-sm sm:text-base">{patient?.email ?? "-"}</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Address</legend>
                <p className="capitalize text-sm sm:text-base">{patient?.address?.street ?? '-'}</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Gender</legend>
                <p className="capitalize text-sm sm:text-base">-</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Age</legend>
                <p className="capitalize text-sm sm:text-base">
                  {
                    intervalToDuration({
                      start: new Date(String(patient?.dob)),
                      end: new Date()
                    }).years
                  }
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Last treatment</legend>
                <p className="capitalize text-sm sm:text-base">-</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">Date last treatment was gotten</legend>
                <p className="capitalize text-sm sm:text-base">-</p>
              </div>
            </div>
          </div>
          <hr />

          <div className="flex flex-col gap-5 py-5 px-2 sm:px-4 ">
            <h4 className="opacity-70 text-xs">Hygiene & Habits</h4>

            <div className="mt-3 gap-5 flex flex-wrap *:min-w-[31%]">
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">When did you make the latest dental visit?</legend>
                <p className="capitalize text-sm sm:text-base">Less than 3 months ago</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">What time did you start dental care?</legend>
                <p className="capitalize text-sm sm:text-base">Less than 3 months ago</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="opacity-70 text-xs sm:text-sm">How many times in a day do you wash your teeth?</legend>
                <p className="capitalize text-sm sm:text-base">Less than 3 times a day</p>
              </div>
            </div>
          </div>
          <hr />

          <div className="flex flex-col gap-5 py-5 px-2 sm:px-4 ">
            <h4 className="opacity-70 text-xs">Files & attachments</h4>

            <div className="mt-3 gap-4 flex flex-wrap">
              <div className="flex flex-col">
                <iframe
                  src={"https://9pw75ji2zw.ufs.sh/f/eSd8rhQDelQ7SMkV4QoqZ3Q9aKc5Y6feSOxBREAXVmhWzLG7"}
                  title="Document Preview"
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                ></iframe>
                <FilePreview uri={"https://docs.google.com/spreadsheets/d/135ozCs8XrCsy2l81Pp3IMgXdSeyQUvbX/edit?usp=drive_link&ouid=105884016000064561958&rtpof=true&sd=true" as unknown as string} />
                {/* <Image src={"https://9pw75ji2zw.ufs.sh/f/eSd8rhQDelQ79Y9svsF60qk5djXNsScCg3e1wDFRbU2ir7Vn"} width="70px" alt="Attachment" className="w-32 h-32 object-cover rounded-md border" /> */}
              </div>
            </div>
          </div>

          <FileIconTemplate fileExtension="jpg" fileFormat="image" />
        </TabsContent>

        <TabsContent value="appointments" className="">

        </TabsContent>
      </Tabs>

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

interface FilePreviewProps {
  uri: string;
}

function FilePreview({ uri }: FilePreviewProps) {

  const [fileInfo, setFileInfo] = useState<{
    extension: string;
    size?: number; // Size in bytes
    type?: string; // MIME type
  }
    | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFileProperties = async () => {
      try {
        // First, parse the URL to get the extension
        const urlObject = new URL(uri);
        const lastDotIndex = urlObject.pathname.lastIndexOf('.');
        const extension = lastDotIndex !== -1 ? urlObject.pathname.slice(lastDotIndex + 1) : '';

        // Use fetch to get file data from the URL
        const response = await fetch(uri);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Retrieve file properties from the response headers
        const size = response.headers.get('Content-Length');
        const type = response.headers.get('Content-Type');

        console.log(response.blob(), urlObject)

        setFileInfo({
          extension,
          size: size ? parseInt(size, 10) : undefined,
          type: type ?? undefined,
        });
      } catch (e: Error) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    // Intentionally don't await the async function here because
    // useEffect callback cannot be async — the function handles
    // its own errors and state. Use `void` to satisfy the
    // `@typescript-eslint/no-floating-promises` rule.
    void getFileProperties();
  }, [uri]);

  console.log(fileInfo);
  return (
    <p></p>
  )
}