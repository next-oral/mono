"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2Icon } from "lucide-react";

import { cn } from "@repo/design/lib/utils";

import { Button } from "../ui/button";

export function ChartHeader() {
  const [active, setActive] = useState<Item>("All");

  return (
    <div className="flex h-10 items-center justify-between border-r-1 px-2">
      <div>This iss</div>
      <motion.ul
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center gap-2"
      >
        {items.map((label) => (
          <AnimatedButtonItem
            key={label}
            label={label}
            active={active === label}
            onClick={() => setActive(label)}
          />
        ))}
      </motion.ul>
    </div>
  );
}

const items = ["All", "In progress", "Completed"] as const;

type Item = (typeof items)[number];

interface AnimatedButtonItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function AnimatedButtonItem({
  label,
  active,
  onClick,
}: AnimatedButtonItemProps) {
  const iconClass = "size-4 hidden fill-slate-900 text-slate-100 ";

  return (
    <motion.li
      key={label}
      layout
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 33,
      }}
      animate={
        active
          ? {
              scale: 1.02,
            }
          : { scale: 1 }
      }
    >
      <Button
        variant={active ? "default" : "outline"}
        onClick={onClick}
        className="relative capitalize"
      >
        {active && (
          <motion.span
            initial={false}
            animate={{
              x: 0,
              scale: 1.2,
            }}
            transition={{ duration: 0.18, type: "tween" }}
            className="inline-flex items-center"
          >
            <CheckCircle2Icon
              className={cn(iconClass, {
                block: active,
              })}
            />
          </motion.span>
        )}
        <span className="text-xs">{label}</span>
      </Button>
    </motion.li>
  );
}
