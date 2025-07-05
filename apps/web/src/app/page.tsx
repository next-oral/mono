import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/design/src/components/ui/button";
import {
  CalendarImg,
  DashboardHeroImg,
  PatientsImg,
  ScheduleImg,
} from "~/images/screenshots";
import { HydrateClient } from "~/trpc/server";
import { Input } from "@repo/design/src/components/ui/input";

// const waitlistFormSchema = z.object({
//   email: z.string().email("Please provide a valid email"),
// });

// type WaitlistForm = z.infer<typeof waitlistFormSchema>;

export default function HomePage() {
  // const waitlistForm = useForm<WaitlistForm>({
  //   resolver: zodResolver(waitlistFormSchema),
  //   defaultValues: {
  //     email: "",
  //   },
  // });

  // const handleWaitlistSubmit = (values: WaitlistForm) => {
  //   try {
  //     console.log(values);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <HydrateClient>
      <div>
        <header className="bg-background/70 sticky top-0 z-20 grid grid-cols-2 border-b px-10 py-5 backdrop-blur-lg sm:px-20">
          <Link href="/">
            <Image
              src="/next-oral.png"
              width="10"
              height="10"
              className="size-10"
              alt="Next Oral"
            />
            {/* Next Oral */}
          </Link>

          <Button asChild className="ml-auto size-fit">
            <Link href="/login">Join the Waitlist</Link>
          </Button>
        </header>

        <main>
          <section className="from-primary/15 to-primary/5 border-y bg-gradient-to-b from-5% sm:px-20">
            <div className="container mx-auto flex flex-col items-center justify-center gap-20 py-32 sm:px-20 md:border-x">
              <div className="max-sm:px-14">
                <h1 className="text-foreground max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
                  The{" "}
                  <span className="text-primary relative whitespace-nowrap">
                    <span className="relative">Easiest Way</span>
                  </span>{" "}
                  to Run Your Clinic Operation.
                </h1>
                <p className="text-foreground/60 text-sm:text-sm mt-6 max-w-2xl text-center tracking-tight sm:text-base md:text-lg">
                  Manage your all your Bookings, Appointments, Patients,
                  Treatments and Payments in one dashboard. See all your
                  business insights at a glance.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-6">
                  <Button asChild className="max-sm:min-w-full">
                    <Link href="/login">Join the Waitlist</Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="max-sm:min-w-full"
                  >
                    <Link href="/">Contact sales</Link>
                  </Button>
                </div>
              </div>

              <div className="max-sm:px-2">
                <Image
                  src={DashboardHeroImg}
                  quality={100}
                  loading={"lazy"}
                  unoptimized={true}
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

                <div className="">
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
              </div>

              <div className="grid grid-cols-1 items-center justify-between md:grid-cols-2">
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

                <div>
                  <Image src={CalendarImg} alt="calendar page" />
                </div>
              </div>

              <div className="from-primary/15 to-primary/5 mt-20 flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-5% px-4 py-[100px] sm:px-20">
                <h5 className="text-primary text-sm font-medium uppercase">
                  Discover More
                </h5>
                <h2 className="text-center text-3xl font-semibold md:max-w-xl md:text-[50px]">
                  Join the Waitlist Today. Don't miss out!
                </h2>
                <p className="text-foreground/60 text-base md:max-w-xl md:text-lg">
                  Be the first to know when we launch
                </p>

                  <form className="flex items-center gap-1 max-sm:flex-col max-sm:*:w-full">

                    <Input className="bg-background py-3 px-4" placeholder="Enter your email" inputMode="email" />
                    <Button>Join The Waitlist</Button>
                  </form>
              </div>
            </div>
          </section>
        </main>
        <footer className="from-background to-primary/5 bg-gradient-to-b from-5% px-4 py-[40px] sm:px-20 text-center font-light">
          &copy; {new Date().getFullYear()} NextOral
        </footer>
      </div>
    </HydrateClient>
  );
}
