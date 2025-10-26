/** biome-ignore-all lint/a11y/useSemanticElements: This library renders ARIA-only primitives intentionally. */

import type { ClassNameValue } from "tailwind-merge";
import * as React from "react";
import { composeEventHandlers } from "@radix-ui/primitive";
import { composeRefs } from "@radix-ui/react-compose-refs";
import * as Popper from "@radix-ui/react-popper";
import { Portal } from "@radix-ui/react-portal";
import { Presence } from "@radix-ui/react-presence";
import { Primitive } from "@radix-ui/react-primitive";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flat, partition, pipe, prop, sortBy } from "remeda";
import { Drawer } from "vaul";

import { cn } from "../../lib/utils";
import { commandScore } from "./command-score";
import { InteractionGuard } from "./interaction-guard";
import { useMediaQuery } from "./use-media-query";

/* ================================================================================================
 * Types — Menu model (generic)
 * ============================================================================================== */

export type MenuNodeKind = "item" | "group" | "submenu";

export interface BaseDef<K extends MenuNodeKind> {
  /** The kind of node. */
  kind: K;
  /** Unique id for this node. */
  id: string;
  hidden?: boolean;
}

export interface Searchable {
  /** A human-readable label for the searchable item. */
  label?: string;
  /** A list of aliases for the node, used when searching/filtering. */
  keywords?: string[];
}

export type Iconish =
  | React.ReactNode
  | React.ReactElement
  | React.ElementType
  | React.ComponentType<{ className?: string }>;

interface StateDescriptor<T> {
  value: T;
  onValueChange: React.Dispatch<React.SetStateAction<T>>;
  defaultValue?: T;
}

export interface MenuState {
  input?: StateDescriptor<string>;
}

export type MenuDef<T = unknown> = MenuState & {
  id: string;
  title?: string;
  inputPlaceholder?: string;
  hideSearchUntilActive?: boolean;
  nodes?: NodeDef<T>[];
  defaults?: MenuNodeDefaults<T>;
  ui?: {
    slots?: Partial<ActionMenuSlots<T>>;
    slotProps?: Partial<ActionMenuSlotProps>;
    classNames?: Partial<ActionMenuClassNames>;
  };
};

export type ItemDef<T = unknown> = BaseDef<"item"> &
  Searchable & {
    icon?: Iconish;
    /** Arman is a bitch. */
    data?: T;
    onSelect?: (args: {
      node: Omit<ItemNode<T>, "onSelect">;
      search?: SearchContext;
    }) => void;
    closeOnSelect?: boolean;
    render?: (args: {
      node: ItemNode<T>;
      search?: SearchContext;
      mode: Omit<ResponsiveMode, "auto">;
      bind: RowBindAPI;
    }) => React.ReactNode;
  };

export type GroupDef<T = unknown> = BaseDef<"group"> & {
  nodes: (ItemDef<T> | SubmenuDef<any, any>)[];
  heading?: string;
};

export type SubmenuDef<T = unknown, TChild = unknown> = BaseDef<"submenu"> &
  Searchable &
  MenuState & {
    nodes?: NodeDef<TChild>[];
    data?: T;
    icon?: Iconish;
    title?: string;
    inputPlaceholder?: string;
    hideSearchUntilActive?: boolean;
    defaults?: MenuNodeDefaults<T>;
    ui?: {
      slots?: Partial<ActionMenuSlots<TChild>>;
      slotProps?: Partial<ActionMenuSlotProps>;
      classNames?: Partial<ActionMenuClassNames>;
    };
    render?: () => React.ReactNode;
  };

export type Menu<T = unknown> = Omit<MenuDef<T>, "nodes"> & {
  nodes: Node<T>[];
  surfaceId: string;
  depth: number;
};

/** Additional context passed to item/submenu renderers during search. */
export interface SearchContext {
  query: string;
  isDeep: boolean;
  score: number;
  breadcrumbs: string[];
  breadcrumbIds: string[];
}

/** Runtime node (instance) */
export interface BaseNode<K extends MenuNodeKind, D extends BaseDef<K>> {
  /** The kind of node. */
  kind: K;
  /** Unique id for this node. */
  id: string;
  hidden?: boolean;
  /** Owning menu surface at runtime. */
  parent: Menu<any>;
  /** Original author definition for this node. */
  def: D;
}

export type ItemNode<T = unknown> = BaseNode<"item", ItemDef<T>> &
  Omit<ItemDef<T>, "kind" | "hidden"> & {
    search?: SearchContext;
  };

export type GroupNode<T = unknown> = BaseNode<"group", GroupDef<T>> & {
  heading?: string;
  nodes: (ItemNode<T> | SubmenuNode<any>)[];
};

/** NOTE: Submenu node exposes its runtime child menu as `child` */
export type SubmenuNode<T = unknown, TChild = unknown> = BaseNode<
  "submenu",
  SubmenuDef<T, TChild>
> &
  Omit<SubmenuDef<T, TChild>, "kind" | "hidden" | "nodes"> & {
    child: Menu<TChild>;
    nodes: Node<TChild>[];
    search?: SearchContext;
  };

export type Node<T = unknown> =
  | ItemNode<T>
  | GroupNode<T>
  | SubmenuNode<T, any>;

export type NodeDef<T = unknown> =
  | ItemDef<T>
  | GroupDef<T>
  | SubmenuDef<T, any>;

/** Defaulted parts of nodes for convenience. */
export interface MenuNodeDefaults<T = unknown> {
  surface?: Pick<
    ActionMenuSurfaceProps<T>,
    "vimBindings" | "dir" | "onOpenAutoFocus" | "onCloseAutoClear"
  >;
  item?: Pick<ItemNode<T>, "onSelect" | "closeOnSelect">;
}

function instantiateMenuFromDef<T>(
  def: MenuDef<T>,
  surfaceId: string,
  depth: number,
): Menu<T> {
  const parentless: Menu<T> = {
    id: def.id,
    title: def.title,
    inputPlaceholder: def.inputPlaceholder,
    hideSearchUntilActive: def.hideSearchUntilActive,
    defaults: def.defaults,
    ui: def.ui,
    nodes: [] as Node<T>[],
    surfaceId,
    depth,
    input: def.input,
  };

  function inst<U>(d: NodeDef<U>, parent: Menu<any>): Node<U> {
    if (d.kind === "item") {
      const node: ItemNode<U> = {
        ...d,
        kind: "item",
        parent,
        def: d,
      };
      return node;
    }

    if (d.kind === "group") {
      const children = d.nodes.map((c) => inst<any>(c as NodeDef<any>, parent));
      const node: GroupNode<U> = {
        id: d.id,
        kind: "group",
        hidden: d.hidden,
        parent,
        def: d,
        heading: d.heading,
        nodes: children as (ItemNode<U> | SubmenuNode<any>)[],
      };
      return node;
    }

    // submenu
    const subDef = d as SubmenuDef<any, any>;
    const childSurfaceId = `${parent.surfaceId}::${subDef.id}`;

    // ! In TSX, don't write instantiateMenuFromDef<any>(...)
    // Use casts instead of a generic call to avoid `<any>` being parsed as JSX:
    const child = instantiateMenuFromDef(
      {
        id: subDef.id,
        title: subDef.title,
        inputPlaceholder: subDef.inputPlaceholder,
        hideSearchUntilActive: subDef.hideSearchUntilActive,
        nodes: subDef.nodes ?? [],
        defaults: subDef.defaults,
        ui: subDef.ui as MenuDef<any>["ui"],
        input: subDef.input,
      } as MenuDef<any>,
      childSurfaceId,
      parent.depth + 1,
    );

    const node: SubmenuNode<any, any> = {
      ...subDef,
      kind: "submenu",
      parent,
      def: d,
      child,
      nodes: child.nodes,
    };

    return node as Node<U>;
  }

  parentless.nodes = (def.nodes ?? []).map((n) =>
    inst(n as any, parentless),
  ) as any;
  return parentless;
}

/* ================================================================================================
 * Types — Renderer & bind APIs
 * ============================================================================================== */

type DivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
type ButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
type Children = Pick<DivProps, "children">;

/** Row interaction & wiring helpers provided to slot renderers. */
export interface RowBindAPI {
  focused: boolean;
  disabled: boolean;
  getRowProps: <T extends React.HTMLAttributes<HTMLElement>>(
    overrides?: T,
  ) => T & {
    ref: React.Ref<any>;
    id: string;
    role: "option";
    tabIndex: -1;
    "data-action-menu-item-id": string;
    "data-focused"?: "true";
    "aria-selected"?: boolean;
    "aria-disabled"?: boolean;
  };
}

/** Content/surface wiring helpers provided to slot renderers. */
export interface ContentBindAPI {
  getContentProps: <T extends React.HTMLAttributes<HTMLElement>>(
    overrides?: T,
  ) => T & {
    ref: React.Ref<any>;
    role: "menu";
    tabIndex: -1;
    "data-slot": "action-menu-content";
    "data-state": "open" | "closed";
    "data-action-menu-surface": true;
    "data-surface-id": string;
  };
}

/** Search input wiring helpers provided to slot renderers. */
export interface InputBindAPI {
  getInputProps: <T extends React.InputHTMLAttributes<HTMLInputElement>>(
    overrides?: T,
  ) => T & {
    ref: React.Ref<any>;
    role: "combobox";
    "data-slot": "action-menu-input";
    "data-action-menu-input": true;
    "aria-autocomplete": "list";
    "aria-expanded": true;
    "aria-controls"?: string;
    "aria-activedescendant"?: string;
  };
}

/** List wiring helpers provided to slot renderers. */
export interface ListBindAPI {
  getListProps: <T extends React.HTMLAttributes<HTMLElement>>(
    overrides?: T,
  ) => T & {
    ref: React.Ref<any>;
    role: "listbox";
    id: string;
    tabIndex: number;
    "data-slot": "action-menu-list";
    "data-action-menu-list": true;
    "aria-activedescendant"?: string;
  };
  getItemOrder: () => string[];
  getActiveId: () => string | null;
}

/* ================================================================================================
 * Types — ClassNames & SlotProps (SPLIT into Shell vs Surface)
 * ============================================================================================== */

/** ClassNames that style the *shell* (overlay / drawer container / trigger). */
export interface ShellClassNames {
  // root?: string
  drawerOverlay?: string;
  drawerContent?: string;
  drawerContentInner?: string;
  drawerHandle?: string;
  trigger?: string;
}

/** ClassNames that style the *surface* (content/list/items/etc.). */
export interface SurfaceClassNames {
  // root?: string // (reserved) if you wrap the entire surface
  content?: string;
  input?: string;
  list?: string;
  itemWrapper?: string;
  item?: string;
  subtriggerWrapper?: string;
  subtrigger?: string;
  group?: string;
  groupHeading?: string;
}

export type ActionMenuClassNames = ShellClassNames & SurfaceClassNames;

/** Slot props forwarded to the *shell* (Vaul). */
export interface ShellSlotProps {
  positioner?: Partial<Omit<ActionMenuPositionerProps, "children">>;
  drawerRoot?: Partial<React.ComponentProps<typeof Drawer.Root>>;
  drawerOverlay?: React.ComponentPropsWithoutRef<typeof Drawer.Overlay>;
  drawerContent?: React.ComponentPropsWithoutRef<typeof Drawer.Content>;
}

/** Slot props forwarded to *surface* slots (Input/List/Content/Header/Footer). */
export interface SurfaceSlotProps {
  content?: React.HTMLAttributes<HTMLElement>;
  header?: React.HTMLAttributes<HTMLElement>;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  list?: React.HTMLAttributes<HTMLElement>;
  footer?: React.HTMLAttributes<HTMLElement>;
}

export type ActionMenuSlotProps = ShellSlotProps & SurfaceSlotProps;

export interface ItemSlotProps<T = unknown> {
  node: ItemNode<T>;
  search?: SearchContext;
  mode: Omit<ResponsiveMode, "auto">;
  bind: RowBindAPI;
}

export interface ListSlotProps<T = unknown> {
  query?: string;
  nodes: Node<T>[];
  children: React.ReactNode;
  bind: ListBindAPI;
}

/** Slot renderers to customize visuals. */
export interface SurfaceSlots<T = unknown> {
  Content: (args: {
    menu: Menu<T>;
    children: React.ReactNode;
    bind: ContentBindAPI;
  }) => React.ReactNode;
  Header?: (args: { menu: Menu<T> }) => React.ReactNode;
  Input: (args: {
    value: string;
    onChange: (v: string) => void;
    bind: InputBindAPI;
  }) => React.ReactNode;
  List: (args: ListSlotProps<T>) => React.ReactNode;
  Empty?: (args: { query: string }) => React.ReactNode;
  Item: (args: ItemSlotProps<T>) => React.ReactNode;
  SubmenuTrigger: (args: {
    node: SubmenuNode<T>;
    search?: SearchContext;
    bind: RowBindAPI;
  }) => React.ReactNode;
  Footer?: (args: { menu: Menu<T> }) => React.ReactNode;
}

export type ActionMenuSlots<T = unknown> = SurfaceSlots<T>;

export function defaultSlots<T>(): Required<SurfaceSlots<T>> {
  return {
    Content: ({ children, bind }) => (
      <div {...bind.getContentProps()}>{children}</div>
    ),
    Header: () => null,
    Input: ({ value, onChange, bind }) => (
      <input
        {...bind.getInputProps({
          value,
          onChange: (e) => onChange(e.target.value),
        })}
      />
    ),
    List: ({ children, bind }) => (
      <div {...bind.getListProps()}>{children}</div>
    ),
    Empty: ({ query }) => (
      <div data-slot="action-menu-empty">
        No results{query ? ` for “${query}”` : ""}.
      </div>
    ),
    Item: ({ node, bind }) => (
      <li {...bind.getRowProps()}>
        {node.icon ? <span aria-hidden>{renderIcon(node.icon)}</span> : null}
        <span>{node.label ?? String(node.id)}</span>
      </li>
    ),
    SubmenuTrigger: ({ node, bind }) => (
      <li {...bind.getRowProps()}>
        {node.icon ? <span aria-hidden>{renderIcon(node.icon)}</span> : null}
        <span>{node.label ?? node.title ?? String(node.id)}</span>
      </li>
    ),
    Footer: () => null,
  };
}

/* ================================================================================================
 * Utils
 * ============================================================================================== */

const HANDLER_KEYS = [
  "onClick",
  "onKeyDown",
  "onKeyUp",
  "onMouseDown",
  "onMouseUp",
  "onMouseEnter",
  "onMouseLeave",
  "onPointerDown",
  "onPointerUp",
  "onFocus",
  "onBlur",
] as const;

/** Merge two sets of React props (className, handlers, refs are composed). */
function mergeProps<
  A extends Record<string, any>,
  B extends Record<string, any>,
>(base: A | undefined, overrides?: B): A & B {
  const a: any = base ?? {};
  const b: any = overrides ?? {};
  const merged: any = { ...a, ...b };
  if (a.className || b.className)
    merged.className = cn(a.className, b.className);
  for (const key of HANDLER_KEYS) {
    const aH = a[key];
    const bH = b[key];
    if (aH || bH) merged[key] = composeEventHandlers(aH, bH);
  }
  if (a.ref || b.ref) merged.ref = composeRefs(a.ref, b.ref);
  return merged;
}

function mergeClassNames<T extends Record<string, ClassNameValue>>(a: T, b: T) {
  const merged: Record<string, ClassNameValue> = {};

  Object.keys(a).forEach((key) => {
    merged[key] = a[key];
  });

  Object.keys(b).forEach((key) => {
    merged[key] = cn(a[key] ?? "", b[key]);
  });

  return merged;
}

/** True when the ReactNode is an element that carries `propName`. */
function isElementWithProp(node: React.ReactNode, propName: string) {
  return React.isValidElement(node) && propName in (node.props as any);
}

/** True when any descendant element carries `propName`. */
function hasDescendantWithProp(
  node: React.ReactNode,
  propName: string,
): boolean {
  if (!node) return false;
  if (Array.isArray(node))
    return node.some((n) => hasDescendantWithProp(n, propName));
  if (React.isValidElement(node)) {
    if (propName in (node.props as any)) return true;
    const ch = (node.props as any)?.children;
    return hasDescendantWithProp(ch, propName);
  }
  return false;
}

/** Render an icon from heterogeneous inputs (node, element, component). */
export function renderIcon(icon?: Iconish, className?: string) {
  if (!icon) return null;
  if (typeof icon === "string") return icon;
  if (React.isValidElement(icon)) {
    const prev = (icon.props as any)?.className;
    return React.cloneElement(icon as any, { className: cn(prev, className) });
  }
  const Comp = icon as React.ElementType;
  return <Comp className={className} />;
}

/** Hit-test a point (x,y) against a DOMRect. */
function isInBounds(x: number, y: number, rect: DOMRect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/** Find the input & list elements within a surface container. */
function findWidgetsWithinSurface(surface: HTMLElement | null) {
  const input =
    surface?.querySelector<HTMLInputElement>("[data-action-menu-input]") ??
    null;
  const list =
    surface?.querySelector<HTMLElement>("[data-action-menu-list]") ?? null;
  return { input, list };
}

/* ================================================================================================
 * Keyboard helpers & options
 * ============================================================================================== */

export type Direction = "ltr" | "rtl";

export const SELECTION_KEYS = ["Enter"] as const;
export const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"] as const;
export const LAST_KEYS = ["ArrowUp", "PageDown", "End"] as const;

export const SUB_OPEN_KEYS: Record<Direction, readonly string[]> = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"],
};
export const SUB_CLOSE_KEYS: Record<Direction, readonly string[]> = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"],
};

export const isSelectionKey = (k: string) =>
  (SELECTION_KEYS as readonly string[]).includes(k);
export const isFirstKey = (k: string) =>
  (FIRST_KEYS as readonly string[]).includes(k);
export const isLastKey = (k: string) =>
  (LAST_KEYS as readonly string[]).includes(k);
export const isOpenKey = (dir: Direction, k: string) =>
  SUB_OPEN_KEYS[dir].includes(k);
export const isCloseKey = (dir: Direction, k: string) =>
  SUB_CLOSE_KEYS[dir].includes(k);
export const isVimNext = (e: React.KeyboardEvent) =>
  e.ctrlKey && (e.key === "n" || e.key === "j");
export const isVimPrev = (e: React.KeyboardEvent) =>
  e.ctrlKey && (e.key === "p" || e.key === "k");
export const isVimOpen = (e: React.KeyboardEvent) => e.ctrlKey && e.key === "l";
export const isVimClose = (e: React.KeyboardEvent) =>
  e.ctrlKey && e.key === "h";

export const getDir = (explicit?: Direction): Direction => {
  if (explicit) return explicit;
  if (typeof document !== "undefined") {
    const d = document.dir.toLowerCase();
    if (d === "rtl" || d === "ltr") return d as Direction;
  }
  return "ltr";
};

/** Keyboard options context */
interface KeyboardOptions {
  dir: Direction;
  vimBindings: boolean;
}
const KeyboardCtx = React.createContext<KeyboardOptions>({
  dir: "ltr",
  vimBindings: true,
});
const useKeyboardOpts = () => React.useContext(KeyboardCtx);

/* ================================================================================================
 * Custom events (open/select/internal notifications)
 * ============================================================================================== */

const CLOSE_MENU_EVENT = "actionmenu-close" as const;
const OPEN_SUB_EVENT = "actionmenu-open-sub" as const;
const SELECT_ITEM_EVENT = "actionmenu-select-item" as const;
const INPUT_VISIBILITY_CHANGE_EVENT =
  "actionmenu-input-visibility-change" as const;

function dispatch(node: HTMLElement | null | undefined, type: string) {
  if (!node) return;
  node.dispatchEvent(new CustomEvent(type, { bubbles: true }));
}

function openSubmenuForActive(activeId: string | null) {
  const el = activeId ? document.getElementById(activeId) : null;
  if (el && el.dataset.subtrigger === "true") {
    dispatch(el, OPEN_SUB_EVENT);
  }
}

/* ================================================================================================
 * Root / Shell context & Focus context
 * ============================================================================================== */

export type ResponsiveMode = "auto" | "drawer" | "dropdown";
export interface ResponsiveConfig {
  mode: ResponsiveMode;
  query: string;
}

interface RootContextValue {
  scopeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenToggle: () => void;
  modal: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  debug: boolean;
  responsive: ResponsiveConfig;
  slotProps?: Partial<ActionMenuSlotProps>;
  classNames?: Partial<ActionMenuClassNames>;
  openSurfaceIds: React.RefObject<Map<string, number>>;
  registerSurface: (surfaceId: string, depth: number) => void;
  unregisterSurface: (surfaceId: string) => void;
  closeAllSurfaces: () => void;
}
const RootCtx = React.createContext<RootContextValue | null>(null);
const useRootCtx = () => {
  const ctx = React.useContext(RootCtx);
  if (!ctx) throw new Error("useActionMenu must be used within an ActionMenu");
  return ctx;
};

/** Provides a stable id string for the current surface. */
const SurfaceIdCtx = React.createContext<string | null>(null);
const useSurfaceId = () => React.useContext(SurfaceIdCtx);

type MenuDisplayMode = Omit<ResponsiveMode, "auto">;
const DisplayModeCtx = React.createContext<MenuDisplayMode>("dropdown");
const useDisplayMode = () => React.useContext(DisplayModeCtx);

/** Submenu context (open state/refs/ids). */
interface SubContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenToggle: () => void;
  triggerRef: React.RefObject<HTMLDivElement | HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  parentSurfaceId: string;
  triggerItemId: string | null;
  setTriggerItemId: (id: string | null) => void;
  parentSetActiveId: (id: string | null, cause?: ActivationCause) => void;
  childSurfaceId: string;
  pendingOpenModalityRef: React.RefObject<"keyboard" | "pointer" | null>;
  intentZoneActiveRef: React.RefObject<boolean>;
  parentSub: SubContextValue | null;
}
const SubCtx = React.createContext<SubContextValue | null>(null);
const useSubCtx = () => React.useContext(SubCtx);

function closeSubmenuChain(
  sub: SubContextValue | null,
  root: RootContextValue,
) {
  let current = sub;
  while (current) {
    current.onOpenChange(false);
    current = current.parentSub;
  }
  root.onOpenChange(false);
}

/** Focus owner context (which surface owns real DOM focus). */
interface FocusOwnerCtxValue {
  ownerId: string | null;
  setOwnerId: (id: string | null) => void;
}
const FocusOwnerCtx = React.createContext<FocusOwnerCtxValue | null>(null);
const useFocusOwner = () => {
  const ctx = React.useContext(FocusOwnerCtx);
  if (!ctx) throw new Error("FocusOwnerCtx missing");
  return ctx;
};

/* ================================================================================================
 * Surface store (per Content/Surface) — roving focus & registration
 * ============================================================================================== */

interface SurfaceState {
  activeId: string | null;
  hasInput: boolean;
  listId: string | null;
}

interface RowRecord {
  ref: React.RefObject<HTMLElement>;
  disabled?: boolean;
  kind: "item" | "submenu";
  openSub?: () => void;
  closeSub?: () => void;
}

type ActivationCause = "keyboard" | "pointer" | "programmatic";

interface SurfaceStore {
  subscribe(cb: () => void): () => void;
  snapshot(): SurfaceState;
  set<K extends keyof SurfaceState>(k: K, v: SurfaceState[K]): void;

  registerRow(id: string, rec: RowRecord): void;
  unregisterRow(id: string): void;
  getOrder(): string[];
  resetOrder(ids: string[]): void;

  setActiveId(id: string | null, cause?: ActivationCause): void;
  setActiveByIndex(idx: number, cause?: ActivationCause): void;
  first(cause?: ActivationCause): void;
  last(cause?: ActivationCause): void;
  next(cause?: ActivationCause): void;
  prev(cause?: ActivationCause): void;

  readonly rows: Map<string, RowRecord>;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
  readonly listRef: React.RefObject<HTMLDivElement | null>;
}

function createSurfaceStore(): SurfaceStore {
  const state: SurfaceState = { activeId: null, hasInput: true, listId: null };
  const listeners = new Set<() => void>();
  const rows = new Map<string, RowRecord>();
  const order: string[] = [];
  const listRef = React.createRef<HTMLDivElement | null>();
  const inputRef = React.createRef<HTMLInputElement | null>();

  const emit = () =>
    listeners.forEach((l) => {
      l();
    });
  const snapshot = () => state;
  const set = <K extends keyof SurfaceState>(k: K, v: SurfaceState[K]) => {
    if (Object.is((state as any)[k], v)) return;
    (state as any)[k] = v;
    emit();
  };

  const getOrder = () => order.slice();
  const resetOrder = (ids: string[]) => {
    order.splice(0);
    order.push(...ids);
    emit();
  };

  const ensureActiveExists = () => {
    if (state.activeId && rows.has(state.activeId)) return;
    state.activeId = order[0] ?? null;
  };

  const setActiveId = (
    id: string | null,
    cause: ActivationCause = "keyboard",
  ) => {
    const prev = state.activeId;
    if (Object.is(prev, id)) return;
    state.activeId = id;
    // Close any open submenu that is not the active trigger
    for (const [rid, rec] of rows) {
      if (rec.kind === "submenu" && rec.closeSub && rid !== id) {
        try {
          rec.closeSub();
        } catch {
          //
        }
      }
    }
    emit();
    // Scroll active row into view when keyboard navigating
    if (cause !== "keyboard") return;
    const el = id ? rows.get(id)?.ref.current : null;
    const listEl = listRef.current;
    if (el && listEl) {
      try {
        const inList = listEl.contains(el);
        if (inList) el.scrollIntoView({ block: "nearest" });
      } catch {
        //
      }
    }
  };

  const setActiveByIndex = (
    idx: number,
    cause: ActivationCause = "keyboard",
  ) => {
    if (!order.length) return setActiveId(null, cause);
    const clamped = idx < 0 ? 0 : idx >= order.length ? order.length - 1 : idx;
    setActiveId(order[clamped] ?? null, cause);
  };
  const first = (cause: ActivationCause = "keyboard") =>
    setActiveByIndex(0, cause);
  const last = (cause: ActivationCause = "keyboard") =>
    setActiveByIndex(order.length - 1, cause);
  const next = (cause: ActivationCause = "keyboard") => {
    if (!order.length) return setActiveId(null, cause);
    const i = state.activeId ? order.indexOf(state.activeId) : -1;
    const n = i === -1 ? 0 : (i + 1) % order.length;
    setActiveId(order[n] ?? null, cause);
  };
  const prev = (cause: ActivationCause = "keyboard") => {
    if (!order.length) return setActiveId(null, cause);
    const i = state.activeId ? order.indexOf(state.activeId) : 0;
    const p = i <= 0 ? order.length - 1 : i - 1;
    setActiveId(order[p] ?? null, cause);
  };

  return {
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    snapshot,
    set,
    registerRow(id, rec) {
      if (!rows.has(id)) order.push(id);
      rows.set(id, rec);
      ensureActiveExists();
      emit();
    },
    unregisterRow(id) {
      rows.delete(id);
      const idx = order.indexOf(id);
      if (idx >= 0) order.splice(idx, 1);
      if (state.activeId === id) {
        ensureActiveExists();
        emit();
      } else {
        emit();
      }
    },
    getOrder,
    resetOrder,
    setActiveId,
    setActiveByIndex,
    first,
    last,
    next,
    prev,
    rows,
    inputRef,
    listRef,
  };
}

function useSurfaceSel<T>(store: SurfaceStore, sel: (s: SurfaceState) => T): T {
  const get = React.useCallback(() => sel(store.snapshot()), [store, sel]);
  return React.useSyncExternalStore(store.subscribe, get, get);
}

/* ================================================================================================
 * Hover policy / Aim guard (to reduce accidental submenu closures)
 * ============================================================================================== */

interface HoverPolicy {
  suppressHoverOpen: boolean;
  clearSuppression: () => void;
  aimGuardActive: boolean;
  guardedTriggerId: string | null;
  activateAimGuard: (triggerId: string, timeoutMs?: number) => void;
  clearAimGuard: () => void;
  aimGuardActiveRef: React.RefObject<boolean | null>;
  guardedTriggerIdRef: React.RefObject<string | null>;
  isGuardBlocking: (rowId: string) => boolean;
}

const HoverPolicyCtx = React.createContext<HoverPolicy>({
  suppressHoverOpen: false,
  clearSuppression: () => {
    //
  },
  aimGuardActive: false,
  guardedTriggerId: null,
  activateAimGuard: () => {
    //
  },
  clearAimGuard: () => {
    //
  },
  aimGuardActiveRef: React.createRef<boolean>(),
  guardedTriggerIdRef: React.createRef(),
  isGuardBlocking: () => false,
});
const useHoverPolicy = () => React.useContext(HoverPolicyCtx);

/** Keep the last N mouse positions without causing re-renders. */
function useMouseTrail(n = 2) {
  const trailRef = React.useRef<[number, number][]>([]);
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const a = trailRef.current;
      a.push([e.clientX, e.clientY]);
      if (a.length > n) a.shift();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [n]);
  return trailRef;
}

type AnchorSide = "left" | "right";
function resolveAnchorSide(
  rect: DOMRect,
  tRect: DOMRect | null,
  mx: number,
): AnchorSide {
  if (tRect) {
    const tx = (tRect.left + tRect.right) / 2;
    const dL = Math.abs(tx - rect.left);
    const dR = Math.abs(tx - rect.right);
    return dL <= dR ? "left" : "right";
  }
  return mx < rect.left ? "left" : "right";
}

function getSmoothedHeading(
  trail: [number, number][],
  exitX: number,
  exitY: number,
  anchor: AnchorSide,
  tRect: DOMRect | null,
  rect: DOMRect,
): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;
  const n = Math.min(Math.max(trail.length - 1, 0), 4);
  for (let i = trail.length - n - 1; i < trail.length - 1; i++) {
    if (i < 0) continue;
    const [x1, y1] = trail[i]!;
    const [x2, y2] = trail[i + 1]!;
    dx += x2 - x1;
    dy += y2 - y1;
  }
  const mag = Math.hypot(dx, dy);
  if (mag < 0.5) {
    const tx = tRect ? (tRect.left + tRect.right) / 2 : exitX;
    const ty = tRect ? (tRect.top + tRect.bottom) / 2 : exitY;
    const edgeX = anchor === "right" ? rect.left : rect.right;
    const edgeCy = (rect.top + rect.bottom) / 2;
    dx = edgeX - tx;
    dy = edgeCy - ty;
  }
  return { dx, dy };
}

function willHitSubmenu(
  exitX: number,
  exitY: number,
  heading: { dx: number; dy: number },
  rect: DOMRect,
  anchor: AnchorSide,
  triggerRect: DOMRect | null,
): boolean {
  const { dx, dy } = heading;
  if (Math.abs(dx) < 0.01) return false;
  if (anchor === "left" && dx <= 0) return false;
  if (anchor === "right" && dx >= 0) return false;
  const edgeX = anchor === "left" ? rect.left : rect.right;
  const t = (edgeX - exitX) / dx;
  if (t <= 0) return false;
  const yAtEdge = exitY + t * dy;
  const baseBand = triggerRect ? triggerRect.height * 0.75 : 28;
  const extra = Math.max(12, Math.min(36, baseBand));
  const top = rect.top - extra * 0.25;
  const bottom = rect.bottom + extra * 0.25;
  return yAtEdge >= top && yAtEdge <= bottom;
}

/** Visual-only debug polygon showing the aim-guard band. */
function IntentZone({
  parentRef,
  triggerRef,
  visible = false,
}: {
  parentRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
  visible?: boolean;
}) {
  const [mx, my] = useMousePosition();
  const isCoarse = React.useMemo(
    () =>
      typeof window !== "undefined"
        ? matchMedia("(pointer: coarse)").matches
        : false,
    [],
  );
  const content = parentRef.current;
  const rect = content?.getBoundingClientRect();
  if (!rect || isCoarse) return null;
  const tRect = triggerRef.current?.getBoundingClientRect() ?? null;
  const x = rect.left;
  const y = rect.top;
  const w = rect.width;
  const h = rect.height;
  if (!w || !h) return null;
  const anchor = resolveAnchorSide(rect, tRect, mx);
  if (anchor === "left" && mx >= x) return null;
  if (anchor === "right" && mx <= x + w) return null;
  const INSET = 2;
  const pct = Math.max(0, Math.min(100, ((my - y) / h) * 100));
  const width =
    anchor === "left"
      ? Math.max(x - mx, 10) + INSET
      : Math.max(mx - (x + w), 10) + INSET;
  const left = anchor === "left" ? x - width : x + w;
  const clip =
    anchor === "left"
      ? `polygon(100% 0%, 0% ${pct}%, 100% 100%)`
      : `polygon(0% 0%, 0% 100%, 100% ${pct}%)`;
  const Polygon = (
    <div
      data-action-menu-intent-zone
      aria-hidden
      style={{
        position: "fixed",
        top: y,
        left,
        width,
        height: h,
        pointerEvents: "none",
        clipPath: clip,
        zIndex: Number.MAX_SAFE_INTEGER,
        background: visible ? "rgba(0, 136, 255, 0.15)" : "transparent",
        transform: "translateZ(0)",
      }}
    />
  );
  return <Portal>{Polygon}</Portal>;
}

function useMousePosition(): [number, number] {
  const [pos, setPos] = React.useState<[number, number]>([0, 0]);
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => setPos([e.clientX, e.clientY]);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pos;
}

/* ================================================================================================
 * Keyboard handling shared by Input/List
 * ============================================================================================== */

function useNavKeydown(source: "input" | "list") {
  const store = useSurface();
  const root = useRootCtx();
  const sub = useSubCtx();
  const surfaceId = useSurfaceId() || "root";
  const { ownerId, setOwnerId } = useFocusOwner();
  const { dir, vimBindings } = useKeyboardOpts();

  return React.useCallback(
    (e: React.KeyboardEvent) => {
      if (ownerId !== surfaceId) return;
      const k = e.key;
      const stop = () => {
        e.preventDefault();
        e.stopPropagation();
      };
      if (vimBindings) {
        if (isVimNext(e)) {
          stop();
          store.next();
          return;
        }
        if (isVimPrev(e)) {
          stop();
          store.prev();
          return;
        }
        if (isVimOpen(e)) {
          stop();
          const activeId = store.snapshot().activeId;
          if (isSelectionKey(k)) {
            const el = activeId ? document.getElementById(activeId) : null;
            if (el && el.dataset.subtrigger === "true") {
              openSubmenuForActive(activeId);
            } else {
              dispatch(el, SELECT_ITEM_EVENT);
            }
          } else {
            openSubmenuForActive(activeId);
          }
          return;
        }
        if (isVimClose(e)) {
          if (sub) {
            stop();
            setOwnerId(sub.parentSurfaceId);
            sub.onOpenChange(false);
            sub.parentSetActiveId(sub.triggerItemId);
            const parentEl = document.querySelector<HTMLElement>(
              `[data-surface-id="${sub.parentSurfaceId}"]`,
            );
            requestAnimationFrame(() => {
              const { input, list } = findWidgetsWithinSurface(parentEl);
              (input ?? list)?.focus();
            });
            return;
          }
        }
      }
      if (k === "Tab") {
        stop();
        return;
      }
      if (k === "ArrowDown") {
        stop();
        store.next();
        return;
      }
      if (k === "ArrowUp") {
        stop();
        store.prev();
        return;
      }
      if (k === "Home" || k === "PageUp") {
        stop();
        store.first();
        return;
      }
      if (k === "End" || k === "PageDown") {
        stop();
        store.last();
        return;
      }

      if (isOpenKey(dir, k)) {
        stop();
        const activeId = store.snapshot().activeId;
        if (isSelectionKey(k)) {
          const el = activeId ? document.getElementById(activeId) : null;
          if (el && el.dataset.subtrigger === "true") {
            openSubmenuForActive(activeId);
          } else {
            dispatch(el, SELECT_ITEM_EVENT);
          }
        } else {
          openSubmenuForActive(activeId);
        }
        return;
      }

      if (isCloseKey(dir, k)) {
        if (sub) {
          stop();
          setOwnerId(sub.parentSurfaceId);
          sub.onOpenChange(false);
          sub.parentSetActiveId(sub.triggerItemId);
          const parentEl = document.querySelector<HTMLElement>(
            `[data-surface-id="${sub.parentSurfaceId}"]`,
          );
          requestAnimationFrame(() => {
            const { input, list } = findWidgetsWithinSurface(parentEl);
            (input ?? list)?.focus();
          });
          return;
        }
      }

      if (k === "Enter") {
        stop();
        const activeId = store.snapshot().activeId;
        const el = activeId ? document.getElementById(activeId) : null;
        if (el && el.dataset.subtrigger === "true") {
          openSubmenuForActive(activeId);
        } else {
          dispatch(el, SELECT_ITEM_EVENT);
        }
        return;
      }

      if (k === "Escape") {
        stop();
        if (sub) {
          sub.onOpenChange(false);
          return;
        }
        root.onOpenChange(false);
        return;
      }
    },
    [store, root, sub, dir, vimBindings, ownerId, setOwnerId, surfaceId],
  );
}

/* ================================================================================================
 * Positioner (Dropdown-only for root; always dropdown for submenus)
 * ============================================================================================== */

export interface ActionMenuPositionerProps {
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?:
    | number
    | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  alignToFirstItem?: false | "on-open" | "always";
}

export const Positioner: React.FC<ActionMenuPositionerProps> = ({
  children,
  side,
  align = "start",
  sideOffset = 8,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  alignToFirstItem = "on-open",
}) => {
  const root = useRootCtx();
  const sub = useSubCtx();

  const isSub = !!sub;
  const present = isSub ? sub.open : root.open;
  const defaultSide = isSub ? "right" : "bottom";
  const resolvedSide = side ?? defaultSide;
  const mode = useDisplayMode();

  const [firstRowAlignOffset, setFirstRowAlignOffset] = React.useState(0);

  const findContentEl = React.useCallback((): HTMLElement | null => {
    if (!sub) return null;
    const byRef = sub.contentRef.current;
    if (byRef) return byRef;
    try {
      return document.querySelector<HTMLElement>(
        `[data-surface-id="${sub.childSurfaceId}"]`,
      );
    } catch {
      return null;
    }
  }, [sub]);

  const measure = React.useCallback(() => {
    if (!isSub || !present || !alignToFirstItem) {
      setFirstRowAlignOffset(0);
      return;
    }
    if (!(resolvedSide === "right" || resolvedSide === "left")) {
      setFirstRowAlignOffset(0);
      return;
    }
    const el = findContentEl();
    if (!el) return;
    const inputEl = el.querySelector<HTMLElement>("[data-action-menu-input]");
    const hasVisibleInput = !!inputEl && inputEl.offsetParent !== null;
    const listEl = el.querySelector<HTMLElement>(
      '[data-slot="action-menu-list"]',
    );
    const firstRow = listEl?.querySelector("li");
    if (!hasVisibleInput || !firstRow) {
      setFirstRowAlignOffset(0);
      return;
    }
    const cr = el.getBoundingClientRect();
    const fr = firstRow.getBoundingClientRect();
    setFirstRowAlignOffset(-Math.round(fr.top - cr.top));
  }, [isSub, present, alignToFirstItem, resolvedSide, sub]);

  React.useEffect(() => {
    if (!isSub || !present || !alignToFirstItem) return;

    let af: number;

    const handle = (e: Event) => {
      const customEvent = e as CustomEvent<{
        surfaceId?: string;
        hideSearchUntilActive?: boolean;
        inputActive?: boolean;
      }>;
      const target = e.target as HTMLElement | null;
      const ok =
        customEvent.detail?.surfaceId === sub.childSurfaceId ||
        target?.closest?.(`[data-surface-id="${sub.childSurfaceId}"]`) !== null;
      if (!ok) return;
      if (
        alignToFirstItem === "on-open" &&
        customEvent.detail?.hideSearchUntilActive &&
        customEvent.detail?.inputActive
      ) {
        return;
      }

      af = requestAnimationFrame(() => {
        measure();
      });
    };
    document.addEventListener(INPUT_VISIBILITY_CHANGE_EVENT, handle, true);
    return () => {
      cancelAnimationFrame(af);
      document.removeEventListener(INPUT_VISIBILITY_CHANGE_EVENT, handle, true);
    };
  }, [isSub, sub, present, alignToFirstItem, measure]);

  const effectiveAlignOffset =
    isSub && alignToFirstItem ? firstRowAlignOffset : alignOffset;

  const popperContentProps: React.ComponentProps<typeof Popper.Content> =
    React.useMemo(
      () => ({
        asChild: true,
        side: resolvedSide,
        align: align,
        sideOffset: sideOffset,
        alignOffset: effectiveAlignOffset,
        avoidCollisions: avoidCollisions,
        collisionPadding: collisionPadding,
        style: {
          "--action-menu-available-height":
            "var(--radix-popper-available-height, 0px)",
          "--action-menu-available-width":
            "var(--radix-popper-available-width, 0px)",
        } as React.CSSProperties,
      }),
      [
        resolvedSide,
        align,
        sideOffset,
        effectiveAlignOffset,
        avoidCollisions,
        collisionPadding,
      ],
    );

  // NOTE: For the root surface in drawer mode, Positioner is a no-op pass-through.
  // For submenus, we always position with Popper (even in drawer mode).
  if (mode === "drawer" && !isSub) {
    return <>{children}</>;
  }

  const content = isSub ? (
    <Portal>
      <Presence present={present}>
        <InteractionGuard.Branch asChild scopeId={root.scopeId}>
          <Popper.Content {...popperContentProps}>{children}</Popper.Content>
        </InteractionGuard.Branch>
      </Presence>
    </Portal>
  ) : (
    <Portal>
      <Presence present={present}>
        <InteractionGuard.Root
          asChild
          scopeId={root.scopeId}
          disableOutsidePointerEvents={root.modal}
          onEscapeKeyDown={() => {
            root.closeAllSurfaces();
          }}
          onInteractOutside={(event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest?.("[data-action-menu-surface]")) return;
            event.preventDefault();
            root.closeAllSurfaces();
          }}
        >
          <Popper.Content {...popperContentProps}>{children}</Popper.Content>
        </InteractionGuard.Root>
      </Presence>
    </Portal>
  );

  return (
    <>
      {content}
      {isSub && present ? (
        <IntentZone
          parentRef={sub.contentRef as React.RefObject<HTMLElement | null>}
          triggerRef={sub.triggerRef as React.RefObject<HTMLElement | null>}
          visible={root.debug}
        />
      ) : null}
    </>
  );
};

/* ================================================================================================
 * Surface (formerly ContentBase) — generic, shell-agnostic
 * ============================================================================================== */

export interface ActionMenuSurfaceProps<T = unknown>
  extends Omit<DivProps, "dir" | "children"> {
  menu: MenuDef<T> | Menu<T>;
  render?: () => React.ReactNode;
  vimBindings?: boolean;
  dir?: Direction;
  defaults?: Partial<MenuNodeDefaults<T>>;
  slots?: Partial<ActionMenuSlots<T>>;
  slotProps?: Partial<ActionMenuSlotProps>;
  classNames?: Partial<ActionMenuClassNames>;
  onOpenAutoFocus?: boolean;
  onCloseAutoClear?: boolean | number;
  /** @internal Forced surface id; used by submenus. */
  surfaceIdProp?: string;
  /** @internal Suppress hover-open until first pointer move; used by submenus opened via keyboard. */
  suppressHoverOpenOnMount?: boolean;
}

const SurfaceCtx = React.createContext<SurfaceStore | null>(null);
const useSurface = () => {
  const ctx = React.useContext(SurfaceCtx);
  if (!ctx) throw new Error("SurfaceCtx missing");
  return ctx;
};

const Surface = React.forwardRef(function Surface<T>(
  {
    menu: menuProp,
    render: renderProp,
    vimBindings = true,
    dir: dirProp,
    surfaceIdProp,
    suppressHoverOpenOnMount,
    defaults: defaultsOverrides,
    slots: slotOverrides,
    slotProps: slotPropOverrides,
    classNames: classNameOverrides,
    // shellSlotProps: shellSlotPropsOverrides,
    // surfaceSlots: surfaceSlotOverrides,
    // surfaceSlotProps: surfaceSlotPropsOverrides,
    // classNames,
    onOpenAutoFocus = true, // reserved
    onCloseAutoClear = true,
    ...props
  }: ActionMenuSurfaceProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const root = useRootCtx();
  const sub = useSubCtx();
  const surfaceId = React.useMemo(
    () => surfaceIdProp ?? sub?.childSurfaceId ?? "root",
    [surfaceIdProp, sub],
  );
  const menu = React.useMemo<Menu<T>>(() => {
    if ((menuProp as any)?.surfaceId) return menuProp as Menu<T>;
    // depth: root = 0, submenu = parent.depth + 1 (if you have access to parent via sub)
    const depth = sub ? 1 : 0;
    return instantiateMenuFromDef(menuProp as MenuDef<T>, surfaceId, depth);
  }, [menuProp, surfaceId, sub]);
  const mode = useDisplayMode();
  const { ownerId, setOwnerId } = useFocusOwner();
  const isOwner = ownerId === surfaceId;
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const composedRef = composeRefs(
    ref,
    surfaceRef,
    sub ? (sub.contentRef as any) : undefined,
  );
  const dir = getDir(dirProp);

  const [value, setValue] = useControllableState({
    prop: menu.input?.value,
    defaultProp: menu.input?.defaultValue ?? "",
    onChange: menu.input?.onValueChange,
  });

  // Clear input on menu close
  const clearTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  React.useEffect(() => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
    if (!root.open && onCloseAutoClear) {
      if (typeof onCloseAutoClear === "number") {
        clearTimeoutRef.current = setTimeout(() => {
          setValue("");
          clearTimeoutRef.current = null;
        }, onCloseAutoClear);
      } else {
        setValue("");
      }
    }
  }, [root.open, sub?.open, onCloseAutoClear]);

  const slots = React.useMemo<Required<SurfaceSlots<T>>>(
    () => ({
      ...defaultSlots<T>(),
      ...(slotOverrides as any),
      ...(menu.ui?.slots as any),
    }),
    [slotOverrides, menu.ui?.slots],
  );

  const slotProps = React.useMemo<Partial<ActionMenuSlotProps>>(
    () => ({
      ...(slotPropOverrides ?? {}),
      ...(menu.ui?.slotProps ?? {}),
    }),
    [slotPropOverrides, menu.ui?.slotProps],
  );

  const classNames = React.useMemo(
    () => mergeClassNames(classNameOverrides ?? {}, menu.ui?.classNames ?? {}),
    [classNameOverrides, menu.ui?.classNames],
  );

  const defaults = React.useMemo<Partial<MenuNodeDefaults<T>>>(
    () => ({ ...defaultsOverrides, ...(menu.defaults ?? {}) }),
    [defaultsOverrides, menu.defaults],
  );

  // const shellSlotProps = React.useMemo<Partial<ShellSlotProps>>(
  //   () => ({
  //     ...(shellSlotPropsOverrides ?? {}),
  //   }),
  //   [shellSlotPropsOverrides],
  // )
  //
  // const surfaceSlotProps = React.useMemo<Partial<SurfaceSlotProps>>(
  //   () => ({
  //     ...(surfaceSlotPropsOverrides ?? {}),
  //     ...(menu.ui?.slotProps ?? {}),
  //   }),
  //   [surfaceSlotPropsOverrides, menu.ui?.slotProps],
  // )
  //
  //
  // const mergedClassNames = React.useMemo(
  //   () => mergeClassNames(classNames ?? {}, menu.ui?.classNames ?? {}),
  //   [classNames, menu.ui?.classNames],
  // )

  const isSubmenu = !!sub;
  const [inputActive, setInputActive] = React.useState(
    !menu.hideSearchUntilActive,
  );

  // Notify (e.g., Positioner) when input visibility changes
  React.useLayoutEffect(() => {
    const target: EventTarget =
      surfaceRef.current ??
      (typeof document !== "undefined" ? document : ({} as any));
    target.dispatchEvent(
      new CustomEvent(INPUT_VISIBILITY_CHANGE_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          surfaceId,
          hideSearchUntilActive: menu.hideSearchUntilActive,
          inputActive,
        },
      }),
    );
  }, [inputActive, menu.hideSearchUntilActive]);

  // Create per-surface store once
  const storeRef = React.useRef<SurfaceStore | null>(null);
  if (!storeRef.current) storeRef.current = createSurfaceStore();
  const store = storeRef.current;

  React.useEffect(() => {
    store.set("hasInput", inputActive);
  }, [inputActive, store]);

  React.useEffect(() => {
    root.registerSurface(surfaceId, menu.depth);

    return () => {
      root.unregisterSurface(surfaceId);
    };
  }, [root.registerSurface, root.unregisterSurface, surfaceId, menu.depth]);

  React.useEffect(() => {
    const handle = () => {
      sub?.onOpenChange(false);
    };
    document.addEventListener(CLOSE_MENU_EVENT, handle, true);
    return () => {
      document.removeEventListener(CLOSE_MENU_EVENT, handle, true);
    };
  }, [sub?.onOpenChange]);

  // On open, claim focus ownership for the first surface and focus input/list.
  React.useEffect(() => {
    if (!root.open) {
      setOwnerId(null);
      return;
    }
    if (root.open && ownerId === null) {
      setOwnerId(surfaceId);
      (store.inputRef.current ?? store.listRef.current)?.focus();
    }
  }, [
    root.open,
    ownerId,
    surfaceId,
    setOwnerId,
    store.inputRef,
    store.listRef,
  ]);

  // Keep focus on input/list after re-render when we own focus
  React.useEffect(() => {
    if (!root.open || !isOwner) return;
    const id = requestAnimationFrame(() => {
      (store.inputRef.current ?? store.listRef.current)?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [root.open, isOwner, store.inputRef, store.listRef]);

  const [suppressHoverOpen, setSuppressHoverOpen] = React.useState(
    !!suppressHoverOpenOnMount,
  );
  const clearSuppression = React.useCallback(() => {
    if (suppressHoverOpen) setSuppressHoverOpen(false);
  }, [suppressHoverOpen]);

  const [aimGuardActive, setAimGuardActive] = React.useState(false);
  const [guardedTriggerId, setGuardedTriggerId] = React.useState<string | null>(
    null,
  );
  const aimGuardActiveRef = React.useRef(false);
  const guardedTriggerIdRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    aimGuardActiveRef.current = aimGuardActive;
  }, [aimGuardActive]);
  React.useEffect(() => {
    guardedTriggerIdRef.current = guardedTriggerId;
  }, [guardedTriggerId]);
  const guardTimerRef = React.useRef<number | null>(null);
  const clearAimGuard = React.useCallback(() => {
    if (guardTimerRef.current) {
      window.clearTimeout(guardTimerRef.current);
      guardTimerRef.current = null;
    }
    aimGuardActiveRef.current = false;
    guardedTriggerIdRef.current = null;
    setAimGuardActive(false);
    setGuardedTriggerId(null);
  }, []);
  const activateAimGuard = React.useCallback(
    (triggerId: string, timeoutMs = 450) => {
      aimGuardActiveRef.current = true;
      guardedTriggerIdRef.current = triggerId;
      setGuardedTriggerId(triggerId);
      setAimGuardActive(true);
      if (guardTimerRef.current) window.clearTimeout(guardTimerRef.current);
      guardTimerRef.current = window.setTimeout(() => {
        aimGuardActiveRef.current = false;
        guardedTriggerIdRef.current = null;
        setAimGuardActive(false);
        setGuardedTriggerId(null);
        guardTimerRef.current = null;
      }, timeoutMs) as any;
    },
    [],
  );
  const isGuardBlocking = React.useCallback(
    (rowId: string) =>
      aimGuardActiveRef.current && guardedTriggerIdRef.current !== rowId,
    [],
  );

  const baseContentProps = React.useMemo(
    () =>
      ({
        ref: composedRef,
        role: "menu",
        tabIndex: -1,
        "data-slot": "action-menu-content",
        "data-root-menu": isSubmenu ? undefined : true,
        "data-sub-menu": isSubmenu ? "true" : undefined,
        "data-state": root.open ? "open" : "closed",
        "data-action-menu-surface": true as const,
        "data-surface-id": surfaceId,
        "data-mode": mode,
        className: classNames?.content,
        onMouseMove: (e: React.MouseEvent) => {
          clearSuppression();
          const rect = (
            surfaceRef.current as HTMLElement | null
          )?.getBoundingClientRect();
          if (!rect || !isInBounds(e.clientX, e.clientY, rect)) return;
          setOwnerId(surfaceId);
        },
        ...props,
      }) as const,
    [
      composedRef,
      root.open,
      clearSuppression,
      surfaceId,
      setOwnerId,
      props,
      mode,
      classNames?.content,
    ],
  );

  const contentBind: ContentBindAPI = {
    getContentProps: (overrides) =>
      mergeProps(
        baseContentProps as any,
        mergeProps(slotProps?.content as any, overrides as any),
      ),
  };

  const headerEl = slots.Header ? (
    <div
      data-slot="action-menu-header"
      {...(slotProps.header as any)}
      className={cn(
        "data-[slot=action-menu-header]:block",
        slotProps.header?.className,
      )}
    >
      {slots.Header({ menu })}
    </div>
  ) : null;

  const inputEl = inputActive ? (
    <InputView<T>
      store={store}
      value={value}
      onChange={setValue}
      slot={slots.Input}
      slotProps={slotProps}
      classNames={classNames}
      inputPlaceholder={menu.inputPlaceholder}
    />
  ) : null;

  const listEl = (
    <ListView<T>
      store={store}
      menu={menu}
      query={value}
      defaults={defaults}
      slots={slots}
      slotProps={slotProps}
      classNames={classNames}
      // shellSlotProps={shellSlotProps}
      // surfaceSlots={slots}
      // surfaceSlotProps={surfaceSlotProps}
      // classNames={mergedClassNames}
      inputActive={inputActive}
      onTypeStart={(seed) => {
        if (!inputActive && ownerId === surfaceId) {
          setInputActive(true);
          setValue(seed);
          requestAnimationFrame(() => {
            store.inputRef.current?.focus();
          });
        }
      }}
    />
  );

  const footerEl = slots.Footer ? (
    <div
      data-slot="action-menu-footer"
      {...(slotProps.footer as any)}
      className={cn(
        "data-[slot=action-menu-footer]:block",
        slotProps.footer?.className,
      )}
    >
      {slots.Footer({ menu })}
    </div>
  ) : null;

  const childrenNoProvider = (
    <>
      {headerEl}
      {inputEl}
      {listEl}
      {footerEl}
    </>
  );

  const body =
    isSubmenu && renderProp
      ? renderProp()
      : slots.Content({
          menu,
          children: childrenNoProvider,
          bind: contentBind,
        });

  const wrapped = !isElementWithProp(body, "data-action-menu-surface") ? (
    <Primitive.div {...contentBind.getContentProps()}>
      <SurfaceCtx.Provider value={store}>{body}</SurfaceCtx.Provider>
    </Primitive.div>
  ) : (
    <SurfaceCtx.Provider value={store}>{body}</SurfaceCtx.Provider>
  );

  return (
    <KeyboardCtx.Provider value={{ dir, vimBindings }}>
      <SurfaceIdCtx.Provider value={surfaceId}>
        <HoverPolicyCtx.Provider
          value={{
            suppressHoverOpen,
            clearSuppression,
            aimGuardActive,
            guardedTriggerId,
            activateAimGuard,
            clearAimGuard,
            aimGuardActiveRef,
            guardedTriggerIdRef,
            isGuardBlocking,
          }}
        >
          {wrapped}
        </HoverPolicyCtx.Provider>
      </SurfaceIdCtx.Provider>
    </KeyboardCtx.Provider>
  );
}) as <T>(
  p: ActionMenuSurfaceProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof Primitive.div>;

/* ================================================================================================
 * Submenu plumbing (provider and rows)
 * ============================================================================================== */

function Sub({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement | HTMLButtonElement | null>(
    null,
  );
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const parentStore = useSurface();
  const parentSurfaceId = useSurfaceId() || "root";
  const [triggerItemId, setTriggerItemId] = React.useState<string | null>(null);
  const childSurfaceId = React.useId();
  const pendingOpenModalityRef = React.useRef<"keyboard" | "pointer" | null>(
    null,
  );
  const intentZoneActiveRef = React.useRef<boolean>(false);
  const { setOwnerId } = useFocusOwner();
  const mode = useDisplayMode();
  const parentSubCtx = useSubCtx();

  const value: SubContextValue = React.useMemo(
    () => ({
      open,
      onOpenChange: setOpen,
      onOpenToggle: () => setOpen((v) => !v),
      triggerRef,
      contentRef,
      parentSurfaceId,
      triggerItemId,
      setTriggerItemId,
      parentSetActiveId: parentStore.setActiveId,
      childSurfaceId,
      pendingOpenModalityRef,
      intentZoneActiveRef,
      parentSub: parentSubCtx,
    }),
    [
      open,
      parentSurfaceId,
      triggerItemId,
      parentStore.setActiveId,
      childSurfaceId,
      parentSubCtx,
    ],
  );

  if (mode === "drawer") {
    // Use Vaul nested drawer for submenu layers
    return (
      <SubCtx.Provider value={value}>
        <Drawer.NestedRoot
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (o) {
              // Claim focus for the child surface when the nested drawer opens
              setOwnerId(childSurfaceId);
              // focus input/list shortly after mount
              requestAnimationFrame(() => {
                const content = contentRef.current;
                const { input, list } = findWidgetsWithinSurface(content);
                (input ?? list)?.focus();
              });
            } else {
              // returning focus/selection to parent surface
              setOwnerId(parentSurfaceId);
              parentStore.setActiveId(triggerItemId);
              requestAnimationFrame(() => {
                const parentEl = document.querySelector<HTMLElement>(
                  `[data-surface-id="${parentSurfaceId}"]`,
                );
                const { input, list } = findWidgetsWithinSurface(parentEl);
                (input ?? list)?.focus();
              });
            }
          }}
        >
          {children}
        </Drawer.NestedRoot>
      </SubCtx.Provider>
    );
  }

  return (
    <SubCtx.Provider value={value}>
      <Popper.Root>{children}</Popper.Root>
    </SubCtx.Provider>
  );
}

function SubTriggerRow<T>({
  node,
  slot,
  classNames,
  search,
  ref: refProp,
}: {
  node: SubmenuNode<T>;
  slot: NonNullable<SurfaceSlots<T>["SubmenuTrigger"]>;
  classNames?: Partial<SurfaceClassNames>;
  search?: SearchContext;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const store = useSurface();
  const sub = useSubCtx()!;
  const { setOwnerId } = useFocusOwner();
  const {
    guardedTriggerIdRef,
    aimGuardActiveRef,
    activateAimGuard,
    clearAimGuard,
  } = useHoverPolicy();
  const mouseTrailRef = useMouseTrail(4);
  const ref = React.useRef<HTMLElement | null>(null);
  const surfaceId = useSurfaceId();
  const { ownerId } = useFocusOwner();
  const mode = useDisplayMode();

  const rowId = makeRowId(node.id, search, surfaceId);

  React.useEffect(() => {
    store.registerRow(rowId, {
      ref: ref as any,
      disabled: false,
      kind: "submenu",
      openSub: () => sub.onOpenChange(true),
      closeSub: () => sub.onOpenChange(false),
    });
    return () => store.unregisterRow(rowId);
  }, [store, rowId]);

  React.useEffect(() => {
    const nodeEl = ref.current;
    if (!nodeEl) return;
    const onOpen = () => {
      sub.pendingOpenModalityRef.current = "keyboard";
      sub.onOpenChange(true);
      setOwnerId(sub.childSurfaceId);
      const tryFocus = (attempt = 0) => {
        const content = sub.contentRef.current as HTMLElement | null;
        if (content) {
          const { input, list } = findWidgetsWithinSurface(content);
          (input ?? list)?.focus();
          return;
        }
        if (attempt < 5) requestAnimationFrame(() => tryFocus(attempt + 1));
      };
      requestAnimationFrame(() => tryFocus());
    };
    nodeEl.addEventListener(OPEN_SUB_EVENT, onOpen as EventListener);
    return () =>
      nodeEl.removeEventListener(OPEN_SUB_EVENT, onOpen as EventListener);
  }, [sub, setOwnerId]);

  React.useEffect(() => {
    if (sub.triggerItemId !== rowId) sub.setTriggerItemId(rowId);
    return () => {
      if (sub.triggerItemId === rowId) sub.setTriggerItemId(null);
    };
  }, [rowId]);

  const activeId = useSurfaceSel(store, (s) => s.activeId);
  const focused = activeId === rowId;
  const menuFocused = sub.childSurfaceId === ownerId;

  const baseRowProps = React.useMemo(() => {
    const common = {
      id: rowId,
      ref: composeRefs(refProp as any, ref as any, sub.triggerRef as any),
      role: "option" as const,
      tabIndex: -1,
      "data-action-menu-item-id": rowId,
      "data-focused": focused,
      "data-menu-state": sub.open ? "open" : "closed",
      "data-menu-focused": menuFocused,
      "aria-selected": focused,
      "aria-disabled": false,
      "data-subtrigger": "true",
      "data-mode": mode,
      className: classNames?.subtrigger,
    } as const;

    if (mode === "drawer") {
      // Drawer mode: click (or Enter) opens nested drawer via Drawer.Trigger
      return {
        ...common,
        onPointerDown: undefined, // let Drawer.Trigger handle it
        onPointerEnter: undefined,
        onPointerMove: undefined,
        onPointerLeave: undefined,
        onKeyDown: (e: React.KeyboardEvent) => {
          // Keep keyboard navigation; Enter will bubble to Drawer.Trigger
          if (
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "Home" ||
            e.key === "End"
          ) {
            // let list/input handlers deal with it via useNavKeydown
          }
        },
      } as const;
    }

    // Dropdown (Popper) mode: keep your original hover + aim-guard behavior
    return {
      ...common,
      onPointerDown: (e: React.PointerEvent) => {
        if (e.button === 0 && e.ctrlKey === false) {
          e.preventDefault();
          sub.pendingOpenModalityRef.current = "pointer";
          sub.onOpenToggle();
        }
      },
      onPointerEnter: () => {
        if (aimGuardActiveRef.current && guardedTriggerIdRef.current !== rowId)
          return;
        if (!focused) store.setActiveId(rowId, "pointer");
        clearAimGuard();
        if (!sub.open) sub.onOpenChange(true);
      },
      onPointerMove: () => {
        if (aimGuardActiveRef.current && guardedTriggerIdRef.current !== rowId)
          return;
        if (!focused) store.setActiveId(rowId, "pointer");
        if (!sub.open) sub.onOpenChange(true);
      },
      onPointerLeave: (e: React.PointerEvent) => {
        if (aimGuardActiveRef.current && guardedTriggerIdRef.current !== rowId)
          return;
        const contentRect = sub.contentRef.current?.getBoundingClientRect();
        if (!contentRect) {
          clearAimGuard();
          return;
        }
        const tRect =
          (
            sub.triggerRef.current as HTMLElement | null
          )?.getBoundingClientRect() ?? null;
        const anchor = resolveAnchorSide(contentRect, tRect, e.clientX);
        const heading = getSmoothedHeading(
          mouseTrailRef.current,
          e.clientX,
          e.clientY,
          anchor,
          tRect,
          contentRect,
        );
        const hit = willHitSubmenu(
          e.clientX,
          e.clientY,
          heading,
          contentRect,
          anchor,
          tRect,
        );
        if (hit) {
          activateAimGuard(rowId, 600);
          store.setActiveId(rowId, "pointer");
          sub.onOpenChange(true);
        } else {
          clearAimGuard();
        }
      },
    } as const;
  }, [
    mode,
    rowId,
    focused,
    menuFocused,
    classNames?.subtrigger,
    store,
    sub,
    activateAimGuard,
    clearAimGuard,
    aimGuardActiveRef,
    guardedTriggerIdRef,
  ]);

  const bind: RowBindAPI = {
    focused,
    disabled: false,
    getRowProps: (overrides) =>
      mergeProps(baseRowProps as any, overrides as any),
  };

  const visual = slot({ node, bind, search });
  const content = hasDescendantWithProp(visual, "data-action-menu-item-id") ? (
    visual
  ) : (
    <div {...(baseRowProps as any)}>{visual ?? node.label ?? node.title}</div>
  );

  return mode === "drawer" ? (
    <Drawer.Trigger asChild>{content as any}</Drawer.Trigger>
  ) : (
    <Popper.Anchor asChild>{content as any}</Popper.Anchor>
  );
}

interface SubmenuContentProps<T> {
  menu: SubmenuNode<T>;
  defaults?: Partial<MenuNodeDefaults<T>>;
  slots: Required<ActionMenuSlots<T>>;
  slotProps?: Partial<ActionMenuSlotProps>;
  classNames?: Partial<ActionMenuClassNames>;
}

function SubmenuContent<T>({
  menu,
  defaults,
  slots,
  slotProps,
  classNames,
}: SubmenuContentProps<T>) {
  const sub = useSubCtx()!;
  const mode = useDisplayMode();
  const root = useRootCtx();

  const suppressHover = sub.pendingOpenModalityRef.current === "keyboard";
  React.useEffect(() => {
    sub.pendingOpenModalityRef.current = null;
  }, [sub]);

  const inner = (
    <Surface<T>
      menu={menu.child as Menu<T>}
      render={menu.render}
      defaults={defaults}
      slots={slots}
      slotProps={slotProps}
      classNames={classNames}
      surfaceIdProp={sub.childSurfaceId}
      suppressHoverOpenOnMount={suppressHover}
    />
  );

  if (mode === "drawer") {
    return (
      <Drawer.Portal>
        <Drawer.Overlay
          data-slot="action-menu-overlay"
          className={root.classNames?.drawerOverlay}
          {...root.slotProps?.drawerOverlay}
        />
        <Drawer.Content
          data-slot="action-menu-drawer-content"
          ref={sub.contentRef as any}
          className={cn(root.classNames?.drawerContent)}
          {...root.slotProps?.drawerContent}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <div
            data-slot="action-menu-drawer-content-inner"
            className={cn(root.classNames?.drawerContentInner)}
          >
            <Drawer.Title className="sr-only">
              {menu.title ?? "Action Menu"}
            </Drawer.Title>
            <div className={root.classNames?.drawerHandle} />
            {inner as any}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    );
  }

  return (
    <Positioner side="right" {...slotProps?.positioner}>
      {inner as any}
    </Positioner>
  );
}

/* ================================================================================================
 * Rendering helpers
 * ============================================================================================== */

function makeRowId(
  baseId: string,
  search: SearchContext | undefined,
  surfaceId: string | null,
) {
  if (!search || !search.isDeep || !surfaceId) return baseId;
  return baseId; // keep stable to avoid breaking references
}

function ItemRow<T>({
  ref: refProp,
  node,
  slot,
  classNames,
  defaults,
  store,
  search,
}: {
  ref?: React.Ref<HTMLElement>;
  node: ItemNode<T>;
  slot: NonNullable<SurfaceSlots<T>["Item"]>;
  classNames?: Partial<SurfaceClassNames>;
  defaults?: Partial<MenuNodeDefaults<T>>;
  store: SurfaceStore;
  search?: SearchContext;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const surfaceId = useSurfaceId();
  const mode = useDisplayMode();
  const rowId = makeRowId(node.id, search, surfaceId);
  const root = useRootCtx();
  const sub = useSubCtx();
  const onSelect = node.onSelect ?? defaults?.item?.onSelect;
  const closeOnSelect =
    node.closeOnSelect ?? defaults?.item?.closeOnSelect ?? false;

  const handleSelect = React.useCallback(() => {
    onSelect?.({ node, search });
    if (closeOnSelect) {
      closeSubmenuChain(sub, root);
    }
  }, [onSelect, node, search, closeOnSelect, root]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onSelectFromKey: EventListener = () => {
      handleSelect();
    };
    el.addEventListener(SELECT_ITEM_EVENT, onSelectFromKey);
    return () => el.removeEventListener(SELECT_ITEM_EVENT, onSelectFromKey);
  }, [handleSelect]);

  React.useEffect(() => {
    store.registerRow(rowId, {
      ref: ref as any,
      disabled: false,
      kind: "item",
    });
    return () => store.unregisterRow(rowId);
  }, [store, rowId]);

  const activeId = useSurfaceSel(store, (s) => s.activeId);
  const focused = activeId === rowId;
  const { aimGuardActiveRef } = useHoverPolicy();

  const baseRowProps = React.useMemo(
    () =>
      ({
        id: rowId,
        ref: composeRefs(refProp as any, ref as any),
        role: "option" as const,
        tabIndex: -1,
        "data-action-menu-item-id": rowId,
        "data-focused": focused,
        "aria-selected": focused,
        "aria-disabled": false,
        "data-mode": mode,
        className: classNames?.item,
        onPointerDown: (e: React.PointerEvent) => {
          e.preventDefault();
        },
        onMouseMove: () => {
          if (aimGuardActiveRef.current) return;
          if (!focused) store.setActiveId(rowId, "pointer");
        },
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          handleSelect();
        },
      }) as const,
    [
      rowId,
      refProp,
      handleSelect,
      focused,
      store,
      classNames?.item,
      aimGuardActiveRef,
    ],
  );

  const bind: RowBindAPI = {
    focused,
    disabled: false,
    getRowProps: (overrides) =>
      mergeProps(baseRowProps as any, overrides as any),
  };

  if (node.render) {
    return node.render({ node, bind, search, mode });
  }

  const visual = slot({ node, bind, search, mode });
  // If the slot placed `getRowProps` on any nested node, just return it as-is.
  if (hasDescendantWithProp(visual, "data-action-menu-item-id")) {
    return visual as React.ReactElement;
  }
  const fallbackVisual = visual ?? <span>{node.label ?? String(node.id)}</span>;
  return <div {...(baseRowProps as any)}>{fallbackVisual}</div>;
}

/** Controlled/connected Input slot wrapper that wires ARIA and key handling. */
function InputView<T>({
  store,
  value,
  onChange,
  slot,
  slotProps,
  inputPlaceholder,
  classNames,
}: {
  store: SurfaceStore;
  value: string;
  onChange: (v: string) => void;
  slot: NonNullable<SurfaceSlots<T>["Input"]>;
  slotProps: Partial<SurfaceSlotProps>;
  inputPlaceholder?: string;
  classNames?: Partial<SurfaceClassNames>;
}) {
  const activeId = useSurfaceSel(store, (s) => s.activeId ?? undefined);
  const listId = useSurfaceSel(store, (s) => s.listId ?? undefined);
  const mode = useDisplayMode();
  const onKeyDown = useNavKeydown("input");
  const baseInputProps = {
    ref: store.inputRef as any,
    role: "combobox",
    "data-slot": "action-menu-input",
    "data-action-menu-input": true,
    "aria-autocomplete": "list",
    "aria-expanded": true,
    "aria-controls": listId,
    "aria-activedescendant": activeId,
    "data-mode": mode,
    className: classNames?.input,
    placeholder: inputPlaceholder ?? "Filter...",
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value),
    onKeyDown,
  };
  const bind: InputBindAPI = {
    getInputProps: (overrides) =>
      mergeProps(
        baseInputProps as any,
        mergeProps(slotProps?.input as any, overrides as any),
      ),
  };
  const el = slot({ value, onChange, bind });
  if (!isElementWithProp(el, "data-action-menu-input"))
    return <input {...bind.getInputProps(slotProps?.input as any)} />;
  return el as React.ReactElement;
}

function px(n: number) {
  return `${Math.ceil(n)}px`;
}

function useStickyRowWidth(opts: {
  containerRef: React.RefObject<HTMLElement | null>; // the .listViewport element
  designMaxPx?: number; // optional hard cap, e.g. 560
}) {
  const { containerRef, designMaxPx } = opts;
  const maxSeenRef = React.useRef(0);
  const frame = React.useRef<number | null>(null);

  // Read Radix available width (optional—works because Radix sets a real value)
  const readRadixMax = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return Number.POSITIVE_INFINITY;
    const cs = getComputedStyle(el.closest('[role="dialog"]')! ?? el);
    const raw = cs.getPropertyValue("--radix-popper-available-width")?.trim();
    const v = raw?.endsWith("px") ? Number.parseFloat(raw) : Number.NaN;
    return Number.isFinite(v) ? v : Number.POSITIVE_INFINITY;
  }, [containerRef]);

  const applyVar = React.useCallback(
    (n: number) => {
      const el = containerRef.current;
      if (!el) return;
      const radixCap = readRadixMax();
      const hardCap = Number.isFinite(designMaxPx ?? Number.NaN)
        ? designMaxPx!
        : Number.POSITIVE_INFINITY;
      const capped = Math.min(n, radixCap, hardCap);
      el.style.setProperty("--row-width", px(capped));

      const surface = el.closest<HTMLElement>(
        '[data-slot="action-menu-content"]',
      );
      if (!surface) return;
      surface.style.setProperty("--row-width", px(capped));
    },
    [containerRef, designMaxPx, readRadixMax],
  );

  const updateIfLarger = React.useCallback(
    (naturalWidth: number) => {
      if (naturalWidth <= maxSeenRef.current) return;
      maxSeenRef.current = naturalWidth;
      // batch to next frame to avoid thrash while scrolling
      if (frame.current != null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => applyVar(maxSeenRef.current));
    },
    [applyVar],
  );

  // Re-apply cap when the container/popover resizes (viewport changes)
  React.useLayoutEffect(() => {
    const dialog =
      containerRef.current?.closest('[role="dialog"]') ?? containerRef.current;
    if (!dialog) return;
    const ro = new ResizeObserver(() => {
      if (maxSeenRef.current > 0) applyVar(maxSeenRef.current);
    });
    ro.observe(dialog);
    return () => ro.disconnect();
  }, [containerRef, applyVar]);

  // Public API: call this for each mounted row to measure its *natural* width.
  const measureRow = React.useCallback(
    (rowEl: HTMLElement | null) => {
      if (!rowEl) return;
      // Prefer a dedicated child with width:max-content to reflect natural width.
      const probe = rowEl.querySelector<HTMLElement>(".rowContent") ?? rowEl;
      const prevWidth = probe.style.width;
      probe.style.width = "max-content";

      // scrollWidth is robust for overflow cases; getBoundingClientRect for precision
      const w = Math.max(
        probe.scrollWidth,
        probe.getBoundingClientRect().width,
        probe.offsetWidth,
      );
      probe.style.width = prevWidth;
      updateIfLarger(w);
    },
    [updateIfLarger],
  );

  return { measureRow };
}

interface ListViewProps<T> {
  store: SurfaceStore;
  menu: Menu<T>;
  slots: Required<ActionMenuSlots<T>>;
  slotProps?: Partial<ActionMenuSlotProps>;
  classNames?: Partial<ActionMenuClassNames>;
  defaults?: Partial<MenuNodeDefaults<T>>;
  query?: string;
  inputActive: boolean;
  onTypeStart: (seed: string) => void;
}

/** List view that renders the unfiltered tree or flattened search results. */
function ListView<T = unknown>({
  store,
  menu,
  defaults,
  slots,
  slotProps,
  classNames,
  query,
  inputActive,
  onTypeStart,
}: ListViewProps<T>) {
  const localId = React.useId();
  const listId = useSurfaceSel(store, (s) => s.listId);
  const hasInput = useSurfaceSel(store, (s) => s.hasInput);
  const activeId = useSurfaceSel(store, (s) => s.activeId ?? undefined);
  const navKeydown = useNavKeydown("list");
  const { ownerId } = useFocusOwner();
  const surfaceId = useSurfaceId() ?? "root";
  const mode = useDisplayMode();

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (ownerId !== surfaceId) return;
      if (!inputActive && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === "Backspace") {
          e.preventDefault();
          onTypeStart("");
          return;
        }
        if (e.key.length === 1) {
          e.preventDefault();
          onTypeStart(e.key);
          return;
        }
      }
      navKeydown(e);
    },
    [surfaceId, ownerId, inputActive, onTypeStart, navKeydown],
  );

  React.useEffect(() => {
    const id = listId ?? `action-menu-list-${localId}`;
    store.set("listId", id);
    return () => store.set("listId", null);
  }, [localId]);

  const effectiveListId =
    store.snapshot().listId ?? `action-menu-list-${localId}`;
  const q = (query ?? "").trim();

  interface SRContext {
    breadcrumbs: string[];
    breadcrumbIds: string[];
    score: number;
  }

  type SRItem = SRContext & {
    type: "item";
    node: ItemNode<T>;
  };
  type SRSub = SRContext & {
    type: "submenu";
    node: SubmenuNode<any>;
  };

  type SR = SRItem | SRSub;

  const collect = React.useCallback(
    (
      nodes: Node<T>[] | undefined,
      q: string,
      bc: string[] = [],
      bcIds: string[] = [],
      currentMenu: Menu<T> = menu,
    ): SR[] => {
      const out: SR[] = [];
      for (const n of nodes ?? []) {
        if ((n as any).hidden) continue;
        if (n.kind === "item") {
          const score = commandScore(n.id, q, n.keywords);
          if (score > 0)
            out.push({
              type: "item",
              node: {
                ...n,
                id: bcIds.at(-1) ? `${bcIds.at(-1)}-${n.id}` : n.id,
                menu: currentMenu,
              } as ItemNode<T>,
              breadcrumbs: bc,
              breadcrumbIds: bcIds,
              score,
            });
        } else if (n.kind === "group") {
          out.push(...collect(n.nodes, q, bc, bcIds));
        } else if (n.kind === "submenu") {
          const sub = n as SubmenuNode<any>;
          const score = commandScore(n.id, q, n.keywords);
          if (score > 0)
            out.push({
              type: "submenu",
              node: { ...sub, parent: currentMenu, def: sub.def },
              breadcrumbs: bc,
              breadcrumbIds: bcIds,
              score,
            });
          const title = sub.title ?? sub.label ?? sub.id ?? "";
          out.push(
            ...collect(
              sub.nodes as any,
              q,
              [...bc, title],
              [...bcIds, sub.id],
              sub.child as Menu<any>,
            ),
          );
        }
      }
      return out;
    },
    [],
  );

  const results = React.useMemo(
    () =>
      q
        ? pipe(
            collect(menu.nodes, q, [], [], menu),
            sortBy([prop("score"), "desc"]),
            partition((v) => v.type === "submenu"),
            flat(),
          )
        : [],
    [q, menu.nodes],
  );
  const firstRowId = React.useMemo(
    () => results[0]?.node.id ?? null,
    [results[0]],
  );

  React.useLayoutEffect(() => {
    if (!q) return;
    if (!firstRowId) return;
    const raf = requestAnimationFrame(() =>
      store.setActiveId(firstRowId, "keyboard"),
    );
    return () => cancelAnimationFrame(raf);
  }, [q]);

  const flattenedNodes = React.useMemo(() => {
    const acc: Node<T>[] = [];

    if (q) {
      if (results.length === 0) return [];
      for (const sr of results) {
        acc.push({
          ...sr.node,
          search: {
            query: q,
            score: sr.score,
            isDeep: sr.breadcrumbs.length > 0,
            breadcrumbs: sr.breadcrumbs,
            breadcrumbIds: sr.breadcrumbIds,
          },
        });
      }
    } else {
      for (const node of menu.nodes) {
        if (node.kind === "item" || node.kind === "submenu") acc.push(node);
        else acc.push(node, ...node.nodes);
      }
    }

    return acc;
  }, [q, menu.nodes]);

  const virtualizer = useVirtualizer({
    count: flattenedNodes.length,
    estimateSize: () => 32,
    getScrollElement: () => store.listRef.current,
    overscan: 6,
  });

  const totalSize = virtualizer.getTotalSize();
  const totalSizePx = React.useMemo(() => `${totalSize}px`, [totalSize]);

  const { measureRow } = useStickyRowWidth({ containerRef: store.listRef });

  const baseListProps = React.useMemo(
    () => ({
      ref: store.listRef as any,
      role: "listbox" as const,
      id: effectiveListId,
      tabIndex: hasInput ? -1 : 0,
      "data-slot": "action-menu-list" as const,
      "data-action-menu-list": true as const,
      "aria-activedescendant": hasInput ? undefined : activeId,
      "data-mode": mode,
      className: classNames?.list,
      onKeyDown,
      style: {
        "--total-size": totalSizePx,
      } as React.CSSProperties,
    }),
    [
      mode,
      onKeyDown,
      store.listRef,
      effectiveListId,
      activeId,
      classNames?.list,
      hasInput,
      totalSizePx,
    ],
  );

  const bind = React.useMemo(
    () =>
      ({
        getListProps: (overrides) =>
          mergeProps(
            baseListProps as any,
            mergeProps(slotProps?.list as any, overrides as any),
          ),
        getItemOrder: () => store.getOrder(),
        getActiveId: () => store.snapshot().activeId,
      }) satisfies ListBindAPI,
    [baseListProps, slotProps?.list, store],
  );

  const virtualItems = virtualizer.getVirtualItems();

  const listRows = React.useMemo(
    () => (
      <ul
        style={
          {
            "--total-size": totalSizePx,
            height: totalSizePx,
            position: "relative",
          } as React.CSSProperties
        }
      >
        {virtualItems.map((virtualRow) => {
          const node = flattenedNodes[virtualRow.index];

          if (!node) return;

          if (node.kind === "group") {
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  ref={measureRow}
                  data-action-menu-group-heading
                  data-index={virtualRow.index}
                  role="presentation"
                  className={classNames?.group}
                >
                  <span className={classNames?.groupHeading}>
                    {node.heading}
                  </span>
                </div>
              </div>
            );
          }

          if (node.kind === "item") {
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={classNames?.itemWrapper}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ItemRow
                  ref={measureRow}
                  key={node.id}
                  node={node}
                  slot={slots.Item}
                  defaults={defaults}
                  classNames={classNames}
                  store={store}
                  search={node.search}
                />
              </div>
            );
          }

          if (node.kind === "submenu") {
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Sub>
                  <SubTriggerRow
                    ref={measureRow}
                    key={virtualRow.key}
                    node={node}
                    slot={slots.SubmenuTrigger}
                    classNames={classNames}
                    search={node.search}
                  />
                  <SubmenuContent
                    menu={node as any}
                    slotProps={slotProps}
                    slots={slots}
                    classNames={classNames}
                    defaults={defaults}
                  />
                </Sub>
              </div>
            );
          }

          return null;
        })}
      </ul>
    ),
    [
      slots,
      slots.Item,
      slots.SubmenuTrigger,
      store,
      flattenedNodes,
      virtualizer.measureElement,
      virtualItems,
      totalSizePx,
      measureRow,
      defaults,
      classNames,
    ],
  );

  const children: React.ReactNode = React.useMemo(
    () => (flattenedNodes.length > 0 ? listRows : slots.Empty({ query: q })),
    [listRows, slots.Empty, q, flattenedNodes],
  );

  const el = React.useMemo(
    () =>
      slots.List({
        query: q,
        nodes: flattenedNodes,
        children,
        bind,
      }),
    [bind, slots.List, children, flattenedNodes, q],
  );

  if (el === null) return null;

  if (!isElementWithProp(el, "data-action-menu-list")) {
    return (
      <div
        {...bind.getListProps(
          mergeProps(slotProps?.list as any, {
            onPointerDown: () => {
              //
            },
          }),
        )}
      >
        {listRows}
      </div>
    );
  }
  return el as React.ReactElement;
}

/* ================================================================================================
 * Shells & Entry (ActionMenu)
 * ============================================================================================== */

function DropdownShell({ children }: { children: React.ReactNode }) {
  return <Popper.Root>{children}</Popper.Root>;
}

/** Drawer shell that mounts everything except the Trigger inside Vaul.Content. */
function DrawerShell({ children }: { children: React.ReactNode }) {
  const root = useRootCtx();

  // Split children: keep Triggers outside content, render everything else inside Drawer.Content
  const elements = React.Children.toArray(children) as React.ReactElement[];
  const triggerTypeName = "ActionMenu.Trigger";
  const triggers: React.ReactNode[] = [];
  const body: React.ReactNode[] = [];

  elements.forEach((child) => {
    const isTrigger =
      React.isValidElement(child) &&
      (child.type as any)?.displayName === triggerTypeName;
    if (isTrigger) triggers.push(child);
    else body.push(child);
  });

  return (
    // @ts-expect-error
    <Drawer.Root
      open={root.open}
      onOpenChange={root.onOpenChange}
      {...root.slotProps?.drawerRoot}
    >
      {triggers}
      <Drawer.Portal>
        <Drawer.Overlay
          data-slot="action-menu-overlay"
          className={root.classNames?.drawerOverlay}
          {...root.slotProps?.drawerOverlay}
        />
        <Drawer.Content
          data-slot="action-menu-drawer-content"
          className={root.classNames?.drawerContent}
          {...root.slotProps?.drawerContent}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <div
            data-slot="action-menu-drawer-content-inner"
            className={cn(root.classNames?.drawerContentInner)}
          >
            <Drawer.Title className="sr-only">Action Menu</Drawer.Title>
            <div className={root.classNames?.drawerHandle} />
            {body}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export interface ActionMenuRootProps extends Children {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  responsive?: Partial<ResponsiveConfig>;
  slotProps?: Partial<ActionMenuSlotProps>;
  classNames?: Partial<ActionMenuClassNames>;
  debug?: boolean;
}

/** Entry component: chooses the shell and provides root/display/focus contexts. */
export const Root = ({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  modal = true,
  responsive: responsiveProp,
  slotProps,
  classNames,
  debug = false,
}: ActionMenuRootProps) => {
  const scopeId = React.useId();
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (value) => {
      if (!value) closeAllSurfaces();

      if (onOpenChange) onOpenChange?.(value);
      else setOpen(value);
    },
  });
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [ownerId, setOwnerId] = React.useState<string | null>(null);

  const responsive = React.useMemo(
    () => ({
      mode: responsiveProp?.mode ?? "auto",
      query: responsiveProp?.query ?? "(max-width: 640px), (pointer: coarse)",
    }),
    [responsiveProp],
  );
  const { mode, query } = responsive;
  const autoDrawer = useMediaQuery(query);
  const resolvedMode: MenuDisplayMode =
    mode === "drawer" || mode === "dropdown"
      ? mode
      : autoDrawer
        ? "drawer"
        : "dropdown";

  const openSurfaceIds = React.useRef<Map<string, number>>(new Map());

  const registerSurface = React.useCallback(
    (surfaceId: string, depth: number) => {
      openSurfaceIds.current.set(surfaceId, depth);
    },
    [],
  );

  const unregisterSurface = React.useCallback((surfaceId: string) => {
    openSurfaceIds.current.delete(surfaceId);
  }, []);

  const closeAllSurfaces = React.useCallback(() => {
    const ordered = [...openSurfaceIds.current.entries()].sort(
      (a, b) => b[1] - a[1],
    );

    for (const [surfaceId] of ordered) {
      const el = document.querySelector<HTMLElement>(
        `[data-surface-id="${surfaceId}"]`,
      );
      if (el) dispatch(el, CLOSE_MENU_EVENT);
    }
    setOpen(false);
  }, [setOpen]);

  const rootCtxValue: RootContextValue = {
    scopeId,
    open,
    onOpenChange: setOpen,
    onOpenToggle: () => setOpen((v) => !v),
    anchorRef,
    modal,
    debug,
    slotProps,
    classNames,
    responsive,
    openSurfaceIds,
    registerSurface,
    unregisterSurface,
    closeAllSurfaces,
  };

  const content =
    resolvedMode === "dropdown" ? (
      <DropdownShell>{children}</DropdownShell>
    ) : (
      <DrawerShell>{children}</DrawerShell>
    );

  return (
    <RootCtx.Provider value={rootCtxValue}>
      <DisplayModeCtx.Provider value={resolvedMode}>
        <FocusOwnerCtx.Provider value={{ ownerId, setOwnerId }}>
          {content}
        </FocusOwnerCtx.Provider>
      </DisplayModeCtx.Provider>
    </RootCtx.Provider>
  );
};

/* ================================================================================================
 * Trigger
 * ============================================================================================== */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ActionMenuTriggerProps extends ButtonProps {}

/** Button that toggles the menu. Also acts as the Popper anchor (dropdown) or Drawer.Trigger (drawer). */
export const Trigger = React.forwardRef<
  HTMLButtonElement,
  ActionMenuTriggerProps
>(
  (
    { children, disabled, onPointerDown, onKeyDown, className, ...props },
    forwardedRef,
  ) => {
    const root = useRootCtx();
    const mode = useDisplayMode();
    const ResponsiveTrigger =
      mode === "drawer" ? Drawer.Trigger : Popper.Anchor;
    const content = (
      <ResponsiveTrigger asChild>
        <Primitive.button
          {...props}
          data-slot="action-menu-trigger"
          data-action-menu-trigger
          ref={composeRefs(forwardedRef, root.anchorRef)}
          disabled={disabled}
          className={cn(root.classNames?.trigger, className)}
          onPointerDown={composeEventHandlers(onPointerDown, (event) => {
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              const willOpen = !root.open;
              root.onOpenToggle();
              if (willOpen) event.preventDefault();
            }
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (disabled) return;
            if (event.key === "Enter" || event.key === " ") root.onOpenToggle();
            if (event.key === "ArrowDown") root.onOpenChange(true);
            if (["Enter", " ", "ArrowDown"].includes(event.key))
              event.preventDefault();
          })}
          aria-haspopup="menu"
          aria-expanded={root.open}
        >
          {children}
        </Primitive.button>
      </ResponsiveTrigger>
    );

    if (mode === "drawer") {
      return content;
    }

    return (
      <InteractionGuard.Branch asChild scopeId={root.scopeId}>
        {content}
      </InteractionGuard.Branch>
    );
  },
);
Trigger.displayName = "ActionMenu.Trigger";

/* ================================================================================================
 * Factory — createActionMenu<T>
 * ============================================================================================== */

export type CreateActionMenuResult<T = unknown> = React.FC<ActionMenuProps<T>>;

export interface CreateActionMenuOptions<T> {
  slots?: Partial<SurfaceSlots<T>>;
  slotProps?: Partial<ShellSlotProps & SurfaceSlotProps>;
  classNames?: Partial<ShellClassNames & SurfaceClassNames>;
}

export interface ActionMenuProps<T = unknown> extends ActionMenuRootProps {
  trigger?: React.ReactNode;
  menu: MenuDef<T>;
}

export function createActionMenu<T = unknown>(
  opts?: CreateActionMenuOptions<T>,
): CreateActionMenuResult<T> {
  const baseSlots = {
    ...defaultSlots<T>(),
    ...(opts?.slots as any),
  } as Required<ActionMenuSlots<T>>;
  const baseSlotProps = opts?.slotProps;
  const baseClassNames = opts?.classNames;

  function ActionMenu<T = unknown>(props: ActionMenuProps<T>) {
    return (
      <Root {...props} slotProps={baseSlotProps} classNames={baseClassNames}>
        <Trigger asChild>{props.trigger}</Trigger>
        <Positioner {...props.menu.ui?.slotProps?.positioner}>
          <Surface
            // @ts-expect-error MenuDef<T>' is not assignable to type 'MenuDef<T> | Menu<T>'
            menu={props.menu}
            slots={baseSlots}
            slotProps={baseSlotProps}
            classNames={baseClassNames}
          />
        </Positioner>
      </Root>
    );
  }

  return ActionMenu;
}
