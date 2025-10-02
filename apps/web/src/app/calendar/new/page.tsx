import { cn } from "@repo/design/src/lib/utils";

import { Cal } from "./_component/cal";

const dummyDentists = [
  {
    id: 1,
    name: "Martial Arts",
  },
  {
    id: 2,
    name: "Coding",
  },
  {
    id: 3,
    name: "Reading",
  },
  {
    id: 4,
    name: "Writing",
  },
  {
    id: 5,
    name: "Gaming",
  },
];

export default function AppointmentPage() {
  return <Cal />;
  return (
    <div className="flex p-4">
      {dummyDentists.map((dentist) => (
        <div className="w-40 last:border-r-1">
          <Dentist
            key={dentist.id}
            dentist={dentist}
            className="border-r-0 border-b-0"
          />
          <Appointment key={dentist.id} dentist={dentist} />
        </div>
      ))}
    </div>
  );
}

function Dentist({
  dentist,
  className = "",
}: {
  dentist: { id: number; name: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 border bg-red-300",
        className,
      )}
    >
      <span className="w-full text-center">{dentist.name}</span>
    </div>
  );
}
const Appointment = ({
  dentist,
  className = "",
}: {
  dentist: { id: number; name: string };
  className?: string;
}) => {
  return <div className={cn("h-40 border border-r-0", className)}></div>;
};
