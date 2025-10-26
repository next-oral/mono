"use client";

import { Fragment } from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { createActionMenu, defaultSlots, renderIcon } from "./action-menu";

const TriangleRightIcon = ({
  ...props
}: React.HTMLAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 11L6 4L10.5 7.5L6 11Z" fill="currentColor"></path>
    </svg>
  );
};

export const LabelWithBreadcrumbs = ({
  label,
  breadcrumbs,
}: {
  label: React.ReactNode;
  breadcrumbs?: string[];
}) => (
  <div className="flex items-center gap-1 truncate">
    {breadcrumbs?.map((crumb, idx) => (
      <Fragment key={`${idx}-${crumb}`}>
        <span className="text-muted-foreground truncate">{crumb}</span>
        <ChevronRightIcon className="text-muted-foreground/75 size-3 shrink-0 stroke-[2.5px]" />
      </Fragment>
    ))}
    <span className="truncate">{label}</span>
  </div>
);

export const ActionMenu = createActionMenu({
  slots: {
    Item: ({ node, bind, search }) => {
      const props = bind.getRowProps({
        className: "group/row",
      });

      return (
        <li {...props}>
          {node.icon && (
            <div className="flex size-4 items-center justify-center">
              {renderIcon(
                node.icon,
                "size-4 shrink-0 text-muted-foreground group-data-[focused=true]/row:text-primary",
              )}
            </div>
          )}
          <LabelWithBreadcrumbs
            label={node.label ?? ""}
            breadcrumbs={search?.breadcrumbs}
          />
        </li>
      );
    },
    SubmenuTrigger: ({ node, bind, search }) => {
      const props = bind.getRowProps({});

      return (
        <li {...props}>
          <div className="flex min-w-0 items-center gap-2">
            {node.icon && (
              <div className="flex size-4 items-center justify-center">
                {renderIcon(
                  node.icon,
                  "size-4 shrink-0 text-muted-foreground group-data-[focused=true]:text-primary",
                )}
              </div>
            )}
            <LabelWithBreadcrumbs
              label={node.label ?? ""}
              breadcrumbs={search?.breadcrumbs}
            />
          </div>
          <TriangleRightIcon className="text-muted-foreground/75 group-data-[menu-state=open]:group-data-[menu-focused=false]:text-foreground/75 group-data-[menu-focused=true]:text-foreground shrink-0 transition-[color] duration-50 ease-out" />
        </li>
      );
    },
    Empty: ({ query }) =>
      query ? (
        <div className="text-muted-foreground flex h-10 items-center justify-center">
          No matching options.
        </div>
      ) : null,
    List: (args) =>
      !args.query && args.nodes.length === 0 ? null : defaultSlots().List(args),
  },
  slotProps: {
    positioner: {
      sideOffset: 2,
    },
  },
  classNames: {
    drawerOverlay: cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 h-full w-full bg-black/40",
    ),
    drawerContent: cn(
      "fixed z-50",
      "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80svh] data-[vaul-drawer-direction=top]:rounded-lg",
      "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mx-4 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80svh] data-[vaul-drawer-direction=bottom]:rounded-lg",
    ),
    drawerContentInner: cn(
      "bg-popover mb-4 flex h-auto min-h-0 flex-col overflow-hidden rounded-lg border shadow-lg",
      "[--action-menu-drawer-handle-height:theme(spacing.8)]",
    ),
    drawerHandle: cn(
      "relative h-(--action-menu-drawer-handle-height) w-full",
      "before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2",
      "before:bg-muted before:h-2 before:w-[100px] before:shrink-0 before:rounded-full",
    ),
    content: cn(
      "bg-popover z-50 flex origin-(--radix-popper-transform-origin) flex-col rounded-lg text-sm data-[mode=dropdown]:border data-[root-menu]:drop-shadow-md data-[sub-menu]:drop-shadow-xl",
      "data-[root-menu]:data-[state=open]:animate-in data-[root-menu]:data-[state=closed]:animate-out data-[root-menu]:data-[state=closed]:fade-out-0 data-[root-menu]:data-[state=open]:fade-in-0 data-[root-menu]:data-[state=closed]:zoom-out-95 data-[root-menu]:data-[state=open]:zoom-in-95 data-[root-menu]:data-[side=bottom]:slide-in-from-top-2 data-[root-menu]:data-[side=left]:slide-in-from-right-2 data-[root-menu]:data-[side=right]:slide-in-from-left-2 data-[root-menu]:data-[side=top]:slide-in-from-bottom-2",
      "data-[mode=dropdown]:max-h-[min(500px,var(--action-menu-available-height))]",
      "box-content",
      "data-[mode=dropdown]:w-[min(400px,max(var(--row-width),175px))]",
      "data-[mode=drawer]:max-h-[calc(80svh-var(--action-menu-drawer-handle-height)-calc(var(--spacing)*4))]",
    ),
    list: cn(
      "scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
      "[-ms-overflow-style:none] [scrollbar-width:none] [-webkit-scrollbar]:hidden",
      "w-full flex-1",
      "py-1",
    ),
    input: cn(
      "placeholder-muted-foreground/70 focus-visible:placeholder-muted-foreground max-h-9 min-h-9 border-b px-4 caret-blue-500 outline-hidden placeholder:transition-[color] placeholder:duration-50 placeholder:ease-in-out disabled:cursor-not-allowed disabled:opacity-50",
      "data-[mode=drawer]:text-[16px]",
      "data-[mode=drawer]:px-6",
      "w-full",
    ),
    group: cn("mt-3 mb-2 data-[index=0]:mt-1"),
    groupHeading: cn("text-muted-foreground px-3 text-xs font-medium"),
    item: cn(
      "group flex w-full items-center gap-2 text-sm select-none",
      "data-[focused=true]:text-accent-foreground",
      "py-1.5 data-[mode=drawer]:px-5 data-[mode=dropdown]:px-4",
      "relative z-1 w-full truncate",
      "data-[focused=true]:before:bg-accent before:absolute before:top-0 before:right-1 before:left-1 before:z-[-1] before:h-full before:rounded-md",
    ),
    subtrigger: cn(
      "group data-[focused=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center justify-between gap-4 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "py-1.5 data-[mode=drawer]:px-5 data-[mode=dropdown]:px-4",
      "relative z-1 w-full overflow-x-hidden",
      "data-[focused=true]:before:bg-accent before:absolute before:top-0 before:right-1 before:left-1 before:z-[-1] before:h-full before:rounded-md",
    ),
  },
});

export type {
  ActionMenuRootProps,
  ActionMenuTriggerProps,
  ActionMenuPositionerProps,
  ActionMenuSurfaceProps,
} from "./action-menu";

export type {
  MenuDef,
  GroupDef,
  ItemDef,
  SubmenuDef,
  Menu,
  GroupNode,
  ItemNode,
  SubmenuNode,
  MenuNodeKind,
  SurfaceSlots,
  SurfaceSlotProps,
  SurfaceClassNames,
  ShellSlotProps,
  ShellClassNames,
  CreateActionMenuOptions,
  CreateActionMenuResult,
  SearchContext,
  ItemSlotProps,
  RowBindAPI,
  ContentBindAPI,
  InputBindAPI,
  ListBindAPI,
} from "./action-menu";

export { renderIcon, createActionMenu, defaultSlots } from "./action-menu";
