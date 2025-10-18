"use client";

import { useDroppable } from "@dnd-kit/core";
import { useZero } from "@rocicorp/zero/react";

import type { Mutators } from "@repo/zero/src/mutators";
import type { Schema } from "@repo/zero/src/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design/src/components/ui/avatar";
import { Button } from "@repo/design/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/src/components/ui/popover";
import { ExternalLinkIcon } from "@repo/design/src/icons";
import { cn } from "@repo/design/src/lib/utils";

import { useZeroQuery } from "~/providers/zero";
import { useCalendarStore } from "../store";

export function DroppableColumn({
  dentistId,
  label,
  children,
}: {
  dentistId: string;
  label: string;
  children: React.ReactNode;
}) {
  const z = useZero<Schema, Mutators>();

  const filteredDentists = useCalendarStore((state) => state.filteredDentists);
  const {
    data: [currentDentist],
  } = useZeroQuery(z.query.dentist.where("id", "=", dentistId));
  // const currentDentist = dentists.find((dentist) => dentist.id === dentistId);
  const { setNodeRef, isOver } = useDroppable({
    id: `dentist-${dentistId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn("flex size-full min-w-40 flex-col not-odd:border-x", {
        "bg-primary/10": isOver,
      })}
    >
      <Popover>
        <PopoverTrigger asChild>
          <div className="bg-background sticky top-0 z-20 flex min-h-10 cursor-pointer items-center justify-center border-b text-xs capitalize backdrop-blur-2xl">
            Dr. {filteredDentists.length > 2 ? label.split(" ")[0] : label}
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex size-fit flex-col gap-2 p-0">
          <div className="flex flex-wrap items-center gap-1 px-2 pt-2">
            <Avatar>
              <AvatarImage src={currentDentist?.lastName} />
              <AvatarFallback className="uppercase">
                {label.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="max-w-[200px] text-xs capitalize">Doctor {label}</h3>
          </div>
          <Button
            variant={"secondary"}
            className="w-full rounded-t-none text-xs focus-visible:ring-0"
          >
            View Details <ExternalLinkIcon />
          </Button>
        </PopoverContent>
      </Popover>
      {children}
    </div>
  );
}
