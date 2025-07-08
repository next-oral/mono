"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomInputField from "@repo/design/src/components/form/custom-input-field";
import { Button } from "@repo/design/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/src/components/ui/dialog";
import { Form } from "@repo/design/src/components/ui/form";
import {
  CalendarImg,
  DashboardHeroImg,
  PatientsImg,
  ScheduleImg,
} from "~/images/screenshots";

// import { HydrateClient } from "~/trpc/server";

const waitlistFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please provide your first name" }),
  lastName: z.string().min(1, { message: "Please provide your last name" }),
  email: z.string().email("Please provide a valid email"),
});

type WaitlistForm = z.infer<typeof waitlistFormSchema>;
type WaitlistFormFieldProps =
  | { withDialog: true; children: React.ReactNode }
  | { withDialog?: false; children?: React.ReactNode };

function WaitlistFormField({
  children,
  withDialog = false,
}: WaitlistFormFieldProps) {
  const waitlistForm = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleWaitlistSubmit = (values: WaitlistForm) => {
    try {
      console.log(values);
    } catch (error) {
      console.error(error);
    }
  };

  function WlForm() {
    return (
      <Form {...waitlistForm}>
        <form
          onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)}
          className="grid grid-cols-2 gap-1"
        >
          <CustomInputField
            control={waitlistForm.control}
            name="firstName"
            placeholder="First name *"
            isNotLabeled={true}
            inputClassName="bg-background"
          />
          <CustomInputField
            control={waitlistForm.control}
            name="lastName"
            placeholder="Last name *"
            isNotLabeled={true}
            inputClassName="bg-background"
          />
          <div className="col-span-2">
            <CustomInputField
              control={waitlistForm.control}
              name="email"
              placeholder="Email *"
              isNotLabeled={true}
              inputClassName="bg-background"
            />
          </div>
          <Button className="col-span-2 mt-2 py-5">Join the Waitlist</Button>
        </form>
      </Form>
    );
  }

  return (
    <>
      {withDialog ? (
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader className="border-b py-3">
              <DialogTitle className="text-center font-normal max-sm:text-sm">
                Enter your details below to tag along with us
              </DialogTitle>
              <DialogDescription className="sr-only">
                Join waitlist form
              </DialogDescription>
            </DialogHeader>
            <WlForm />
          </DialogContent>
        </Dialog>
      ) : (
        <WlForm />
      )}
    </>
  );
}

export default function HomePage() {
  const transitionValues = (duration?: number) => {
    return {
      duration: duration ?? 0.3,
      type: "spring",
      stiffness: 100,
      damping: 20,
    };
  };

  return (
    // <HydrateClient>
    <AnimatePresence>
      <div className="overflow-x-hidden">
        <header className="bg-background/70 sticky top-0 z-20 flex justify-between border-b px-10 py-5 backdrop-blur-lg sm:px-20">
          <Link href="/">
            <Image
              src={"/next-oral.png"}
              width="40"
              height="40"
              className="size-10"
              alt="Next oral"
            />
          </Link>

          <WaitlistFormField withDialog={true}>
            <Button>Join the Waitlist</Button>
          </WaitlistFormField>
        </header>

        <main>
          <section className="from-primary/15 to-primary/5 border-y bg-gradient-to-b from-5% sm:px-20">
            <div className="container mx-auto flex flex-col items-center justify-center gap-20 py-32 sm:px-20 md:border-x">
              <div className="max-sm:px-14">
                <motion.div
                  initial={{ opacity: 0, translateY: -100 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -100 }}
                  transition={transitionValues}
                >
                  <h1 className="text-foreground max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
                    The{" "}
                    <span className="text-primary relative whitespace-nowrap">
                      <span className="relative">Easiest Way</span>
                    </span>{" "}
                    to Run Your Clinic Operation.
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, rotateY: -100 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  transition={transitionValues}
                >
                  <p className="text-foreground/60 text-sm:text-sm mt-6 max-w-2xl text-center tracking-tight sm:text-base md:text-lg">
                    Manage your all your Bookings, Appointments, Patients,
                    Treatments and Payments in one dashboard. See all your
                    business insights at a glance.
                  </p>
                </motion.div>

                <div className="mt-10 flex flex-wrap justify-center gap-6">
                  <motion.div
                    initial={{ opacity: 0, translateX: -100 }}
                    whileInView={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: -100 }}
                    transition={transitionValues(0.5)}
                  >
                    <WaitlistFormField withDialog={true}>
                      <Button className="max-sm:min-w-full">
                        Join the Waitlist
                      </Button>
                    </WaitlistFormField>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, translateX: 100 }}
                    whileInView={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: 100 }}
                    transition={transitionValues(0.5)}
                  >
                    <Button
                      asChild
                      variant="secondary"
                      className="max-sm:min-w-full"
                    >
                      <Link href="/">Contact sales</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="max-sm:px-2">
                <Image
                  src={DashboardHeroImg}
                  loading={"lazy"}
                  alt="Dashboard Hero"
                />
              </div>
            </div>
          </section>

          <section className="border-y px-4 sm:px-20">
            <div className="border-x py-10"></div>
          </section>

          <section className="border-y px-4 sm:px-20">
            <div className="border-x pt-10">
              <div className="grid grid-cols-1 items-center justify-between border-b md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, translateX: 100 }}
                  whileInView={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: 100 }}
                  transition={transitionValues(0.5)}
                >
                  <div className="flex flex-col gap-4 px-5 max-md:mb-10">
                    <div className="bg-primary/30 text-primary size-fit rounded-sm p-2 text-xs font-medium">
                      01
                    </div>
                    <h2 className="text-2xl font-semibold sm:text-3xl md:text-[40px]">
                      Advanced Patient Records Management
                    </h2>
                    <p className="text-foreground/60 text-sm font-normal sm:text-base md:text-lg">
                      Next Oral revolutionizes how you maintain and access
                      patient information.
                    </p>
                  </div>
                </motion.div>

                <div>
                  <Image src={PatientsImg} alt="patients" />
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 items-center justify-between border-b pb-16 md:mt-20 md:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <div className="bg-primary/30 text-primary ml-4 size-fit rounded-sm p-2 text-xs font-medium md:hidden">
                    02
                  </div>
                  <Image src={ScheduleImg} alt="schedule page" />
                </div>

                <motion.div
                  initial={{ opacity: 0, translateX: -100 }}
                  whileInView={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -100 }}
                  transition={transitionValues(0.5)}
                >
                  <div className="flex flex-col gap-4 px-5 max-md:mt-10">
                    <div className="bg-primary/30 text-primary size-fit rounded-sm p-2 text-xs font-medium max-md:hidden">
                      02
                    </div>
                    <h2 className="text-2xl font-semibold sm:text-3xl md:text-[40px]">
                      Treatment Plan Oversight
                    </h2>
                    <p className="text-foreground/60 text-sm font-normal sm:text-base md:text-lg">
                      Keep your entire team aligned with comprehensive treatment
                      oversight.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 items-center justify-between md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, translateX: 100 }}
                  whileInView={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: 100 }}
                  transition={transitionValues(0.5)}
                >
                  <div className="flex flex-col gap-4 px-5 max-md:mt-10">
                    <div className="bg-primary/30 text-primary size-fit rounded-sm p-2 text-xs font-medium">
                      03
                    </div>
                    <h2 className="text-2xl font-semibold sm:text-3xl md:text-[40px]">
                      Revolutionary Appointment Management
                    </h2>
                    <p className="text-foreground/60 text-sm font-normal sm:text-base md:text-lg">
                      Next Oral's intelligent scheduling system transforms how
                      you manage appointments
                    </p>
                  </div>
                </motion.div>

                <div>
                  <Image src={CalendarImg} alt="calendar page" />
                </div>
              </div>

              <div className="from-primary/15 to-primary/5 mt-20 flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-5% px-4 py-[100px] sm:px-20">
                <h5 className="text-primary text-sm font-medium uppercase">
                  Discover More
                </h5>
                <motion.div
                  initial={{ opacity: 0, translateY: 100 }}
                  whileInView={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: 100 }}
                  transition={transitionValues(0.5)}
                >
                  <h2 className="text-center text-3xl font-semibold md:max-w-xl md:text-[50px]">
                    Join the Waitlist Today. Don't miss out!
                  </h2>
                </motion.div>
                <p className="text-foreground/60 text-center text-base md:max-w-xl md:text-lg">
                  Be the first to know when we launch
                </p>

                <WaitlistFormField />
              </div>
            </div>
          </section>
        </main>
        <footer className="from-background to-primary/5 bg-gradient-to-b from-5% px-4 py-[40px] text-center font-light sm:px-20">
          &copy; {new Date().getFullYear()} NextOral
        </footer>
      </div>
    </AnimatePresence>
    // </HydrateClient>
  );
}
