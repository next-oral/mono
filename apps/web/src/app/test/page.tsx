"use client";
import type { CSSProperties } from "react";
import React, { useRef, useState } from "react";

// Define interfaces for type safety
// This helps in maintaining the code by clearly defining expected props
interface Person {
    id: string;
    name: string;
}

interface CalendarProps {
    people: Person[]; // Array of people for whom columns will be created
}

// Constants for calendar configuration
// These make the code more readable and easier to maintain if values change
const HOURS = [
    "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
];
const TOTAL_HOURS = HOURS.length;
const HOUR_HEIGHT = 100; // Height per hour in pixels
const MINUTE_INTERVAL = 15; // Interval for slots in minutes
const SLOTS_PER_HOUR = 60 / MINUTE_INTERVAL; // 4 slots per hour
const SLOT_HEIGHT = HOUR_HEIGHT / SLOTS_PER_HOUR; // 25px per 15-min slot

// Utility function to convert pixel position to time
// This calculates the start/end time based on y-position in the calendar
const getTimeFromPosition = (y: number, containerHeight: number): { hour: number; minute: number } => {
    const totalMinutes = (y / containerHeight) * (TOTAL_HOURS * 60);
    const hour = Math.floor(totalMinutes / 60);
    const minute = Math.floor((totalMinutes % 60) / MINUTE_INTERVAL) * MINUTE_INTERVAL;
    return { hour, minute };
};

// Utility function to format time as string (e.g., 9:15 AM)
// This ensures consistent time display across the component
const formatTime = (hour: number, minute: number): string => {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
};

// Main Calendar component
// This is the root component that renders the multi-column calendar with selection highlighting
const Calendar: React.FC<CalendarProps> = ({ people }) => {
    // State for selection per person (since each column is independent)
    // We use an object where key is person.id, value is the selection range
    const [selections, setSelections] = useState<Record<string, { start: { hour: number; minute: number }; end: { hour: number; minute: number } | null }>>({});

    // Refs for each column's container to calculate positions
    // This allows us to get bounding rect for accurate position calculations
    const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Function to start selection on mouse down
    // This initializes the selection for a specific person/column
    const handleMouseDown = (personId: string, e: React.MouseEvent) => {
        const columnRef = columnRefs.current[personId];
        if (!columnRef) return;

        const rect = columnRef.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const { hour, minute } = getTimeFromPosition(y, rect.height);

        // Set initial start time, end is null until mouse up
        setSelections(prev => ({
            ...prev,
            [personId]: { start: { hour, minute }, end: null }
        }));

        // Set up mouse move and up listeners for dragging
        const handleMouseMove = (moveE: MouseEvent) => {
            const moveY = moveE.clientY - rect.top;
            const { hour: endHour, minute: endMinute } = getTimeFromPosition(moveY, rect.height);

            // Update end time in real-time as user drags
            setSelections(prev => ({
                ...prev,
                [personId]: { ...prev[personId], end: { hour: endHour, minute: endMinute } }
            }));
        };

        const handleMouseUp = () => {
            // Clean up listeners after selection is complete
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // Function to calculate the style for the highlight div
    // This computes position and height based on start/end times
    const getHighlightStyle = (personId: string): CSSProperties => {
        const selection = selections[personId];
        if (!selection?.end) return { display: "none" };

        // Determine min and max for start/end (allow dragging up or down)
        const startHour = Math.min(selection.start.hour, selection.end.hour);
        const startMinute = selection.start.hour === startHour ? selection.start.minute : selection.end.minute;
        const endHour = Math.max(selection.start.hour, selection.end.hour);
        const endMinute = selection.start.hour === startHour ? selection.end.minute : selection.start.minute;

        // Calculate top position and height in pixels
        const top = (startHour * HOUR_HEIGHT) + (startMinute / MINUTE_INTERVAL) * SLOT_HEIGHT;
        const durationMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute);
        const height = (durationMinutes / MINUTE_INTERVAL) * SLOT_HEIGHT;

        return {
            position: "absolute",
            top: `${top}px`,
            left: 0,
            width: "100%",
            height: `${height}px`,
            backgroundColor: "rgba(0, 123, 255, 0.5)", // Blue like Google Calendar
            borderRadius: "4px",
            color: "white",
            padding: "8px",
            boxSizing: "border-box",
            zIndex: 10,
            pointerEvents: "none" // Allow clicks to pass through if needed
        };
    };

    // Function to get the label text for the highlight
    // This shows "(No title)" and the time range like in the image
    const getLabel = (personId: string): string => {
        const selection = selections[personId];
        if (!selection?.end) return "";

        // Sort start and end times
        const start = selection.start.hour < selection.end.hour ||
            (selection.start.hour === selection.end.hour && selection.start.minute < selection.end.minute)
            ? selection.start : selection.end;
        const end = start === selection.start ? selection.end : selection.start;

        const startStr = formatTime(start.hour, start.minute);
        const endStr = formatTime(end.hour, end.minute);
        return `(No title)\n${startStr} - ${endStr}`;
    };

    return (
        <div style={{ display: "flex", position: "relative" }}>
            {/* Render time labels column */}
            {/* This is the leftmost column showing hours */}
            <div style={{ width: "60px", flexShrink: 0 }}>
                {HOURS.map((hour, index) => (
                    <div key={index} style={{ height: `${HOUR_HEIGHT}px`, borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "8px" }}>
                        {hour}
                    </div>
                ))}
            </div>

            {/* Render columns for each person */}
            {/* Each column is interactive for selection */}
            {people.map(person => (
                <div
                    key={person.id}
                    ref={el => columnRefs.current[person.id] = el}
                    style={{ flex: 1, position: "relative", borderLeft: "1px solid #ddd" }}
                    onMouseDown={e => handleMouseDown(person.id, e)}
                >
                    {/* Render hour slots for the column */}
                    {HOURS.map((_, index) => (
                        <div key={index} style={{ height: `${HOUR_HEIGHT}px`, borderBottom: "1px solid #ddd", position: "relative", background: "blue" }}>
                            {/* Optional: Render sub-slots for 15-min intervals */}
                            {Array.from({ length: SLOTS_PER_HOUR }).map((_, slotIndex) => (
                                <div key={slotIndex} style={{ height: `${SLOT_HEIGHT}px`, borderBottom: slotIndex < SLOTS_PER_HOUR - 1 ? "1px dotted #eee" : "none" }} />
                            ))}
                        </div>
                    ))}

                    {/* Render highlight if selection exists */}
                    <div style={getHighlightStyle(person.id)}>
                        <div style={{ whiteSpace: "pre-line" }}>{getLabel(person.id)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// Usage example (not part of the component, for reference):
export default function TestPage() {
    return (
        <div>
            <Calendar people={[{ id: "1", name: "Person A" }, { id: "2", name: "Person B" }]} />
        </div>
    );
};

