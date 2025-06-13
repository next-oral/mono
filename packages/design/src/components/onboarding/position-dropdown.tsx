import { useEffect, useId, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "../../icons";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const UserPositions = [
  "Dentist",
  "Dental Assistant",
  "Receptionist",
  "Hygienist",
  "Practice Manager",
  "Orthodontist",
  "Oral Surgeon",
  "Lab Technician",
  "Other",
] as const;

export type UserPosition = (typeof UserPositions)[number];

export default function PositionsDropdown({
  onValueChange,
  defaultValue = "",
}: {
  label?: string;
  onValueChange?: (value: UserPosition) => void;
  defaultValue?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<UserPosition | "">(
    defaultValue as UserPosition | "",
  );

  useEffect(() => {
    if (onValueChange && value) onValueChange(value);
  }, [value, onValueChange]);

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input h-10 w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            {value ? (
              <span className="flex min-w-0 items-center">
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select position</span>
            )}
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search position..." />
            <CommandList>
              <CommandEmpty>No position found.</CommandEmpty>
              <CommandGroup>
                {UserPositions.map((position) => (
                  <CommandItem
                    key={position}
                    value={position}
                    onSelect={(currentValue) => {
                      setValue(currentValue as UserPosition);
                      setOpen(false);
                    }}
                  >
                    {position}
                    {value === position && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
