import { HugeIcons } from "@repo/design/icons";
import { cn } from "@repo/design/lib/utils";
import { Badge } from "../ui/badge";
import { ToothTypes } from "@repo/design/types/tooth";

type ToothItemProps = {
    type: ToothTypes;
    tooth: ToothTypes | null;
    setTooth: (tooth: ToothTypes) => void;
    appointmentsCount: number;
};

export function ToothItem({ type, tooth, setTooth, appointmentsCount }: ToothItemProps) {
    const baseName = type.split(" ").slice(0, -1).join(" "); // Remove the quadrant suffix
    const displayName = baseName.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

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
        <div className="flex flex-col gap-1 w-[80px]">
            <div
                className={cn(
                    "rounded-lg relative w-full border border-dashed bg-slate-100 dark:bg-slate-900 cursor-pointer p-4 flex justify-center",
                    { "bg-blue-100 dark:bg-blue-900 border-blue-500": tooth === type }
                )}
                onClick={() => setTooth(type)}
            >
                {appointmentsCount > 0 &&
                    <Badge className="absolute border-2 border-background h-5 min-w-5 rounded-full px-1 font-mono tabular-nums -top-2 -right-2 text-[7px]">{appointmentsCount}</Badge>
                }
                <Icon />
            </div>
            <h4 className="text-[10px] font-light">{displayName}</h4>
        </div>
    );
}