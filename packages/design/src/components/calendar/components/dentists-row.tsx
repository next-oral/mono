import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { useCalendarStore } from "../store/store";
import { cn, truncateText } from "@repo/design/lib/utils";
import { COLUMN_WIDTH } from "../constants";


/**
 * This Shows the dentists in a row at the top of the calendar with their appointment count for the day.
 * @returns JSX Element
 */
export function DentistsRow() {
    const { selectedDentists, appointments, currentDate, getFilteredDentists } = useCalendarStore();

    return (
        <div className={cn("flex flex-row text-center items-center w-full flex-1")}>
            {getFilteredDentists().map(({ id, name, avatar, startDate }) => (
                <Tooltip key={id}>
                    <TooltipTrigger className="w-full flex-1"
                        style={{ width: selectedDentists.length !== 1 ? `${COLUMN_WIDTH}px` : "100%" }}>
                        <div className="flex w-full items-center h-8 justify-center border border-secondary-foreground/10 capitalize text-xs font-medium" >
                            Dr. {selectedDentists.length != 1 ? truncateText(String(name.split(" ")[0]), 10) : name}
                            <Badge className="size-4 text-[9px] ml-2">{appointments.filter((appointment) => appointment.dentistId === id && appointment.date === new Date(currentDate).toISOString().slice(0, 10)).length}</Badge>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent content="bg-lime-100 fill-lime-100 dark:bg-lime-700 dark:fill-lime-700" className="bg-lime-100 dark:bg-lime-700">
                        <div>
                            <div className="flex gap-1 items-center">
                                <Avatar>
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback className="uppercase bg-background text-foreground font-medium">{name.split(" ")[0]?.charAt(0)}{name.split(" ")[1]?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="capitalize text-foreground">{name}</span>
                            </div>
                            <span className="font-medium text-foreground">Since: {startDate}</span>
                        </div>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
