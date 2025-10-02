"use client";
import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { convert24hTo12h, getScheduleDuration } from "@repo/design/lib/calendar";
import { cn, truncateText } from "@repo/design/lib/utils";
import type { Appointment } from "@repo/design/types/calendar";
import { Maximize2, Minimize2, Notebook, Repeat1, TimerIcon, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { useCalendarStore } from "../store/store";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";

// This component is to display the appointments and allow drag/drop features on it.

const patientNote = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sed repudiandae quis quisquam modi doloremque laudantium perspiciatis corrupti excepturi laborum. Recusandae natus obcaecati id magni, amet, error possimus alias unde odio deleniti enim ab eum animi ad dolor provident, inventore consectetur molestias nostrum vero corporis. Animi sed doloremque nihil iusto qui cupiditate ea nobis, earum, assumenda in temporibus fugiat, rerum ducimus beatae est voluptates. Quidem odit ab voluptates eaque? Velit fugit quia magni a nihil eius repellendus iusto, aut officiis ut explicabo facilis sed, commodi iure amet voluptates quis aperiam aliquid et culpa doloribus distinctio sit ab. Molestiae, neque ab saepe optio nisi reiciendis corporis, doloribus accusantium nihil ipsum qui dolore unde atque mollitia autem id eos necessitatibus minima ea?";

export function DraggableAppointment({
    appointment,
    top,
    left,
    width,
    height,
    showFullInfo,
}: {
    appointment: Appointment
    top: number
    left: number
    width: string | number
    height: number
    showFullInfo: boolean
}) {
    const [noteExtended, setIsNoteExtended] = useState(false);

    const dentists = useCalendarStore(state => state.dentists);
    const activeId = useCalendarStore(state => state.activeId);


    const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
        id: appointment.id,
    })

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: appointment.id,
    })

    const setNodeRef = (node: HTMLElement | null) => {
        setDraggableRef(node)
        setDroppableRef(node)
    }

    // Hide the original while dragging
    if (isDragging || String(activeId) === String(appointment.id)) {
        return null
    }
    const transformStyle = transform ? CSS.Translate.toString(transform) : undefined;

    const dentistForThisAppointment = dentists.find((d) => d.id === appointment.dentistId);

    const options: Intl.DateTimeFormatOptions = {
        weekday: "short", // 'Mon'
        day: "numeric",   // '11'
        month: "short",   // 'Jul'
        year: "numeric",  // '2025'
    };
    const readableDate = new Date(appointment.date).toLocaleDateString("en-US", options);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    className="absolute pointer-events-auto"
                    style={{
                        top: `${top}px`,
                        left: `${left}px`,
                        width: typeof width === "string" ? width : `${width}px`,
                        height: `${height}px`,
                        transform: transformStyle,
                        zIndex: 2, // Above slots and highlights
                    }}
                    data-is-appointment="true"  // Marker for event delegation
                >
                    <div
                        className={cn("rounded-lg p-2 cursor-move flex", appointment.color?.stickerColor)}
                        style={{
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box",
                        }}
                    // onClick={(e) => handleAppointmentClick(e)}
                    >
                        <div className={cn("w-1 rounded-full mr-2 flex-shrink-0", appointment.color?.lineColor)} />
                        <div className="flex-1 overflow-hidden">
                            {showFullInfo ? (
                                <>
                                    <h4 className="text-xs font-medium leading-tight">Dr. {dentists.find((d) => d.id === appointment.dentistId)?.name.split(" ")[0]} /w {appointment.patientName}</h4>
                                    <p className="text-xs opacity-75 leading-tight">{appointment.startTime} - {appointment.endTime}</p>
                                </>
                            ) : (
                                <div className="text-xs font-medium leading-tight">{truncateText(appointment.patientName, 15)}</div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-sm px-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Appointment on {appointment.date}</DialogTitle>
                    <DialogDescription>Appointment of Dr. {dentistForThisAppointment?.name} with {appointment.patientName}</DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[80vh]">
                    <div className="flex flex-col pt-2">
                        <div className="flex flex-col px-4 py-5">
                            <strong className="uppercase text-slate-400 dark:text-slate-600 text-[9px]">Appointment Title</strong>
                            <div className="flex mt-1 justify-between items-end">
                                <div className="flex flex-col">
                                    <div className="flex flex-1">
                                        <Avatar className={"size-10 border-2 border-popover relative z-10 bg-blue-300 dark:bg-blue-700 uppercase"}>
                                            <AvatarImage src={dentistForThisAppointment?.avatar} />
                                            <AvatarFallback>{dentistForThisAppointment?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Avatar className={"size-10 -ml-4 border-2 border-popover relative bg-blue-300 dark:bg-blue-700 uppercase"}>
                                            <AvatarImage src="" />
                                            <AvatarFallback>{dentistForThisAppointment?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h2 className="text-base max-w-[180px]">
                                        Dr. {" "} <span className="capitalize"> {dentistForThisAppointment?.name}</span> {" "}
                                        with <span className="capitalize">{appointment.patientName} </span>
                                    </h2>

                                </div>

                                <div className="">
                                    <Button variant={"outline"} className="flex-1">Patient Details</Button>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="flex flex-col px-4 py-5">
                            <strong className="uppercase text-slate-400 dark:text-slate-600 text-[9px]">Date & Time</strong>
                            <div className="flex justify-between">
                                <h4>
                                    {convert24hTo12h(appointment.startTime)} - {convert24hTo12h(appointment.endTime)}
                                </h4>

                                <div className="flex items-center text-sm">
                                    <TimerIcon className="size-3.5" />
                                    {getScheduleDuration(appointment.startTime, appointment.endTime)}
                                </div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <h4 className="text-sm text-foreground/80">
                                    {readableDate}
                                </h4>

                                <div className="flex text-[10px] gap-0.5 items-center">
                                    <Repeat1 className="size-3.5" /> One Off
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="px-4 mt-5">
                            <div className="bg-secondary rounded-lg p-3 relative">
                                <header className="flex justify-between">
                                    <span className="flex items-center gap-0.5 text-sm"><Notebook className="size-4" /> Patient Note</span>

                                    <Button
                                        variant={"ghost"}
                                        className="[&>svg]:size-2"
                                        onClick={() => setIsNoteExtended((prev) => !prev)}
                                        aria-label={noteExtended ? "Minimize" : "Maximize"}
                                    >
                                        {noteExtended ? <Minimize2 /> :
                                            <Maximize2 />}
                                    </Button>
                                </header>
                                <p className={cn("text-xs opacity-80 transition ease-in-out",
                                    { "animate-collapsible-up": noteExtended },
                                    { "animate-collapsible-down": !noteExtended }
                                )}>
                                    {patientNote.slice(0, noteExtended ? patientNote.length : 220)}
                                </p>
                                <div className={cn("absolute bg-background opacity-75 backdrop-blur-lg bottom-0 left-0 right-0 h-[20px] w-full transition duration-200", { "hidden": noteExtended })}></div>
                            </div>
                        </div>


                    </div>
                </ScrollArea>

                <DialogFooter className="flex flex-row *:flex-1 flex-nowrap px-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant={"destructive"}>Delete</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader className="sr-only">
                                <AlertDialogTitle>Delete This Appointment</AlertDialogTitle>
                                <AlertDialogTitle>Appointment of Dr. {dentistForThisAppointment?.name} with {appointment.patientName}</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="flex flex-col items-center mx-auto my-5">
                                <span className="p-3 border-2 rounded-xl border-destructive text-destructive bg-destructive/20 shadow-lg shadow-accent-foreground/40"><Trash2 /></span>

                                <h2 className="max-w-sm mt-3">Are you sure you want to delete this appointment?</h2>
                            </div>

                            <AlertDialogFooter className="flex flex-row border-t pt-2">
                                <Button variant="destructive" className="flex-1">Yes, Delete</Button>

                                <AlertDialogCancel asChild>
                                    <Button variant="secondary" className="flex-1">No, Cancel</Button>
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant={"secondary"}>Edit</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Edit Appointment</SheetTitle>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}