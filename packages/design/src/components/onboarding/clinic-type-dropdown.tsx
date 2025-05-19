import { useEffect, useId, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "../../icons";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ClinicType {
  name: string;
  description: string;
}

const clinicTypes = [
  {
    name: "General Dentistry",
    description: "Comprehensive dental care for all ages",
    icon: "🦷",
  },
  {
    name: "Orthodontics",
    description: "Specialized in teeth alignment and braces",
    icon: "😁",
  },
  {
    name: "Pediatric Dentistry",
    description: "Dental care for children and teens",
    icon: "👶",
  },
  {
    name: "Endodontics",
    description: "Root canal and pulp treatments",
    icon: "🦷",
  },
  {
    name: "Periodontics",
    description: "Gum disease and dental implants",
    icon: "🦷",
  },
  {
    name: "Prosthodontics",
    description: "Dental prosthetics and restoration",
    icon: "🦷",
  },
  {
    name: "Oral Surgery",
    description: "Surgical procedures and extractions",
    icon: "🔪",
  },
  {
    name: "Cosmetic Dentistry",
    description: "Aesthetic dental procedures",
    icon: "✨",
  },
] satisfies (ClinicType & { icon: string })[];

export function ClinicTypeDropdown({
  onValueChange,
}: {
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (onValueChange) onValueChange(value);
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Find the selected clinic type
  const selectedType = clinicTypes.find((type) => type.name === value);

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            {value ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-lg leading-none">
                  {selectedType?.icon}
                </span>
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select clinic type</span>
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
            <CommandInput placeholder="Search clinic type..." />
            <CommandList>
              <CommandEmpty>No clinic type found.</CommandEmpty>
              {clinicTypes.map((type) => (
                <CommandItem
                  key={type.name}
                  value={type.name}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{type.icon}</span>
                    <div className="flex flex-col">
                      <span>{type.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {type.description}
                      </span>
                    </div>
                  </div>
                  {value === type.name && (
                    <CheckIcon size={16} className="ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
