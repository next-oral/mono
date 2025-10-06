import { AppointmentCard } from "@repo/design/components/appointments/appointment-card";
import { DashboardCard } from "@repo/design/components/dashboard/dashboard-card";
import {
  PatientBarChart,
  PatientPieChart,
} from "@repo/design/components/dashboard/patient-chart";
import { Badge } from "@repo/design/src/components/ui/badge";
import { Button } from "@repo/design/src/components/ui/button";
import { HugeIcons } from "@repo/design/src/icons";

import { getSession } from "~/auth/server";
import { DateFilter } from "./date-filter";
import { DoctorsListCard } from "./doctor";

const stats = [
  {
    id: "total-patients",
    title: "Total Patients",
    value: 2000,
    percentage: 10,
    period: "Last 30 days",
    Icon: HugeIcons.UserGroup,
  },
  {
    id: "new-patients",
    title: "New Patients",
    value: 50,
    percentage: -10,
    period: "Last 30 days",
    Icon: HugeIcons.Patients,
  },
  {
    id: "treatments",
    title: "Treatments",
    value: 14200,
    percentage: 10,
    period: "Last 30 days",
    Icon: HugeIcons.Stethoscope,
  },
  {
    id: "appointments",
    title: "Appointments",
    value: 142,
    percentage: 10,
    period: "Last 30 days",
    Icon: HugeIcons.Calendar,
  },
];

const appointments = [
  {
    id: "1",
    date: "2024-05-24",
    name: "Sarah Johnson",
    imageUrl: "https://randomuser.me/api/portraits/women/32.jpg",
    timeStart: "09:00 AM",
    timeEnd: "10:30 AM",
    status: "Completed" as const,
  },
  {
    id: "3",
    date: "2024-05-24",
    name: "Michael Chen",
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
    timeStart: "10:45 AM",
    timeEnd: "12:15 PM",
    status: "In Progress" as const,
  },
  {
    id: "4",
    date: "2024-05-24",
    name: "Emma Rodriguez",
    imageUrl: "https://randomuser.me/api/portraits/women/67.jpg",
    timeStart: "01:00 PM",
    timeEnd: "02:30 PM",
    status: "Cancelled" as const,
  },
  {
    id: "5",
    date: "2024-05-24",
    name: "David Kim",
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    timeStart: "02:45 PM",
    timeEnd: "04:15 PM",
    status: "In Progress" as const,
  },
  {
    id: "6",
    date: "2024-05-24",
    name: "Lisa Patel",
    imageUrl: "https://randomuser.me/api/portraits/women/89.jpg",
    timeStart: "04:30 PM",
    timeEnd: "06:00 PM",
    status: "Completed" as const,
  },
  {
    id: "7",
    date: "2024-05-24",
    name: "James Wilson",
    imageUrl: "https://randomuser.me/api/portraits/men/91.jpg",
    timeStart: "06:15 PM",
    timeEnd: "07:45 PM",
    status: "Cancelled" as const,
  },
];

const doctors = [
  {
    id: "1",
    name: "Dr. Sally Wokman",
    title: "Chief Surgeon",
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    status: "online" as const,
  },
  {
    id: "2",
    name: "Dr. Sally Wokman",
    title: "Chief Surgeon",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "offline" as const,
  },
  {
    id: "3",
    name: "Dr. Sally Wokman",
    title: "Chief Surgeon",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    status: "offline" as const,
  },
  {
    id: "4",
    name: "Dr. Sally Wokman",
    title: "Chief Surgeon",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    status: "online" as const,
  },
  {
    id: "5",
    name: "Dr. Sally Wokman",
    title: "Chief Surgeon",
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    status: "busy" as const,
  },
];

export default async function Page() {
  const session = await getSession();

  if (!session) return <div>Not authorized</div>;

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="my-2">
            <h2 className="text-xl font-medium text-slate-900">
              Good Evening, {session.user.name}
            </h2>
            <p className="text-sm leading-5 text-slate-500">
              Saturday, May 24, 2025.
            </p>
          </div>
          <DateFilter />
        </div>
        <div className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-12">
          {/* Stats Cards Row */}
          <div className="col-span-1 grid auto-rows-min gap-4 md:col-span-12 md:grid-cols-4">
            {stats.map((stat) => (
              <DashboardCard key={stat.id} {...stat} />
            ))}
          </div>

          {/* Patient Chart */}
          <div className="bg-muted/50 col-span-1 min-h-96 rounded-xl md:col-span-12">
            <PatientBarChart
              amount={100}
              percentage={10}
              period="Last 30 days"
            />
          </div>

          {/* Additional Content Areas */}
          <div className="bg-muted/50 col-span-1 overflow-hidden rounded-xl border md:col-span-8">
            <PatientPieChart duration="January - June 2024" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-xl border bg-blue-50 px-4 md:col-span-4">
            <DoctorsListCard doctors={doctors} />
          </div>

          <div className="bg-muted/50 col-span-1 h-96 rounded-xl md:col-span-8">
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <svg
                width="52"
                height="54"
                viewBox="0 0 52 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 6.76562L36 6.76563C44.5604 6.76563 51.5 13.7052 51.5 22.2656V34.2656C51.5 42.826 44.5604 49.7656 36 49.7656H24C15.4396 49.7656 8.5 42.826 8.5 34.2656V22.2656C8.5 13.7052 15.4396 6.76562 24 6.76562Z"
                  fill="#F1F5F9"
                />
                <path
                  d="M24 6.76562L36 6.76563C44.5604 6.76563 51.5 13.7052 51.5 22.2656V34.2656C51.5 42.826 44.5604 49.7656 36 49.7656H24C15.4396 49.7656 8.5 42.826 8.5 34.2656V22.2656C8.5 13.7052 15.4396 6.76562 24 6.76562Z"
                  stroke="#E2E8F0"
                />
                <path
                  d="M16 1H28C36.5604 1 43.5 7.93959 43.5 16.5V28.5C43.5 37.0604 36.5604 44 28 44H16C7.43959 44 0.5 37.0604 0.5 28.5V16.5C0.5 7.93959 7.43959 1 16 1Z"
                  fill="white"
                />
                <path
                  d="M16 1H28C36.5604 1 43.5 7.93959 43.5 16.5V28.5C43.5 37.0604 36.5604 44 28 44H16C7.43959 44 0.5 37.0604 0.5 28.5V16.5C0.5 7.93959 7.43959 1 16 1Z"
                  stroke="#E2E8F0"
                />
                <path
                  d="M15.2731 20.2306C15.2731 16.5344 18.2867 13.5415 21.9998 13.5415C25.713 13.5415 28.7266 16.5345 28.7266 20.2307C28.7267 21.0905 28.7845 21.7393 29.181 22.3226C29.3318 22.5413 29.6176 22.9112 29.8079 23.2086C30.0211 23.5418 30.2293 23.9435 30.3009 24.4117C30.5345 25.939 29.4577 26.9279 28.3853 27.371C24.608 28.9317 19.3916 28.9317 15.6144 27.371C14.542 26.9279 13.4651 25.939 13.6987 24.4117C13.7703 23.9435 13.9786 23.5417 14.1918 23.2086C14.3821 22.9111 14.6679 22.5412 14.8188 22.3225C15.2152 21.7393 15.273 21.0904 15.2731 20.2306Z"
                  fill="#94A3B8"
                />
                <path
                  d="M24.3145 30.7926C23.645 31.2136 22.8488 31.4564 21.9986 31.4564C21.1484 31.4564 20.3521 31.2136 19.6827 30.7926C19.0885 30.4189 18.7914 30.232 18.8953 29.9214C18.9993 29.6108 19.4093 29.6456 20.2292 29.7152C21.4018 29.8147 22.5953 29.8147 23.768 29.7152C24.5879 29.6456 24.9979 29.6108 25.1019 29.9214C25.2058 30.232 24.9087 30.4189 24.3145 30.7926Z"
                  fill="#94A3B8"
                />
              </svg>
              <p className="text-center text-sm text-slate-500">
                You have no patients yet.
              </p>
              <Button variant="outline" size="sm" className="w-fit">
                <HugeIcons.Patients className="size4" />
                Add Patient
              </Button>
            </div>
          </div>
          <div className="col-span-1 overflow-hidden rounded-xl bg-slate-50 md:col-span-4">
            <div className="sticky top-0 z-50 flex h-14 items-center gap-2 bg-slate-50 p-2 backdrop-blur-2xl">
              <Badge className="rounded-sm bg-slate-950 p-1 font-bold">
                {appointments.length}
              </Badge>
              <span className="text-md font-medium">Upcoming Appointments</span>
              <span className="ml-auto text-sm font-medium text-slate-500">
                See all
              </span>
            </div>
            <div className="no-scrollbar flex h-[600px] flex-col gap-2 overflow-y-auto p-2">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} {...appointment} />
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <svg
                    width="52"
                    height="54"
                    viewBox="0 0 52 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 6.76562L36 6.76563C44.5604 6.76563 51.5 13.7052 51.5 22.2656V34.2656C51.5 42.826 44.5604 49.7656 36 49.7656H24C15.4396 49.7656 8.5 42.826 8.5 34.2656V22.2656C8.5 13.7052 15.4396 6.76562 24 6.76562Z"
                      fill="#F1F5F9"
                    />
                    <path
                      d="M24 6.76562L36 6.76563C44.5604 6.76563 51.5 13.7052 51.5 22.2656V34.2656C51.5 42.826 44.5604 49.7656 36 49.7656H24C15.4396 49.7656 8.5 42.826 8.5 34.2656V22.2656C8.5 13.7052 15.4396 6.76562 24 6.76562Z"
                      stroke="#E2E8F0"
                    />
                    <path
                      d="M16 1H28C36.5604 1 43.5 7.93959 43.5 16.5V28.5C43.5 37.0604 36.5604 44 28 44H16C7.43959 44 0.5 37.0604 0.5 28.5V16.5C0.5 7.93959 7.43959 1 16 1Z"
                      fill="white"
                    />
                    <path
                      d="M16 1H28C36.5604 1 43.5 7.93959 43.5 16.5V28.5C43.5 37.0604 36.5604 44 28 44H16C7.43959 44 0.5 37.0604 0.5 28.5V16.5C0.5 7.93959 7.43959 1 16 1Z"
                      stroke="#E2E8F0"
                    />
                    <path
                      d="M15.2731 20.2306C15.2731 16.5344 18.2867 13.5415 21.9998 13.5415C25.713 13.5415 28.7266 16.5345 28.7266 20.2307C28.7267 21.0905 28.7845 21.7393 29.181 22.3226C29.3318 22.5413 29.6176 22.9112 29.8079 23.2086C30.0211 23.5418 30.2293 23.9435 30.3009 24.4117C30.5345 25.939 29.4577 26.9279 28.3853 27.371C24.608 28.9317 19.3916 28.9317 15.6144 27.371C14.542 26.9279 13.4651 25.939 13.6987 24.4117C13.7703 23.9435 13.9786 23.5417 14.1918 23.2086C14.3821 22.9111 14.6679 22.5412 14.8188 22.3225C15.2152 21.7393 15.273 21.0904 15.2731 20.2306Z"
                      fill="#94A3B8"
                    />
                    <path
                      d="M24.3145 30.7926C23.645 31.2136 22.8488 31.4564 21.9986 31.4564C21.1484 31.4564 20.3521 31.2136 19.6827 30.7926C19.0885 30.4189 18.7914 30.232 18.8953 29.9214C18.9993 29.6108 19.4093 29.6456 20.2292 29.7152C21.4018 29.8147 22.5953 29.8147 23.768 29.7152C24.5879 29.6456 24.9979 29.6108 25.1019 29.9214C25.2058 30.232 24.9087 30.4189 24.3145 30.7926Z"
                      fill="#94A3B8"
                    />
                  </svg>

                  <p className="text-center text-sm text-slate-500">
                    No appointments
                  </p>
                  <Button variant="outline" size="sm" className="w-fit">
                    <HugeIcons.CalendarAdd className="size4" />
                    Create Appointment
                  </Button>
                  {/* </Calendar> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
