// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
import {
  CalendarArrowUpIcon,
  CircleDotDashedIcon,
  ClockIcon,
  Heading1Icon,
  TagsIcon,
  UserCheckIcon,
} from "lucide-react";

import { cn } from "@repo/design/lib/utils";

import type { TW_COLOR } from "./columns";
import type { Issue } from "./types";
import { createColumnConfigHelper } from "../data-table-filter/core/filters";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LABEL_STYLES_BG } from "./columns";
import { ISSUE_STATUSES } from "./data";

const dtf = createColumnConfigHelper<Issue>();

export const columnsConfig = [
  dtf
    .text()
    .id("title")
    .accessor((row) => row.title)
    .displayName("Title")
    .icon(Heading1Icon)
    .build(),
  dtf
    .option()
    .accessor((row) => row.status.id)
    .id("status")
    .displayName("Status")
    .icon(CircleDotDashedIcon)
    .options(
      ISSUE_STATUSES.map((s) => ({ value: s.id, label: s.name, icon: s.icon })),
    )
    .build(),
  dtf
    .option()
    .accessor((row) => row.assignee)
    .id("assignee")
    .displayName("Assignee")
    .icon(UserCheckIcon)
    .transformOptionFn((u) => ({
      value: u.id,
      label: u.name,
      icon: (
        <Avatar className="size-4">
          <AvatarImage src={u.picture} />
          <AvatarFallback>
            {u.name
              .split("")
              .map((x) => x[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    }))
    .build(),
  dtf
    .multiOption()
    .accessor((row) => row.labels)
    .id("labels")
    .displayName("Labels")
    .icon(TagsIcon)
    .transformOptionFn((l) => ({
      value: l.id,
      label: l.name,
      icon: (
        <div
          className={cn(
            "size-2.5 rounded-full",
            LABEL_STYLES_BG[l.color as TW_COLOR],
          )}
        />
      ),
    }))
    .build(),
  dtf
    .number()
    .accessor((row) => row.estimatedHours)
    .id("estimatedHours")
    .displayName("Estimated hours")
    .icon(ClockIcon)
    .min(0)
    .max(100)
    .build(),
  dtf
    .date()
    .accessor((row) => row.startDate)
    .id("startDate")
    .displayName("Start Date")
    .icon(CalendarArrowUpIcon)
    .build(),
] as const;
