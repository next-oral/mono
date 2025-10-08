import { CalendarViewSelector } from "./calendar-view-selector";
import { DateSelector } from "./date-selector";
import { DentistsSelector } from "./dentists-selector";
import { NewAppointment } from "./new-appointment";

export function CalendarHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-2">
      <DentistsSelector />
      <DateSelector />
      <div className="flex flex-wrap-reverse items-center gap-3">
        <CalendarViewSelector />
        <NewAppointment />
      </div>
    </div>
  );
}
