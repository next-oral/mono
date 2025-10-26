import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
    Maximize2,
    Minimize2,
    OctagonX,
    ScrollTextIcon,
    UserSquare,
} from "lucide-react";

import { cn } from "@repo/design/lib/utils";
import { ToothTypes } from "@repo/design/types/tooth";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ToothItem } from "./tooth-item";

type Appointment = {
    id: string;
    dentistId: string;
    treatment: string;
    patientNote: string;
    doctorNote: string;
    numberOfProcedure: number;
    teeth: ToothTypes[];
    createdAt: string; // ISO timestamp
};

const appointments: Appointment[] = [
    // Upper Left (UL)
    {
        id: "appt-1",
        dentistId: "0fgBBT3",
        treatment: "Filling",
        patientNote: "Pain when biting",
        doctorNote: "Small occlusal caries",
        numberOfProcedure: 1,
        teeth: ["central incisor ul"],
        createdAt: "2025-10-01T09:15:00.000Z",
    },
    {
        id: "appt-2",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Cleaning",
        patientNote: "Routine cleaning",
        doctorNote: "Good oral hygiene",
        numberOfProcedure: 1,
        teeth: ["lateral incisor ul"],
        createdAt: "2025-10-02T10:00:00.000Z",
    },
    {
        id: "appt-3",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Extraction",
        patientNote: "Mobility",
        doctorNote: "Grade II mobility, extract",
        numberOfProcedure: 1,
        teeth: ["canine ul"],
        createdAt: "2025-10-03T11:30:00.000Z",
    },
    {
        id: "appt-4",
        dentistId: "0fgBBT3",
        treatment: "Crown",
        patientNote: "Fractured tooth",
        doctorNote: "Recommend crown",
        numberOfProcedure: 2,
        teeth: ["first premolar ul"],
        createdAt: "2025-10-04T08:45:00.000Z",
    },
    {
        id: "appt-5",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Root Canal",
        patientNote: "Lingering pain",
        doctorNote: "RCT indicated",
        numberOfProcedure: 3,
        teeth: ["second premolar ul"],
        createdAt: "2025-10-05T13:20:00.000Z",
    },
    {
        id: "appt-6",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Filling",
        patientNote: "Sensitivity to cold",
        doctorNote: "ICC on distal",
        numberOfProcedure: 1,
        teeth: ["first molar ul"],
        createdAt: "2025-10-06T14:10:00.000Z",
    },
    {
        id: "appt-7",
        dentistId: "0fgBBT3",
        treatment: "Onlay",
        patientNote: "Large restoration needed",
        doctorNote: "Onlay recommended",
        numberOfProcedure: 2,
        teeth: ["second molar ul"],
        createdAt: "2025-10-07T15:00:00.000Z",
    },
    {
        id: "appt-8",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Wisdom tooth review",
        patientNote: "No pain",
        doctorNote: "Monitor third molar",
        numberOfProcedure: 0,
        teeth: ["third molar ul"],
        createdAt: "2025-10-08T09:00:00.000Z",
    },

    // Upper Right (UR)
    {
        id: "appt-9",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Filling",
        patientNote: "Small cavity",
        doctorNote: "Sealant possible",
        numberOfProcedure: 1,
        teeth: ["central incisor ur"],
        createdAt: "2025-09-21T09:30:00.000Z",
    },
    {
        id: "appt-10",
        dentistId: "0fgBBT3",
        treatment: "Orthodontic consult",
        patientNote: "Crowding",
        doctorNote: "Refer to ortho",
        numberOfProcedure: 0,
        teeth: ["lateral incisor ur"],
        createdAt: "2025-09-22T10:15:00.000Z",
    },
    {
        id: "appt-11",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Extraction",
        patientNote: "Impacted",
        doctorNote: "Surgical removal considered",
        numberOfProcedure: 2,
        teeth: ["canine ur"],
        createdAt: "2025-09-23T11:45:00.000Z",
    },
    {
        id: "appt-12",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Crown prep",
        patientNote: "Old crown failing",
        doctorNote: "New crown planned",
        numberOfProcedure: 2,
        teeth: ["first premolar ur"],
        createdAt: "2025-09-24T08:20:00.000Z",
    },
    {
        id: "appt-13",
        dentistId: "0fgBBT3",
        treatment: "Bridge",
        patientNote: "Replace missing tooth",
        doctorNote: "Consider 3-unit bridge",
        numberOfProcedure: 3,
        teeth: ["second premolar ur"],
        createdAt: "2025-09-25T12:00:00.000Z",
    },
    {
        id: "appt-14",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Scaling",
        patientNote: "Gum bleeding",
        doctorNote: "SRP recommended",
        numberOfProcedure: 1,
        teeth: ["first molar ur"],
        createdAt: "2025-09-26T13:10:00.000Z",
    },
    {
        id: "appt-15",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Onlay",
        patientNote: "Large occlusal defect",
        doctorNote: "Partial coverage",
        numberOfProcedure: 2,
        teeth: ["second molar ur"],
        createdAt: "2025-09-27T14:45:00.000Z",
    },
    {
        id: "appt-16",
        dentistId: "0fgBBT3",
        treatment: "Wisdom tooth extraction",
        patientNote: "Pericoronitis",
        doctorNote: "Remove third molar",
        numberOfProcedure: 2,
        teeth: ["third molar ur"],
        createdAt: "2025-09-28T09:05:00.000Z",
    },

    // Lower Left (LL)
    {
        id: "appt-17",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Filling",
        patientNote: "Food trap",
        doctorNote: "Composite restoration",
        numberOfProcedure: 1,
        teeth: ["central incisor ll"],
        createdAt: "2025-08-15T09:00:00.000Z",
    },
    {
        id: "appt-18",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Veneer consult",
        patientNote: "Discoloration",
        doctorNote: "Consider veneers",
        numberOfProcedure: 0,
        teeth: ["lateral incisor ll"],
        createdAt: "2025-08-16T10:30:00.000Z",
    },
    {
        id: "appt-19",
        dentistId: "0fgBBT3",
        treatment: "Root Canal",
        patientNote: "Persistent pain",
        doctorNote: "RCT performed",
        numberOfProcedure: 3,
        teeth: ["canine ll"],
        createdAt: "2025-08-17T11:15:00.000Z",
    },
    {
        id: "appt-20",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Crown",
        patientNote: "Large fracture",
        doctorNote: "Full coverage",
        numberOfProcedure: 2,
        teeth: ["first premolar ll"],
        createdAt: "2025-08-18T08:50:00.000Z",
    },
    {
        id: "appt-21",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Filling",
        patientNote: "New cavity",
        doctorNote: "Restore with composite",
        numberOfProcedure: 1,
        teeth: ["second premolar ll"],
        createdAt: "2025-08-19T13:00:00.000Z",
    },
    {
        id: "appt-22",
        dentistId: "0fgBBT3",
        treatment: "Extraction",
        patientNote: "Severe decay",
        doctorNote: "Remove tooth",
        numberOfProcedure: 1,
        teeth: ["first molar ll"],
        createdAt: "2025-08-20T14:30:00.000Z",
    },
    {
        id: "appt-23",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Onlay",
        patientNote: "Large restoration",
        doctorNote: "Indirect onlay",
        numberOfProcedure: 2,
        teeth: ["second molar ll"],
        createdAt: "2025-08-21T15:40:00.000Z",
    },
    {
        id: "appt-24",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Wisdom review",
        patientNote: "Asymptomatic",
        doctorNote: "No action required",
        numberOfProcedure: 0,
        teeth: ["third molar ll"],
        createdAt: "2025-08-22T09:20:00.000Z",
    },

    // Lower Right (LR)
    {
        id: "appt-25",
        dentistId: "0fgBBT3",
        treatment: "Filling",
        patientNote: "Small pit",
        doctorNote: "Sealant considered",
        numberOfProcedure: 1,
        teeth: ["central incisor lr"],
        createdAt: "2025-07-10T09:10:00.000Z",
    },
    {
        id: "appt-26",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Cleaning",
        patientNote: "Routine",
        doctorNote: "No issues",
        numberOfProcedure: 1,
        teeth: ["lateral incisor lr"],
        createdAt: "2025-07-11T10:40:00.000Z",
    },
    {
        id: "appt-27",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Extraction",
        patientNote: "Crowding",
        doctorNote: "Consider removal",
        numberOfProcedure: 1,
        teeth: ["canine lr"],
        createdAt: "2025-07-12T11:55:00.000Z",
    },
    {
        id: "appt-28",
        dentistId: "0fgBBT3",
        treatment: "Crown",
        patientNote: "Old large restoration",
        doctorNote: "Replace crown",
        numberOfProcedure: 2,
        teeth: ["first premolar lr"],
        createdAt: "2025-07-13T08:35:00.000Z",
    },
    {
        id: "appt-29",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Bridge",
        patientNote: "Replace missing",
        doctorNote: "Plan bridge",
        numberOfProcedure: 3,
        teeth: ["second premolar lr"],
        createdAt: "2025-07-14T12:25:00.000Z",
    },
    {
        id: "appt-30",
        dentistId: "2UcBmBtpBdNH",
        treatment: "Onlay",
        patientNote: "Failed filling",
        doctorNote: "Indirect onlay",
        numberOfProcedure: 2,
        teeth: ["first molar lr"],
        createdAt: "2025-07-15T13:55:00.000Z",
    },
    {
        id: "appt-31",
        dentistId: "0fgBBT3",
        treatment: "Filling",
        patientNote: "Recurrent decay",
        doctorNote: "Replace restoration",
        numberOfProcedure: 1,
        teeth: ["second molar lr"],
        createdAt: "2025-07-16T14:05:00.000Z",
    },
    // appointment covering multiple teeth
    {
        id: "appt-32",
        dentistId: "1u7BnEn4NKmVjqAcrQ1",
        treatment: "Plaque control & composite",
        patientNote: "General sensitivity",
        doctorNote: "Treat 3 anterior teeth",
        numberOfProcedure: 2,
        teeth: ["central incisor ul", "central incisor ur", "central incisor lr"],
        createdAt: "2025-10-09T10:00:00.000Z",
    },
];

interface MedicalRecordsProps {
    dentists: {
        readonly id: string;
        readonly orgId: string;
        readonly firstName: string;
        readonly lastName: string;
        readonly email: string | null;
        readonly phone: string | null;
        readonly specialization: string | null;
        readonly licenseNumber: string;
        readonly createdAt: number | null;
        readonly updatedAt: number;
    }[];
}

export function MedicalRecords({ dentists = [] }: MedicalRecordsProps) {
    const [tooth, setTooth] = useState<ToothTypes | null>(null);
    const targetDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!tooth) return;
        if (targetDivRef.current) {
            targetDivRef.current.scrollIntoView({
                behavior: "smooth", // For a smooth scrolling effect
                block: "start", // Aligns the top of the element to the top of the viewport
            });
        }
    }, [tooth]);

    function findDentist(dentistId: string) {
        const dentist = dentists.find((dentist) => dentist.id == dentistId);

        return (
            <Suspense>
                <div className="flex items-center gap-1">
                    <Avatar>
                        {/* <AvatarImage src={dentist.} /> */}
                        <AvatarFallback className="bg-secondary/70">
                            {dentist?.firstName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <h4 className="capitalize">
                        dr. {dentist?.firstName} {dentist?.lastName}
                    </h4>
                </div>
            </Suspense>
        );
    }

    const filteredAppointments = useMemo(() => {
        if (!tooth) {
            return [];
        }

        // This filtering logic only runs when 'appointments' or 'tooth' changes.
        return appointments.filter((appointment) =>
            appointment.teeth.includes(tooth),
        );
    }, [appointments, tooth]);
    const hasResults = filteredAppointments.length > 0;

    return (
        <div className="flex w-full max-lg:flex-wrap-reverse">
            <div
                ref={targetDivRef}
                className={cn("w-full px-2 pt-5 sm:px-4 lg:basis-[80%]")}
            >
                <h5 className="text-[10px] opacity-70">Treatment history</h5>

                {(!tooth || !hasResults) && (
                    <div className="mt-[40%] flex h-full w-full justify-center">
                        <div className="relative flex flex-col items-center gap-3">
                            <div className="bg-background border-secondary-foreground/40 text-secondary-foreground rounded-xl border p-3 opacity-70 shadow-[7px_5px_0px_0px_rgba(0,_0,_0,_0.1)]">
                                {!tooth ? <UserSquare /> : <OctagonX />}
                            </div>
                            <p className="max-w-[170px] text-center text-sm opacity-70">
                                {!tooth
                                    ? "Select a tooth to see the treatment history"
                                    : "No appointment found for this tooth"}
                            </p>
                        </div>
                    </div>
                )}

                {tooth && hasResults && (
                    <div className="sticky top-20 mt-4 w-full flex-col gap-8">
                        {appointments
                            .filter((appointment) => appointment.teeth.includes(tooth))
                            .map((appointment, index) => (
                                <div key={index} className="mt-4 flex flex-col">
                                    <div className="flex items-center">
                                        <Badge
                                            variant={"secondary"}
                                            className="h-5 min-w-5 rounded-full border-2 px-1 font-mono text-[9px] tabular-nums opacity-60 invert"
                                        >
                                            {index + 1}
                                        </Badge>
                                        <span className="h-[1px] w-full border-t-2 border-dashed opacity-50" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <div className="flex h-auto flex-col gap-2">
                                            <div className="flex flex-col gap-0.5">
                                                <h4 className="text-xs opacity-70">Date and Time</h4>
                                                <Suspense>
                                                    <h2 className="text-sm font-medium">
                                                        {format(
                                                            new Date(String(appointment.createdAt)),
                                                            "E d LLL, yyyy. h:mm - h:mm:b",
                                                        )}
                                                    </h2>
                                                </Suspense>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <h4 className="text-xs opacity-70">Treatment</h4>
                                                <Suspense>
                                                    <h2 className="text-sm font-medium">
                                                        {appointment.treatment}
                                                    </h2>
                                                </Suspense>
                                            </div>

                                            <Note note={appointment.patientNote} type="patient" />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex h-full flex-col gap-0.5">
                                                <h4 className="text-xs opacity-70">Dentist</h4>
                                                <Suspense>
                                                    <h2 className="text-sm font-medium">
                                                        {findDentist(appointment.dentistId)}
                                                    </h2>
                                                </Suspense>
                                            </div>
                                            <div className="flex h-full flex-col gap-0.5">
                                                <h4 className="text-xs opacity-70">Procedures</h4>
                                                <Suspense>
                                                    <h2 className="text-sm font-medium">
                                                        {appointment.numberOfProcedure} Procedure
                                                        {appointment.numberOfProcedure != 1 && "s"}
                                                    </h2>
                                                </Suspense>
                                            </div>

                                            <Note note={appointment.patientNote} type="doctor" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <div className="flex flex-grow flex-col gap-3 bg-slate-50 px-2 py-2 sm:px-4 sm:py-4 dark:bg-slate-950">
                {/* Upper Left (UL) Section */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-foreground/60 text-xs">
                        Upper Left (UL): teeth 1–8
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <ToothItem
                            type="central incisor ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("central incisor ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="lateral incisor ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("lateral incisor ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="canine ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("canine ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first premolar ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first premolar ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second premolar ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second premolar ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first molar ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first molar ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second molar ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second molar ul"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="third molar ul"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("third molar ul"),
                                ).length
                            }
                        />
                    </div>
                </div>

                {/* Upper Right (UR) Section */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-foreground/60 text-xs">
                        Upper Right (UR): teeth 1–8
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <ToothItem
                            type="central incisor ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("central incisor ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="lateral incisor ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("lateral incisor ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="canine ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("canine ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first premolar ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first premolar ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second premolar ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second premolar ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first molar ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first molar ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second molar ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second molar ur"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="third molar ur"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("third molar ur"),
                                ).length
                            }
                        />
                    </div>
                </div>

                {/* Lower Left (LL) Section */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-foreground/60 text-xs">
                        Lower Left (LL): teeth 1–8
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <ToothItem
                            type="central incisor ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("central incisor ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="lateral incisor ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("lateral incisor ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="canine ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("canine ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first premolar ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first premolar ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second premolar ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second premolar ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first molar ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first molar ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second molar ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second molar ll"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="third molar ll"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("third molar ll"),
                                ).length
                            }
                        />
                    </div>
                </div>

                {/* Lower Right (LR) Section */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-foreground/60 text-xs">
                        Lower Right (LR): teeth 1–8
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        <ToothItem
                            type="central incisor lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("central incisor lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="lateral incisor lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("lateral incisor lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="canine lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("canine lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first premolar lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first premolar lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second premolar lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second premolar lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="first molar lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("first molar lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="second molar lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("second molar lr"),
                                ).length
                            }
                        />
                        <ToothItem
                            type="third molar lr"
                            tooth={tooth}
                            setTooth={setTooth}
                            appointmentsCount={
                                appointments.filter((appointment) =>
                                    appointment.teeth.includes("third molar lr"),
                                ).length
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Note({ note, type }: { note: string; type: "patient" | "doctor" }) {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="bg-secondary/60 w-full rounded-md p-2">
            <header className="relative flex items-center justify-between font-light">
                <div className="flex items-center gap-0.5">
                    <ScrollTextIcon className="size-3" />
                    <h4 className="text-xs">
                        {type === "patient" ? "Patient Note" : "Doctor Note"}
                    </h4>
                </div>

                <Button
                    variant="ghost"
                    className="font-light"
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    {isExpanded ? <Minimize2 /> : <Maximize2 />}
                </Button>
            </header>

            <div className="relative">
                <p className="text-sm">
                    {isExpanded
                        ? note
                        : `${note.slice(0, 100)}${note.length > 100 ? "..." : ""}`}
                </p>
                {!isExpanded && (
                    <div className="absolute bottom-0 min-h-[40%] w-full bg-white/5 opacity-80 backdrop-blur-sm" />
                )}
            </div>
        </div>
    );
}
