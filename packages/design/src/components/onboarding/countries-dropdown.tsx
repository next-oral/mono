import { Fragment, useEffect, useId, useState } from "react";

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

interface Continents {
  name: string;
  countries: { name: string; flag: string }[];
}

const countries = [
  {
    name: "America",
    countries: [
      { name: "United States", flag: "🇺🇸" },
      { name: "Canada", flag: "🇨🇦" },
      { name: "Mexico", flag: "🇲🇽" },
    ],
  },
  {
    name: "Africa",
    countries: [
      { name: "South Africa", flag: "🇿🇦" },
      { name: "Nigeria", flag: "🇳🇬" },
      { name: "Morocco", flag: "🇲🇦" },
    ],
  },
  {
    name: "Asia",
    countries: [
      { name: "China", flag: "🇨🇳" },
      { name: "Japan", flag: "🇯🇵" },
      { name: "India", flag: "🇮🇳" },
    ],
  },
  {
    name: "Europe",
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" },
      { name: "France", flag: "🇫🇷" },
      { name: "Germany", flag: "🇩🇪" },
    ],
  },
  {
    name: "Oceania",
    countries: [
      { name: "Australia", flag: "🇦🇺" },
      { name: "New Zealand", flag: "🇳🇿" },
    ],
  },
] satisfies Continents[];

export function CountriesDropdown({
  continents = countries,
  onValueChange = () => null,
}: {
  onValueChange?: (value: string) => void;
  continents?: Continents[];
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    onValueChange(value);
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
                  {
                    continents
                      .map((group) =>
                        group.countries.find((item) => item.name === value),
                      )
                      .find(Boolean)?.flag
                  }
                </span>
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select country</span>
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
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              {countries.map((group) => (
                <Fragment key={group.name}>
                  <CommandGroup heading={group.name}>
                    {group.countries.map((country) => (
                      <CommandItem
                        key={country.name}
                        value={country.name}
                        onSelect={(currentValue: string) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        <span className="text-lg leading-none">
                          {country.flag}
                        </span>{" "}
                        {country.name}
                        {value === country.name && (
                          <CheckIcon size={16} className="ml-auto" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
