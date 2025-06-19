import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Card } from "@repo/design/src/components/ui/card";
import { cn } from "@repo/design/src/lib/utils";

interface Doctor {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  status: "online" | "offline" | "busy";
}

interface DoctorsListCardProps {
  doctors: Doctor[];
  onSeeAll?: () => void;
}

const statusColor = {
  online: "bg-green-500",
  offline: "bg-gray-300",
  busy: "bg-red-500",
};

export function DoctorsListCard({ doctors, onSeeAll }: DoctorsListCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl border-none bg-transparent shadow-none">
      <div className="font-medium text-gray-500">Doctors</div>
      <div className="no-scrollbar h-60 space-y-4 overflow-y-auto">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
      <button
        className="text-sm text-gray-500 hover:underline"
        onClick={onSeeAll}
      >
        See all
      </button>
    </Card>
  );
}

export const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="leading-tight font-semibold text-gray-900">
          {doctor.name}
        </div>
        <div className="text-xs text-gray-500">{doctor.title}</div>
      </div>
      <div className="relative">
        <Avatar className="size-10">
          <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
          <AvatarFallback className="capitalize">
            {doctor.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute right-0 bottom-0 block h-3 w-3 rounded-full border-2 border-white",
            statusColor[doctor.status],
          )}
        />
      </div>
    </div>
  );
};
