import { useCalendarStore } from "../store/store";

// This component shows the indicator for the present start time being dragged to.
export function DragTimeIndicator() {
  const { findActiveAppointment, newStartTime } = useCalendarStore();
  const activeAppointment = findActiveAppointment();
  if (!newStartTime) return null;
  return (
    <div className="bg-muted pointer-events-none fixed top-24 right-6 z-[999] rounded px-3 py-1 shadow">
      Moving {activeAppointment?.patientName} → <strong>{newStartTime}</strong>
    </div>
  );
}
