"use client";

import * as React from "react";

import { cn } from "@repo/design/lib/utils";

type Size = "sm" | "md" | "lg";

interface DataListProps extends React.HTMLAttributes<HTMLDListElement> {
  orientation?: "horizontal" | "vertical";
  size?: Size;
  ref?: React.Ref<HTMLDListElement>;
}

const DataListContext = React.createContext<{
  orientation: "horizontal" | "vertical";
  size: Size;
}>({
  orientation: "vertical",
  size: "md",
});

function DataList({
  className,
  orientation = "vertical",
  size = "md",
  ref,
  ...props
}: DataListProps) {
  return (
    <DataListContext.Provider value={{ orientation, size }}>
      <dl
        ref={ref}
        className={cn(
          "gap-3",
          orientation === "vertical" ? "flex flex-row flex-wrap" : "grid",
          {
            "gap-2": size === "sm",
            "gap-3": size === "md",
            "gap-4": size === "lg",
          },
          className,
        )}
        data-orientation={orientation}
        {...props}
      />
    </DataListContext.Provider>
  );
}

interface DataListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center";
  ref?: React.Ref<HTMLDivElement>;
}

function DataListItem({
  className,
  align = "start",
  ref,
  ...props
}: DataListItemProps) {
  const { orientation, size } = React.useContext(DataListContext);

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between gap-4",
        orientation === "horizontal" && "w-full",
        orientation === "vertical" && "min-w-0 flex-1 flex-col",
        {
          "py-1": size === "sm",
          "py-2": size === "md",
          "py-3": size === "lg",
        },
        align === "center" && "items-center",
        className,
      )}
      {...props}
    />
  );
}

interface DataListLabelProps extends React.HTMLAttributes<HTMLElement> {
  minWidth?: string | number;
  ref?: React.Ref<HTMLElement>;
}

function DataListLabel({
  className,
  minWidth,
  style,
  ref,
  ...props
}: DataListLabelProps) {
  const { orientation, size } = React.useContext(DataListContext);

  return (
    <dt
      ref={ref}
      className={cn(
        "text-muted-foreground font-medium",
        orientation === "horizontal" ? "shrink-0" : "shrink-0",
        {
          "text-xs": size === "sm",
          "text-xs sm:text-sm": size === "md",
          "text-sm sm:text-base": size === "lg",
        },
        className,
      )}
      style={{
        minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
        ...style,
      }}
      {...props}
    />
  );
}

interface DataListValueProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

function DataListValue({ className, ref, ...props }: DataListValueProps) {
  const { orientation, size } = React.useContext(DataListContext);

  return (
    <dd
      ref={ref}
      className={cn(
        "text-foreground",
        orientation === "horizontal" ? "flex-1" : "flex-1",
        {
          "text-sm": size === "sm" || size === "md",
          "text-base": size === "lg",
        },
        className,
      )}
      {...props}
    />
  );
}

export { DataList, DataListItem, DataListLabel, DataListValue };
