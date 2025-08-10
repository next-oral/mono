import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { SelectTrigger } from "@radix-ui/react-select";
import { Download, Trash2, X } from "lucide-react";

import { Button } from "@repo/design/src/components/ui/button";
import { Portal } from "@repo/design/src/components/ui/portal";
import {
  Select,
  SelectContent,
  SelectGroup,
} from "@repo/design/src/components/ui/select";
import { Separator } from "@repo/design/src/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design/src/components/ui/tooltip";

interface FloatingBarProps<T> {
  table: Table<T>;
}

export function FloatingBar<T>({ table }: FloatingBarProps<T>) {
  const rows = table.getFilteredSelectedRowModel().rows;

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
        <div className="w-full overflow-x-auto">
          <div className="bg-background text-foreground mx-auto flex w-fit items-center gap-2 rounded-md border p-2 shadow-sm">
            <div className="flex h-7 items-center rounded-md border border-dashed pr-1 pl-2.5">
              <span className="text-xs whitespace-nowrap">
                {rows.length} selected
              </span>
              <Separator orientation="vertical" className="mr-1 ml-2" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 hover:border"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className="size-3.5 shrink-0" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-accent text-foreground flex items-center border px-2 py-1 font-semibold dark:bg-zinc-900">
                  <p className="mr-2">Clear selection</p>
                  {/* <Kbd abbrTitle="Escape" variant="outline">
                  </Kbd> */}
                  Esc
                </TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <div className="flex items-center gap-1.5">
              <Select
              // onValueChange={(value: Task["status"]) => {
              //   setAction("update-status");

              //   startTransition(async () => {
              //     const { error } = await updateTasks({
              //       ids: rows.map((row) => row.original.id),
              //       status: value,
              //     });

              //     if (error) {
              //       toast.error(error);
              //       return;
              //     }

              //     toast.success("Tasks updated");
              //   });
              // }}
              >
                <Tooltip>
                  <SelectTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground size-7 border"
                        // disabled={isPending}
                      >
                        {/* {isPending && action === "update-status" ? (
                          <Loader
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircle2
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        )} */}
                      </Button>
                    </TooltipTrigger>
                  </SelectTrigger>
                  <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                    <p>Update</p>
                  </TooltipContent>
                </Tooltip>
                <SelectContent align="center">
                  <SelectGroup>
                    {/* {tasks.status.enumValues.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </SelectItem>
                    ))} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
              // onValueChange={(value: Task["priority"]) => {
              //   setAction("update-priority");

              //   startTransition(async () => {
              //     const { error } = await updateTasks({
              //       ids: rows.map((row) => row.original.id),
              //       priority: value,
              //     });

              //     if (error) {
              //       toast.error(error);
              //       return;
              //     }

              //     toast.success("Tasks updated");
              //   });
              // }}
              >
                <Tooltip>
                  <SelectTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground size-7 border"
                        // disabled={isPending}
                      >
                        {/* {isPending && action === "update-priority" ? (
                          <Loader
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowUp className="size-3.5" aria-hidden="true" />
                        )} */}
                      </Button>
                    </TooltipTrigger>
                  </SelectTrigger>
                  <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                    <p>Update priority</p>
                  </TooltipContent>
                </Tooltip>
                <SelectContent align="center">
                  <SelectGroup>
                    {/* {tasks.priority.enumValues.map((priority) => (
                      <SelectItem
                        key={priority}
                        value={priority}
                        className="capitalize"
                      >
                        {priority}
                      </SelectItem>
                    ))} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-7 border"
                    // onClick={() => {
                    //   setAction("export");

                    //   startTransition(() => {
                    //     exportTableToCSV(table, {
                    //       excludeColumns: ["select", "actions"],
                    //       onlySelected: true,
                    //     });
                    //   });
                    // }}
                    // disabled={isPending}
                  >
                    {/* {isPending && action === "export" ? (
                      <Loader
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                        )} */}
                    <Download className="size-3.5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                  <p>Export tasks</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-7 border"
                    // onClick={() => {
                    //   setAction("delete");

                    //   startTransition(async () => {
                    //     const { error } = await deleteTasks({
                    //       ids: rows.map((row) => row.original.id),
                    //     });

                    //     if (error) {
                    //       toast.error(error);
                    //       return;
                    //     }

                    //     table.toggleAllRowsSelected(false);
                    //   });
                    // }}
                    // disabled={isPending}
                  >
                    {/* {isPending && action === "delete" ? (
                      <Loader
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                        )} */}
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-accent text-foreground border font-semibold dark:bg-zinc-900">
                  <p>Delete tasks</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
