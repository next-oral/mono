import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@repo/design/lib/utils";

export const DashboardCard = ({
  title,
  value,
  Icon,
  period,
  percentage,
}: {
  title: string;
  value: number;
  Icon: LucideIcon;
  period: string;
  percentage: number;
}) => {
  return (
    <div className="p- rounded-xl border p-4">
      <div className="flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-sans leading-6 font-medium text-slate-500">
            {title}
          </h3>
          <div className="flex size-8 items-center justify-center gap-2 rounded-md bg-slate-100 text-slate-500">
            <Icon />
          </div>
        </div>
        <div className="mt-2 flex-1 flex-col gap-2">
          <p className="text-2xl font-bold tracking-wide text-slate-900">
            {value}
          </p>
          <div className="flex items-center gap-2">
            <p
              className={cn("flex items-center gap-1 text-sm font-medium", {
                "text-green-700": percentage > 0,
                "text-red-700": percentage < 0,
              })}
            >
              {percentage > 0 ? (
                <ArrowUp className="size-4 stroke-3" />
              ) : (
                <ArrowDown className="size-4 stroke-3" />
              )}
              {percentage}%
            </p>
            <p className="text-sm text-slate-500">{period}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
