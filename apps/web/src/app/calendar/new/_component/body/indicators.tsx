"use client";

import { isSameHour, isToday } from "date-fns";

import { SLOTS_PER_DAY } from "../constants";

export function CurrentTimeIndicator({ currentTime }: { currentTime: string }) {
  if (!isToday(currentTime)) return null;

  const now = new Date();
  const position = (now.getMinutes() / 60) * SLOTS_PER_DAY;

  if (!isSameHour(now, currentTime)) return null;

  return (
    <div
      className="border-primary/20 bg-primary/20 absolute h-[0.1px] w-full min-w-screen border"
      style={{ top: `${position}px` }}
    />
  );
}
