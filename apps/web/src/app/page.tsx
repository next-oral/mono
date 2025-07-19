import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";

import { Button } from "@repo/design/src/components/ui/button";

import {
  CalendarImg,
  DashboardHeroImg,
  PatientImg,
  ScheduleImg,
} from "~/images/screenshots";
import { WaitlistForm } from "./waitlist-form";

const transitionValues = {
  duration: 0.5,
  type: "spring",
  stiffness: 100,
  damping: 20,
};
export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <header className="bg-background/70 fixed top-0 right-0 left-0 z-20 flex justify-between border-b px-2 py-2 backdrop-blur-lg max-md:px-2 sm:px-20">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/next-oral.svg"
            width="40"
            height="40"
            className="size-10"
            alt="Next oral"
          />
          <span className="text-2xl font-medium">Next Oral</span>
        </Link>

        <WaitlistForm withDialog={true}>
          <Button>Join the Waitlist</Button>
        </WaitlistForm>
      </header>

      <main>
        {/* Hero Section */}
        <section className="from-primary/15 to-primary/0 border-y bg-gradient-to-b from-5%">
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
                  transition={transitionValues}
                >
                  <WaitlistForm withDialog={true}>
                    <Button className="max-sm:min-w-full">
                      Join the Waitlist
                    </Button>
                  </WaitlistForm>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, translateX: 100 }}
                  whileInView={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: 100 }}
                  transition={transitionValues}
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
                src={DashboardHeroImg as string}
                loading={"lazy"}
                alt="Dashboard Hero"
              />
            </div>
          </div>
        </section>

        <section className="border-y px-4 sm:px-20">
          <div className="border-x pt-10">
            <div className="grid grid-cols-1 items-center justify-between border-b md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, translateX: 100 }}
                whileInView={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 100 }}
                transition={transitionValues}
              >
                <div className="flex flex-col gap-4 px-5 max-md:mb-10">
                  <div className="bg-primary/30 text-primary size-fit rounded-sm p-2 text-xs font-medium">
                    01
                  </div>
                  <h2 className="text-2xl font-semibold sm:text-3xl md:text-[40px]">
                    Advanced Patient Records Management
                  </h2>
                  <p className="text-foreground/60 text-sm font-normal sm:text-base md:text-lg">
                    Next Oral revolutionizes how you maintain and access patient
                    information.
                  </p>
                </div>
              </motion.div>

              <div>
                <Image
                  src={PatientImg as string}
                  alt="Patient Overview on Next Oral"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 items-center justify-between border-b pb-16 md:mt-20 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="bg-primary/30 text-primary ml-4 size-fit rounded-sm p-2 text-xs font-medium md:hidden">
                  02
                </div>
                <Image src={ScheduleImg as string} alt="schedule page" />
              </div>

              <motion.div
                initial={{ opacity: 0, translateX: -100 }}
                whileInView={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -100 }}
                transition={transitionValues}
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
                transition={transitionValues}
              >
                <div className="flex flex-col gap-4 px-5 max-md:mt-10">
                  <div className="bg-primary/30 text-primary size-fit rounded-sm p-2 text-xs font-medium">
                    03
                  </div>
                  <h2 className="text-2xl font-semibold sm:text-3xl md:text-[40px]">
                    Revolutionary Appointment Management
                  </h2>
                  <p className="text-foreground/60 text-sm font-normal sm:text-base md:text-lg">
                    Next Oral's intelligent scheduling system transforms how you
                    manage appointments
                  </p>
                </div>
              </motion.div>

              <div>
                <Image src={CalendarImg as string} alt="calendar page" />
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
                transition={transitionValues}
              >
                <h2 className="text-center text-3xl font-semibold md:max-w-xl md:text-[50px]">
                  Join the Waitlist Today. Don't miss out!
                </h2>
              </motion.div>
              <p className="text-foreground/60 text-center text-base md:max-w-xl md:text-lg">
                Be the first to know when we launch
              </p>

              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="from-background to-primary/5 bg-gradient-to-b from-5% px-4 py-[40px] text-center font-light sm:px-20">
        &copy; {new Date().getFullYear()} NextOral
      </footer>
    </div>
  );
}
