"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useZero } from "@rocicorp/zero/react";
import { format, intervalToDuration } from "date-fns";

import type { CarouselApi } from "@repo/design/src/components/ui/carousel";
import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import { FileIconTemplate } from "@repo/design/src/components/file-icon-template";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Button } from "@repo/design/src/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/design/src/components/ui/carousel";
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
import { Ellipsis, EyeIcon, TrashIcon } from "@repo/design/src/icons";

import { cn } from "~/lib/utils";
import { useZeroQuery } from "~/providers/zero";
import image2 from "../../../../../../images/screenshots/calendar.png";
import image1 from "../../../../../../images/screenshots/patients.png";
import image3 from "../../../../../../images/screenshots/schedule.png";

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const parameters = useParams();
  const { id } = parameters;

  const z = useZero<Schema, Mutators>();

  const { data: patient } = useZeroQuery(
    z.query.patient.where("id", "=", String(id)).related("address").one(),
  );
  const { data: patientWithAppointments } = useZeroQuery(
    z.query.patient.where("id", "=", String(id)).related("appointments").one(),
  );

  const patientImages = [image1, image2, image3];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    console.log("API", current, api.selectedScrollSnap());
  }, [api, current]);

  useEffect(() => {
    if (!isCarouselOpen) {
      setCurrent(1);
    }
  }, [isCarouselOpen]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap-reverse items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex items-center gap-2">
          <Avatar className="bg-secondary/70 size-20">
            <AvatarImage src={""} />
            <AvatarFallback className="text-2xl font-medium uppercase sm:text-3xl">
              {patient?.firstName.charAt(0)}
              {patient?.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-medium sm:text-base">
              {patient?.firstName} {patient?.lastName}
            </h2>
            <p className="text-xs opacity-70 sm:text-sm">
              Added{" "}
              {format(
                new Date(patient?.createdAt ?? "1111-05-17"),
                "dd MMM, yyyy",
              )}
            </p>
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
        <TabsContent value="patient information" className="">
          <div className="flex flex-col gap-5 px-2 py-5 sm:px-4">
            <h4 className="text-xs opacity-70">Details</h4>

            <div className="mt-3 flex flex-wrap gap-5 *:min-w-[31%]">
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  First name
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  {patient?.firstName}
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Middle name
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  {patient?.middleName}
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Last name
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  {patient?.lastName}
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Phone number
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  {patient?.phone}
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">Email</legend>
                <p className="text-sm lowercase sm:text-base">
                  {patient?.email ?? "-"}
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Address
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  {patient?.address?.street ?? "-"}
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Gender
                </legend>
                <p className="text-sm capitalize sm:text-base">-</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">Age</legend>
                <p className="text-sm capitalize sm:text-base">
                  {
                    intervalToDuration({
                      start: new Date(String(patient?.dob)),
                      end: new Date(),
                    }).years
                  }
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Last treatment
                </legend>
                <p className="text-sm capitalize sm:text-base">-</p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  Date last treatment was gotten
                </legend>
                <p className="text-sm capitalize sm:text-base">-</p>
              </div>
            </div>
          </div>
          <hr />

          <div className="flex flex-col gap-5 px-2 py-5 sm:px-4">
            <h4 className="text-xs opacity-70">Hygiene & Habits</h4>

            <div className="mt-3 flex flex-wrap gap-5 *:min-w-[31%]">
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  When did you make the latest dental visit?
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  Less than 3 months ago
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  What time did you start dental care?
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  Less than 3 months ago
                </p>
              </div>
              <div className="flex flex-col gap-[0.2px]">
                <legend className="text-xs opacity-70 sm:text-sm">
                  How many times in a day do you wash your teeth?
                </legend>
                <p className="text-sm capitalize sm:text-base">
                  Less than 3 times a day
                </p>
              </div>
            </div>
          </div>
          <hr />

          <div className="flex flex-col gap-5 px-2 py-5 sm:px-4">
            <h4 className="text-xs opacity-70">Files & attachments</h4>

            <div className="mt-3 flex flex-wrap gap-4">
              {/* <iframe
                  src={"https://9pw75ji2zw.ufs.sh/f/eSd8rhQDelQ7SMkV4QoqZ3Q9aKc5Y6feSOxBREAXVmhWzLG7"}
                  title="Document Preview"
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                ></iframe> */}
              {patientImages.map((image, index) => {
                return (
                  <div key={index} className="relative flex w-36 flex-col">
                    <Image
                      src={image}
                      alt="Attachment"
                      className="peer h-36 w-full rounded-md border object-cover"
                    />
                    <div className="absolute flex h-36 w-full items-center justify-center gap-0.5 rounded-md bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <Button
                        size={"icon"}
                        className="bg-black/40 text-white hover:bg-black/70"
                        onClick={() => {
                          setIsCarouselOpen(true);
                          api?.scrollTo(index + 1, true);
                          console.log("Dig");
                        }}
                      >
                        <EyeIcon />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size={"icon"}
                            className="bg-black/40 text-white hover:bg-black/70"
                          >
                            <TrashIcon />
                          </Button>
                        </DialogTrigger>

                        <DialogContent></DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <FileIconTemplate
                        fileExtension="jpg"
                        fileFormat="image"
                        className="[&>div]:size-7"
                      />

                      <div className="flex flex-col">
                        <h4 className="text-truncate text-xs lowercase">
                          image 01
                        </h4>
                        <p className="text-[9px] opacity-70">26 kb</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={cn(
              "fixed inset-0 z-999 flex h-full w-full max-w-screen items-center justify-center",
              { hidden: !isCarouselOpen },
            )}
          >
            <div
              className="absolute h-full w-full bg-black/90"
              onClick={() => setIsCarouselOpen(false)}
            />
            <div className="flex h-full w-[80%] min-w-[80%] items-center justify-center">
              <Carousel setApi={setApi} className="w-full">
                <div>
                  <CarouselContent>
                    {patientImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="mx-auto flex h-full w-full justify-center">
                          <Image
                            src={image}
                            alt="Attachment"
                            className="h-full w-sm rounded-md border object-cover md:w-[40%]"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 bg-black text-white shadow-sm" />
                  <CarouselNext className="right-0 bg-black text-white shadow-sm" />
                </div>

                <div className="mt-3 flex w-full justify-center">
                  <div className="flex flex-wrap gap-2">
                    {patientImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt="Attachment"
                        className={cn(
                          "h-[36px] w-[36px] cursor-pointer rounded-md border object-cover sm:h-[40px] sm:w-[40px] md:h-[45px] md:w-[45px]",
                          { "border-4 border-white": current === index + 1 },
                        )}
                        onClick={() => api?.scrollTo(index)}
                      />
                    ))}
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className=""></TabsContent>
      </Tabs>

      {/* <div className="text-muted-foreground mb-4 text-sm">
        <Link href="../patients" className="hover:underline">
          ← Back to patients
        </Link>
      </div> */}
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
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFileProperties = async () => {
      try {
        // First, parse the URL to get the extension
        const urlObject = new URL(uri);
        const lastDotIndex = urlObject.pathname.lastIndexOf(".");
        const extension =
          lastDotIndex !== -1 ? urlObject.pathname.slice(lastDotIndex + 1) : "";

        // Use fetch to get file data from the URL
        const response = await fetch(uri);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Retrieve file properties from the response headers
        const size = response.headers.get("Content-Length");
        const type = response.headers.get("Content-Type");

        console.log(response.blob(), urlObject);

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
  return <p></p>;
}
