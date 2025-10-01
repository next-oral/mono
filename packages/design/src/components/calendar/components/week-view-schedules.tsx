import { cn, truncateText } from "@repo/design/lib/utils"
import type { AppointmentGroup } from "@repo/design/types/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { dentistSample } from "../dummy"

export function WeekViewSchedules({
    group,
    top,
    left,
    width,
    height,
    showFullInfo,
}: {
    group: AppointmentGroup
    top: number
    left: number
    width: string | number
    height: number
    showFullInfo: boolean
}) {
    const text = `${group.appointments.length} Scheduled Appointment${group.appointments.length > 1 ? "s" : ""}`
    const duration = `${group.startTime} - ${group.endTime}`;
    const dentists = group.appointments.map((appointment) => appointment.dentistId);

    const uniqueDentists = [...new Set(dentists)];

    function getDentistAvatar() {
        return (
            <div className="flex">
                {dentistSample.filter((dentist) => uniqueDentists.includes(dentist.id)).map((dentist, index) => (
                    <Avatar className={`size-5 border-2 border-popover relative ${index > 0 ? "-ml-2.5" : ""}`}
                        style={{ zIndex: 10 - index }}>
                        <AvatarImage src={dentist.avatar} />
                        <AvatarFallback>{dentist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )).slice(0, 9)
                }
            </div >
        )
    }

    return (
        <div
            className="absolute pointer-events-auto"
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: typeof width === "string" ? width : `${width}px`,
                height: `${height}px`,
                zIndex: 2, // Above slots and highlights
            }}
            data-is-appointment="false"
        >
            <div className="p-2 flex gap-1 rounded-lg shadow-sm dark:shadow-slate-400 bg-slate-100 dark:bg-slate-900" style={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
            }}>
                <div className="flex flex-col gap-[0.2px]">
                    {group.appointments.map((appointment) => (
                        <span className={cn("flex-1 w-1 rounded-lg flex-shrink-0", appointment.color?.lineColor)}></span>
                    )
                    )}
                </div>
                {showFullInfo ? (
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-xs font-medium leading-tight">{text}</h4>
                            <p className="text-[12px] font-medium leading-tight opacity-50">{duration}</p>
                        </div>

                        {getDentistAvatar()}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xs font-medium leading-tight">{truncateText(text, 15)}</h4>
                        <p className="text-[12px] font-medium leading-tight opacity-50">{truncateText(duration, 15)}</p>
                    </div>
                )}
            </div>

        </div>
    );
}
