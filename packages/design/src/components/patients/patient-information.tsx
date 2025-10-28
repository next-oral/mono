import type { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { EyeIcon, TrashIcon } from "lucide-react";

import type { CarouselApi } from "../ui/carousel";
import image2 from "../../assets/screenshots/calendar.png";
import image1 from "../../assets/screenshots/patients.png";
import image3 from "../../assets/screenshots/schedule.png";
import { cn } from "../../lib/utils";
import { FileIconTemplate } from "../file-icon-template";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
} from "../ui/data-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface PatientInformationProps {
  // Define props here
  patient:
    | {
        readonly id: string;
        readonly orgId: string;
        readonly firstName: string;
        readonly lastName: string;
        readonly middleName: string | null;
        readonly email: string | null;
        readonly phone: string | null;
        readonly status: "ACTIVE" | "INACTIVE" | null;
        readonly dob: number;
        readonly addressId: string;
        readonly createdAt: number | null;
        readonly updatedAt: number;
        readonly address:
          | {
              readonly id: string;
              readonly street: string;
              readonly city: string;
              readonly state: string;
              readonly zipCode: string;
              readonly country: string;
              readonly createdAt: number | null;
              readonly updatedAt: number;
            }
          | undefined;
      }
    | undefined;
}

export function PatientInformation({ patient }: PatientInformationProps) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [patientImages, setPatientImages] = useState([image1, image2, image3]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<
    string | StaticImageData | null
  >(null);

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
    <>
      <div className="flex flex-col gap-5 px-2 py-5 sm:px-4">
        <h4 className="text-xs opacity-70">Details</h4>

        <DataList orientation="vertical" className="grid w-full grid-cols-3">
          <DataListItem>
            <DataListLabel>First name</DataListLabel>
            <DataListValue>{patient?.firstName}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Last name</DataListLabel>
            <DataListValue>{patient?.lastName}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Phone</DataListLabel>
            <DataListValue>{patient?.phone}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Gender</DataListLabel>
            <DataListValue>{"-"}</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>Date of Birth</DataListLabel>
            <DataListValue>
              {/* {format(new Date(patient?.dob), "MMM d, yyyy")} */}
            </DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Address</DataListLabel>
            <DataListValue>
              {patient?.address?.city ?? ""} {patient?.address?.state ?? ""}{" "}
              {patient?.address?.zipCode ?? ""}
            </DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Last treatment</DataListLabel>
            <DataListValue>{"-"}</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>Date last treatment was gotten</DataListLabel>
            <DataListValue>{format(new Date(), "MMM dd, yyyy")}</DataListValue>
          </DataListItem>
        </DataList>
      </div>
      <hr />

      <div className="flex flex-col gap-5 px-2 py-5 sm:px-4">
        <h4 className="text-xs opacity-70">Hygiene & Habits</h4>

        <DataList orientation="vertical" className="grid w-full grid-cols-3">
          <DataListItem>
            <DataListLabel>
              When did you make the latest dental visit?
            </DataListLabel>
            <DataListValue>Less than 3 months ago</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>What time did you start dental care?</DataListLabel>
            <DataListValue>Less than 3 months ago</DataListValue>
          </DataListItem>
          <DataListItem>
            <DataListLabel>
              How many times in a day do you wash your teeth?
            </DataListLabel>
            <DataListValue>Less than 3 times a day</DataListValue>
          </DataListItem>
        </DataList>
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
                  <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size={"icon"}
                        className="bg-black/40 text-white hover:bg-black/70"
                        onClick={() => setFileToDelete(image)}
                      >
                        <TrashIcon />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[40%] px-0">
                      <DialogHeader className="flex flex-col items-center justify-center gap-6 px-2 pt-6 sm:px-4">
                        <div className="bg-destructive/10 text-destructive [&>svg]:fill-destructive rounded-xl px-4 py-3 [&>svg]:size-5">
                          <TrashIcon />
                        </div>
                        <DialogTitle className="max-w-[80%] text-center text-sm font-medium">
                          Are you sure you want to delete this document? It
                          might be important for treatments and consultations
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="border-t-1 px-0 py-0">
                        <hr />
                        <div className="flex w-full gap-2 px-2 pt-1 *:flex-1 *:text-sm sm:px-4">
                          <Button
                            variant={"destructive"}
                            onClick={() => {
                              setPatientImages((prev) =>
                                prev.filter((image) => image != fileToDelete),
                              );
                              setIsDeleteOpen(false);
                            }}
                          >
                            Yes, Delete
                          </Button>
                          <Button variant={"secondary"}>No, Cancel</Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
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
    </>
  );
}

// interface FilePreviewProps {
//   uri: string;
// }

// function FilePreview({ uri }: FilePreviewProps) {
//   const [fileInfo, setFileInfo] = useState<{
//     extension: string;
//     size?: number; // Size in bytes
//     type?: string; // MIME type
//   } | null>(null);

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getFileProperties = async () => {
//       try {
//         // First, parse the URL to get the extension
//         const urlObject = new URL(uri);
//         const lastDotIndex = urlObject.pathname.lastIndexOf(".");
//         const extension =
//           lastDotIndex !== -1 ? urlObject.pathname.slice(lastDotIndex + 1) : "";

//         // Use fetch to get file data from the URL
//         const response = await fetch(uri);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Retrieve file properties from the response headers
//         const size = response.headers.get("Content-Length");
//         const type = response.headers.get("Content-Type");

//         console.log(response.blob(), urlObject);

//         setFileInfo({
//           extension,
//           size: size ? parseInt(size, 10) : undefined,
//           type: type ?? undefined,
//         });
//       } catch (e: Error) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Intentionally don't await the async function here because
//     // useEffect callback cannot be async — the function handles
//     // its own errors and state. Use `void` to satisfy the
//     // `@typescript-eslint/no-floating-promises` rule.
//     void getFileProperties();
//   }, [uri]);

//   console.log(fileInfo);
//   return <p></p>;
// }
