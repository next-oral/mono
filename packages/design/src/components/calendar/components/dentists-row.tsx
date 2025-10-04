import { cn, truncateText } from "@repo/design/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { COLUMN_WIDTH } from "../constants";
import { useCalendarStore } from "../store/store";

/**
 * This Shows the dentists in a row at the top of the calendar with their appointment count for the day.
 * @returns JSX Element
 */
export function DentistsRow() {
  const { selectedDentists, appointments, currentDate, getFilteredDentists } =
    useCalendarStore();
  const dentists = getFilteredDentists();

  return (
    <div className={cn("flex w-full flex-1 flex-row items-center text-center")}>
      {dentists.map(({ id, name, avatar, startDate }) => (
        <Tooltip key={id}>
          <TooltipTrigger
            className="w-full flex-1"
            style={{
              width:
                selectedDentists.length !== 1 ? `${COLUMN_WIDTH}px` : "100%",
            }}
          >
            <div className="border-secondary-foreground/10 flex h-8 w-full items-center justify-center border text-xs font-medium capitalize">
              Dr.{" "}
              {selectedDentists.length != 1
                ? truncateText(String(name.split(" ")[0]), 10)
                : name}
              <Badge className="ml-2 size-4 text-[9px]" variant={"secondary"}>
                {
                  appointments.filter((appointment) => {
                    const localDateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
                    return (
                      appointment.dentistId === id &&
                      appointment.date === localDateKey
                    );
                  }).length
                }{" "}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <div className="flex items-center gap-1">
                <Avatar>
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="bg-background text-foreground font-medium uppercase">
                    {name.split(" ")[0]?.charAt(0)}
                    {name.split(" ")[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground capitalize">{name}</span>
              </div>
              <span className="text-foreground font-medium">
                Since: {startDate}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
