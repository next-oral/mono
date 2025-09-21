"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * CalendarGrid with:
 * - 24 hour rows (each 100px), each row has 4 mini-slots (25px each)
 * - Pointer-based hold (300ms) to start selection, touch fallback
 * - No single-click selection (clicks won't create highlights)
 * - Live range badge at the start of highlighted area, showing AM/PM times
 * - JS confirm dialog after selection to accept or cancel the new schedule
 */

const columns = ["Alice", "Bob", "Charlie"];
const THRESHOLD_MS = 300;

// Helpers for time formatting
const pad = (n: number) => n.toString().padStart(2, "0");
const absoluteSlotToMinutes = (slot: number) => slot * 15; // each slot = 15 mins
const minutesToTimeParts = (minutesFromMidnight: number) => {
    const mins = minutesFromMidnight % 60;
    const hours24 = Math.floor(minutesFromMidnight / 60) % 24;
    return { hours24, mins };
};
const formatAMPM = (minutesFromMidnight: number) => {
    const { hours24, mins } = minutesToTimeParts(minutesFromMidnight);
    const period = hours24 >= 12 ? "PM" : "AM";
    let hour12 = hours24 % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${pad(mins)} ${period}`;
};

// Generate labels for hour rows: 12:00 AM, 1:00 AM, ... 11:00 PM
const hourLabels = Array.from({ length: 24 }).map((_, i) => formatAMPM(i * 60));

type Highlight = { col: number; start: number; end: number } | null;

export default function CalendarGrid() {
    const [highlight, setHighlight] = useState<Highlight>(null);

    // mutable refs for the pointer/touch logic
    const timerRef = useRef<number | null>(null);
    const pendingStartRef = useRef<{ col: number; slot: number } | null>(null);
    const isSelectingRef = useRef(false);

    // Find the slot element (walk up DOM) that contains data-slot & data-col
    const findSlotElement = (el: Element | null) => {
        while (el && !(el instanceof HTMLElement && el.dataset.slot && el.dataset.col)) {
            el = el.parentElement;
        }
        return el;
    };

    // ensure highlight stored as start <= end (both inclusive)
    const normalizeHighlight = (col: number, a: number, b: number): Highlight => {
        const s = Math.min(a, b);
        const e = Math.max(a, b);
        return { col, start: s, end: e };
    };

    // helper to update highlight during pointermove
    const updateHighlight = (col: number, start: number, end: number) => {
        setHighlight(normalizeHighlight(col, start, end));
    };

    // compute absolute slot index for given hourIndex and mini slot (0..95)
    const getAbsoluteSlot = (hourIndex: number, miniIndex: number) => hourIndex * 4 + miniIndex;

    // pointer down on a slot -> start pending hold timer
    const handlePointerDownOnSlot = (e: React.PointerEvent, col: number, slot: number) => {
        e.preventDefault();
        (e.target as Element).setPointerCapture?.((e as any).pointerId);

        // start "pending" but DO NOT create selection until hold threshold
        pendingStartRef.current = { col, slot };
        isSelectingRef.current = false;

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
            // after THRESHOLD_MS, start selecting and set initial highlight
            isSelectingRef.current = true;
            setHighlight(normalizeHighlight(col, slot, slot));
            timerRef.current = null;
        }, THRESHOLD_MS);

        // global listeners
        window.addEventListener("pointermove", globalPointerMove);
        window.addEventListener("pointerup", globalPointerUp);
        window.addEventListener("pointercancel", globalPointerUp);
    };

    // pointer move -> update highlight only if selecting and same column
    const globalPointerMove = (ev: PointerEvent) => {
        if (!pendingStartRef.current) return;

        const { clientX, clientY } = ev;
        const elUnder = document.elementFromPoint(clientX, clientY);
        const slotEl = findSlotElement(elUnder);
        if (!slotEl) return;

        const colAttr = slotEl.dataset.col;
        const slotAttr = slotEl.dataset.slot;
        if (!colAttr || !slotAttr) return;
        const col = parseInt(colAttr, 10);
        const slot = parseInt(slotAttr, 10);

        const startInfo = pendingStartRef.current;

        // restrict selection to same column
        if (col !== startInfo.col) return;

        if (isSelectingRef.current) {
            updateHighlight(col, startInfo.slot, slot);
        } else {
            // If user moves significantly BEFORE threshold, cancel the pending hold (prevent accidental drag)
            const displacementTolerance = 8;
            const startEl = document.querySelector(
                `[data-col="${startInfo.col}"][data-slot="${startInfo.slot}"]`
            );
            if (startEl) {
                const rect = startEl.getBoundingClientRect();
                const dx = Math.abs(rect.left + rect.width / 2 - clientX);
                const dy = Math.abs(rect.top + rect.height / 2 - clientY);
                if (dx > displacementTolerance || dy > displacementTolerance) {
                    if (timerRef.current) {
                        window.clearTimeout(timerRef.current);
                        timerRef.current = null;
                    }
                    pendingStartRef.current = null;
                    cleanupGlobalListeners();
                }
            }
        }
    };

    // pointer up -> either finalize selection (if selecting) or do nothing (we removed quick-click selection)
    const globalPointerUp = (ev: PointerEvent) => {
        // clear any pending timer
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!pendingStartRef.current) {
            cleanupGlobalListeners();
            return;
        }

        const startInfo = pendingStartRef.current;
        pendingStartRef.current = null;

        if (isSelectingRef.current) {
            // finalize current highlight state (it was updated during pointermove)
            isSelectingRef.current = false;

            // highlight should already be set in state; get it and show confirm dialog
            const current = highlight;
            if (current && current.col === startInfo.col) {
                // compute displayed times:
                // start minutes = startSlot * 15
                // end minutes = (endSlot + 1) * 15  (end is exclusive)
                const startMinutes = absoluteSlotToMinutes(current.start);
                const endMinutes = absoluteSlotToMinutes(current.end + 1);
                const label = `${formatAMPM(startMinutes)} - ${formatAMPM(endMinutes)}`;
                alert()
                // JS confirm dialog
                const ok = confirm(`Create schedule for ${label}?`);
                if (!ok) {
                    // user cancelled -> clear highlight
                    setHighlight(null);
                } else {
                    // user confirmed -> you can call your createSchedule handler here
                    // For now we just keep the highlight as-is and leave it on the grid.
                    // TODO: integrate with your scheduling API / state
                }
            }
        } else {
            // Released before threshold — quick click: do nothing (no highlight)
            // (This was changed per your request to prevent click-from-highlighting.)
            // Optionally you might want to clear existing highlight on quick click outside:
            // setHighlight(null);
        }

        cleanupGlobalListeners();
    };

    const cleanupGlobalListeners = () => {
        window.removeEventListener("pointermove", globalPointerMove);
        window.removeEventListener("pointerup", globalPointerUp);
        window.removeEventListener("pointercancel", globalPointerUp);
    };

    // Touch fallback for environments without PointerEvent support
    useEffect(() => {
        const supportsPointer = window.PointerEvent !== undefined;
        if (supportsPointer) return;

        // touch fallback mimics pointer logic
        const touchStartHandler = (ev: TouchEvent) => {
            if (ev.touches.length > 1) return;
            const t = ev.touches[0];
            const elUnder = document.elementFromPoint(t.clientX, t.clientY);
            const slotEl = findSlotElement(elUnder);
            if (!slotEl) return;
            const col = parseInt(slotEl.dataset.col!, 10);
            const slot = parseInt(slotEl.dataset.slot!, 10);
            pendingStartRef.current = { col, slot };
            isSelectingRef.current = false;

            timerRef.current = window.setTimeout(() => {
                isSelectingRef.current = true;
                setHighlight(normalizeHighlight(col, slot, slot));
                timerRef.current = null;
            }, THRESHOLD_MS);
        };

        const touchMoveHandler = (ev: TouchEvent) => {
            if (!pendingStartRef.current) return;
            const t = ev.touches[0];
            const elUnder = document.elementFromPoint(t.clientX, t.clientY);
            const slotEl = findSlotElement(elUnder);
            if (!slotEl) return;
            const col = parseInt(slotEl.dataset.col!, 10);
            const slot = parseInt(slotEl.dataset.slot!, 10);
            if (col !== pendingStartRef.current.col) return;
            if (isSelectingRef.current) {
                updateHighlight(col, pendingStartRef.current.slot, slot);
            }
        };

        const touchEndHandler = (ev: TouchEvent) => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (!pendingStartRef.current) return;
            if (isSelectingRef.current) {
                // finalize selection similar to pointerup
                isSelectingRef.current = false;
                const current = highlight;
                if (current && current.col === pendingStartRef.current.col) {
                    const startMinutes = absoluteSlotToMinutes(current.start);
                    const endMinutes = absoluteSlotToMinutes(current.end + 1);
                    const label = `${formatAMPM(startMinutes)} - ${formatAMPM(endMinutes)}`;
                    alert()
                    const ok = window.confirm(`Create schedule for ${label}?`);
                    if (!ok) setHighlight(null);
                }
            } else {
                // quick tap -> do nothing (no highlight)
            }
            pendingStartRef.current = null;
        };

        document.addEventListener("touchstart", touchStartHandler, { passive: false });
        document.addEventListener("touchmove", touchMoveHandler, { passive: false });
        document.addEventListener("touchend", touchEndHandler);

        return () => {
            document.removeEventListener("touchstart", touchStartHandler);
            document.removeEventListener("touchmove", touchMoveHandler);
            document.removeEventListener("touchend", touchEndHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            cleanupGlobalListeners();
        };
    }, []);

    // render
    return (
        <div className="w-full overflow-auto select-none">
            {/* Column headers */}
            <div className="grid" style={{ gridTemplateColumns: `100px repeat(${columns.length}, 1fr)` }}>
                <div />
                {columns.map((col, i) => (
                    <div key={i} className="p-2 font-bold text-center border-b border-gray-300">
                        {col}
                    </div>
                ))}
            </div>

            {/* Time rows */}
            <div>
                {hourLabels.map((hourLabel, hourIdx) => (
                    <div
                        key={hourIdx}
                        className="grid"
                        style={{ gridTemplateColumns: `100px repeat(${columns.length}, 1fr)` }}
                    >
                        {/* Time label */}
                        <div className="border-r border-gray-300 flex items-center justify-center text-sm h-[100px]">
                            {hourLabel}
                        </div>

                        {/* Columns */}
                        {columns.map((_, colIndex) => (
                            <div key={colIndex} className="border-l border-gray-200 relative h-[100px]">
                                {Array.from({ length: 4 }).map((_, miniIdx) => {
                                    const absoluteSlot = getAbsoluteSlot(hourIdx, miniIdx);
                                    const isHighlighted =
                                        highlight &&
                                        highlight.col === colIndex &&
                                        absoluteSlot >= highlight.start &&
                                        absoluteSlot <= highlight.end;

                                    // If this mini-slot is the start of the highlight, prepare the badge text
                                    const renderBadge =
                                        highlight && highlight.col === colIndex && absoluteSlot === highlight.start;

                                    // Compute badge text if needed
                                    let badgeText = "";
                                    if (renderBadge && highlight) {
                                        const startMinutes = absoluteSlotToMinutes(highlight.start);
                                        const endMinutes = absoluteSlotToMinutes(highlight.end + 1); // exclusive
                                        badgeText = `${formatAMPM(startMinutes)} - ${formatAMPM(endMinutes)}`;
                                    }

                                    return (
                                        <div
                                            key={miniIdx}
                                            data-col={String(colIndex)}
                                            data-slot={String(absoluteSlot)}
                                            // make each mini-slot relatively positioned so badge can be absolute inside it
                                            className={`h-[25px] border-b border-gray-100 cursor-pointer relative ${isHighlighted ? "bg-blue-400/70" : "hover:bg-blue-100"
                                                }`}
                                            onPointerDown={(e) => handlePointerDownOnSlot(e, colIndex, absoluteSlot)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            {/* Badge shown at start of highlight */}
                                            {renderBadge && badgeText && (
                                                <div
                                                    className="absolute -left-2 -top-8 whitespace-nowrap text-xs font-semibold bg-white border border-gray-300 rounded px-2 py-1 shadow-sm"
                                                // keep the badge visually near the start box (adjust styling as needed)
                                                >
                                                    {badgeText}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

