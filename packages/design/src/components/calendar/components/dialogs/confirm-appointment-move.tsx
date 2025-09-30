import { ScrollArea } from "@repo/design/components/ui/scroll-area";
import { useCalendarStore } from "../../store/store";
import { Button } from "@repo/design/components/ui/button";
import { ArrowUpDown, ReplaceAllIcon, ReplaceIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@repo/design/components/ui/dialog";
import { minutesToTime } from "@repo/design/lib/calendar";

{/* Confirm dialog for replace/swap/move */ }
export function ConfirmAppointmentMove() {
    const {
        showConfirmDialog,
        setShowConfirmDialog,
        targetAppointment,
        setTargetAppointment,
        pendingNewStartMinutes,
        setPendingNewStartMinutes,
        setNewStartTime,
        originalAppointment,
        setOriginalAppointment
    } = useCalendarStore();

    const dentists = useCalendarStore(state => state.dentists);
    const newStartTime = useCalendarStore(state => state.newStartTime);
    const setAppointments = useCalendarStore(state => state.setAppointments);
    const getAppointmentDuration = useCalendarStore(state => state.getAppointmentDuration);

    function handleConfirmChoice(choice: "replace" | "replace_preserve_time" | "swap" | "cancel" | "move") {
        if (!originalAppointment) {
            setShowConfirmDialog(false)
            setOriginalAppointment(null)
            setNewStartTime(null)
            setPendingNewStartMinutes(null)
            setTargetAppointment(null)
            return
        }

        const draggedId = originalAppointment.id

        if (choice === "cancel") {
            // revert
            setShowConfirmDialog(false);
            setOriginalAppointment(null);
            setNewStartTime(null);
            setPendingNewStartMinutes(null);
            setTargetAppointment(null);
            return;
        }

        setAppointments((prev) => {
            let next = prev.map((p) => ({ ...p }));

            const draggedIndex = next.findIndex((p) => p.id === draggedId);
            if (draggedIndex === -1) return prev;

            const dragged = next[draggedIndex];
            if (!dragged) return prev;

            // Move to empty time slot
            if (choice === "move") {
                if (pendingNewStartMinutes === null) return prev;
                const duration = getAppointmentDuration(String(dragged.startTime), String(dragged.endTime));
                const newStart = minutesToTime(pendingNewStartMinutes);
                const newEnd = minutesToTime(pendingNewStartMinutes + duration);
                next[draggedIndex] = { ...dragged, startTime: newStart, endTime: newEnd };
                return next;
            }

            // actions that need a target
            if (!targetAppointment) return prev;
            const targetIndex = next.findIndex((p) => p.id === targetAppointment.id);
            if (targetIndex === -1) return prev;
            const target = next[targetIndex];

            if (choice === "replace") {
                // dragged takes target's time & dentist; remove target
                next[draggedIndex] = { ...dragged, startTime: String(target?.startTime), endTime: String(target?.endTime), dentistId: Number(target?.dentistId) };
                next = next.filter((p) => p.id !== target?.id);
                return next;
            } else if (choice === "replace_preserve_time") {
                // delete target; dragged keeps its time
                next = next.filter((p) => p.id !== target?.id);
                return next;
            } else {
                // if choice is swap
                // swap times between dragged and target
                const draggedTimes = { startTime: dragged.startTime, endTime: String(dragged.endTime) }
                next[draggedIndex] = { ...dragged, startTime: String(target?.startTime), endTime: String(target?.endTime) }
                next[targetIndex] = {
                    id: Number(target?.id),
                    dentistId: Number(target?.dentistId),
                    patientName: String(target?.patientName),
                    date: String(target?.date),
                    color: target?.color,
                    startTime: draggedTimes.startTime,
                    endTime: draggedTimes.endTime
                }
                return next
            }
        });

        // clear state
        setShowConfirmDialog(false);
        setOriginalAppointment(null);
        setTargetAppointment(null);
        setNewStartTime(null);
        setPendingNewStartMinutes(null);
    }

    return (
        <Dialog open={showConfirmDialog} onOpenChange={(open: boolean) => { if (!open) handleConfirmChoice("cancel") }}>
            <DialogContent>
                <ScrollArea className="max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="text-sm capitalize">
                            {targetAppointment ? `Confirm action with ${targetAppointment.patientName} on Dr ${dentists.find((dentist) => dentist.id === targetAppointment.dentistId)?.name}'s Column` : "Confirm move"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-4">
                        {targetAppointment ? (
                            <div>
                                <p className="mb-3 text-sm">You dropped <strong className="capitalize">{originalAppointment?.patientName}</strong> on <strong className="capitalize">{targetAppointment.patientName}</strong>. Choose an action:</p>
                                <div className="flex flex-col gap-4">
                                    <div className="border-b rounded-sm pb-3 flex flex-col gap-2">
                                        <div className="flex item-center gap-1">
                                            <div className="border p-1 flex items-center rounded-sm"> <ReplaceIcon /></div>
                                            {/* <strong className="font-semibold text-sm">Replace:</strong> */}
                                            <p className="text-sm">Remove the target; dragged appointment keeps its own time.</p>
                                        </div>
                                        <Button variant="secondary" onClick={() => handleConfirmChoice("replace")}>Replace</Button>
                                    </div>
                                    <div className="border-b rounded-sm pb-3 flex flex-col gap-2">
                                        <div className="flex item-center gap-1">
                                            <div className="border bg-primary text-background p-1 flex items-center rounded-sm"> <ReplaceAllIcon /></div>
                                            <p className="text-sm">Remove the target; dragged appointment moves to the target's time.</p>
                                        </div>
                                        <Button onClick={() => handleConfirmChoice("replace_preserve_time")}>Replace & keep time</Button>
                                    </div>
                                    <div className="border-b rounded-sm pb-3 flex flex-col gap-2">
                                        <div className="flex item-center gap-1">
                                            <div className="border  p-1 flex items-center rounded-sm"> <ArrowUpDown /></div>
                                            <p className="text-sm">Swap the time ranges of the two appointments.</p>
                                        </div>
                                        <Button variant={"outline"} onClick={() => handleConfirmChoice("swap")}>Swap</Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Move <strong>{originalAppointment?.patientName}</strong> to <strong>{newStartTime}</strong>?</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        {!targetAppointment && (
                            <>
                                <Button onClick={() => handleConfirmChoice("move")}>Move</Button>
                            </>
                        )}
                        <Button variant="destructive" onClick={() => handleConfirmChoice("cancel")}>Cancel and close</Button>
                    </DialogFooter>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
