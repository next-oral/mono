"use client";

import React, { useRef } from "react";
import {
  addMinutes,
  format,
  intervalToDuration,
  parse,
  startOfDay,
} from "date-fns";

import { SLOT_HEIGHT_PX } from "../constants";
import { useCalendarStore } from "../store";
import { getTimeStringFromTop } from "../utils";

const HOLD_MS = 300; // the 300ms threshold
const MOVE_CANCEL_PX = 6; // small move cancels the hold before it arms

export function SlotHighlighter({
  currentDate,
  currentDentistId,
}: {
  currentDate: Date;
  currentDentistId: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startSlotRef = useRef<number | null>(null); // slot index (0..)
  const pointerIdRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const armedRef = useRef(false);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);

  // store
  const highlight = useCalendarStore((state) => state.highlight);
  const setHighlight = useCalendarStore((state) => state.setHighlight);
  const setShowNewAppointmentDialog = useCalendarStore(
    (state) => state.setShowNewAppointmentDialog,
  );

  // minutes per slot = 15 (by design)
  const MINUTES_PER_SLOT = 15;

  function clampToContainer(y: number, containerHeight: number) {
    if (y < 0) return 0;
    if (y > containerHeight) return containerHeight;
    return y;
  }

  function yToSlotIndex(y: number) {
    // floor so pointer inside the slot maps to that slot index
    return Math.floor(y / SLOT_HEIGHT_PX);
  }

  function slotIndexToTopPx(slotIndex: number) {
    return slotIndex * SLOT_HEIGHT_PX;
  }

  function slotRangeToRect(aSlot: number, bSlot: number) {
    const topSlot = Math.min(aSlot, bSlot);
    const bottomSlot = Math.max(aSlot, bSlot);
    const top = slotIndexToTopPx(topSlot);
    const height = (bottomSlot - topSlot + 1) * SLOT_HEIGHT_PX; // inclusive of last slot
    return { top, height };
  }

  function clearHoldTimer() {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    // clearHighlight();
    const container = containerRef.current;
    if (!container) return;

    // capture pointer so we keep receiving move/up
    try {
      container.setPointerCapture(e.pointerId);
      pointerIdRef.current = e.pointerId;
    } catch {
      // ignore if capture fails
    }

    const rect = container.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = clampToContainer(e.clientY - rect.top, rect.height);
    downPosRef.current = { x: localX, y: localY };

    // arm the hold only after HOLD_MS
    clearHoldTimer();
    armedRef.current = false;

    holdTimerRef.current = window.setTimeout(() => {
      // hold complete -> arm and start highlight
      armedRef.current = true;
      const slot = yToSlotIndex(localY);
      startSlotRef.current = slot;
      const r = slotRangeToRect(slot, slot);
      setHighlight(currentDentistId, currentDate, r);
    }, HOLD_MS);

    // prevent text selection / native drag
    e.preventDefault();
  }

  function handlePointerMove(e: React.PointerEvent) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = clampToContainer(e.clientY - rect.top, rect.height);

    // if not armed yet, cancel the hold if pointer moved too much
    if (!armedRef.current) {
      const down = downPosRef.current;
      if (!down) return;
      const dx = Math.abs(localX - down.x);
      const dy = Math.abs(localY - down.y);
      if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
        // movement too large before hold completed -> cancel the pending hold
        clearHoldTimer();
        try {
          container.releasePointerCapture(Number(pointerIdRef.current));
        } catch {}
        pointerIdRef.current = null;
        downPosRef.current = null;
      }
      return;
    }

    // if armed, update highlight range
    if (armedRef.current && startSlotRef.current !== null) {
      const slot = yToSlotIndex(localY);
      const r = slotRangeToRect(startSlotRef.current, slot);
      setHighlight(currentDentistId, currentDate, r);
      e.preventDefault();
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const container = containerRef.current;
    // always clear timer
    clearHoldTimer();

    if (container && pointerIdRef.current !== null) {
      try {
        container.releasePointerCapture(pointerIdRef.current);
      } catch {
        // ignore
      }
    }

    // If user held long enough (armed), open the dialog.
    if (armedRef.current) {
      setShowNewAppointmentDialog(true);
      // note: we intentionally keep the highlight in store (you can clear it if you want)
    }

    // reset refs
    startSlotRef.current = null;
    pointerIdRef.current = null;
    armedRef.current = false;
    downPosRef.current = null;

    e.preventDefault();
  }

  const timeBadge = highlight
    ? getTimeStringFromTop(
        Number(highlight.rect?.top),
        Number(highlight.rect?.height),
        currentDate,
      )
    : null;

  const startDate = parse(String(timeBadge?.startStr), "h:mm a", currentDate);
  const endDate = parse(String(timeBadge?.endStr), "h:mm a", currentDate);

  const duration = intervalToDuration({ start: startDate, end: endDate });

  return (
    <div
      ref={containerRef}
      // absolute inset-0 to overlay full column area
      className="absolute inset-0 h-full w-full"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      // allow this overlay to capture pointer events
      style={{ touchAction: "none" }}
    >
      {/* Render highlight (only visible during dragging/armed) */}
      {highlight && highlight.dentistId == currentDentistId && (
        <div
          className="pointer-events-none absolute right-0 left-0 overflow-hidden rounded-sm bg-blue-500/70 p-2"
          style={{
            top: `${highlight.rect?.top}px`,
            height: `${highlight.rect?.height}px`,
            // small z-index to sit above slots but below any modals
            zIndex: 10,
          }}
        >
          {/* Time indicator badge top-left */}
          <div className="text-background flex flex-col justify-between text-xs">
            <span>
              {timeBadge?.startStr} — {timeBadge?.endStr}
            </span>

            <span className="">
              {duration.hours && duration.hours + "h"}{" "}
              {duration.minutes && duration.minutes + "m"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
