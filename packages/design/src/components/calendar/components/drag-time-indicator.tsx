import { useCalendarStore } from "../store/store";

// This component shows the indicator for the present start time being dragged to.
export function DragTimeIndicator() {
    const { findActiveAppointment, newStartTime } = useCalendarStore();
    return (
        <div className="fixed z-[999] pointer-events-none top-24 right-6 bg-muted px-3 py-1 rounded shadow">
            Moving {findActiveAppointment()?.patientName} → <strong>{newStartTime}</strong>
        </div>
    );
}
