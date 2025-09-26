export type CalendarView = "Day" | "Week";

export interface Appointment {
    id: number;
    dentistId: number;
    patientName: string;
    startTime: string;
    endTime: string;
    date: string;
    color: {
        stickerColor: string;
        lineColor: string;
    } | undefined;
}

export interface Dentist {
    id: number;
    name: string;
    avatar: string;
    startDate: string;
}