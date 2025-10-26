import { HugeIcons } from "@repo/design/icons";
import { cn } from "@repo/design/lib/utils";
import { ToothTypes } from "@repo/design/types/tooth";

import { Badge } from "../ui/badge";

type ToothItemProps = {
  type: ToothTypes;
  tooth: ToothTypes | null;
  setTooth: (tooth: ToothTypes) => void;
  appointmentsCount: number;
};

export function ToothItem({
  type,
  tooth,
  setTooth,
  appointmentsCount,
}: ToothItemProps) {
  const baseName = type.split(" ").slice(0, -1).join(" "); // Remove the quadrant suffix
  const displayName = baseName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const getIconComponent = () => {
    switch (baseName) {
      case "central incisor":
        return HugeIcons.CentralIncisor;
      case "lateral incisor":
        return HugeIcons.LateralIncisor;
      case "canine":
        return HugeIcons.Canine;
      case "first premolar":
        return HugeIcons.FirstPremolar;
      case "second premolar":
        return HugeIcons.SecondPremolar;
      case "first molar":
        return HugeIcons.FirstMolar;
      case "second molar":
        return HugeIcons.SecondMolar;
      case "third molar":
        return HugeIcons.ThirdMolar;
      default:
        return HugeIcons.CentralIncisor;
    }
  };

  const Icon = getIconComponent();

  return (
    <div className="flex w-[80px] flex-col gap-1">
      <div
        className={cn(
          "relative flex w-full cursor-pointer justify-center rounded-lg border border-dashed bg-slate-100 p-4 dark:bg-slate-900",
          { "border-blue-500 bg-blue-100 dark:bg-blue-900": tooth === type },
        )}
        onClick={() => setTooth(type)}
      >
        {appointmentsCount > 0 && (
          <Badge className="border-background absolute -top-2 -right-2 h-5 min-w-5 rounded-full border-2 px-1 font-mono text-[7px] tabular-nums">
            {appointmentsCount}
          </Badge>
        )}
        <Icon />
      </div>
      <h4 className="text-[10px] font-light">{displayName}</h4>
    </div>
  );
}
