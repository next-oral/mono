import { Fragment, useId, useState } from "react";

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
  countries: { slug: string; name: string; flag: string }[];
}

const countries = [
  {
    name: "America",
    countries: [
      { slug: "us", name: "United States", flag: "🇺🇸" },
      { slug: "ca", name: "Canada", flag: "🇨🇦" },
      { slug: "mx", name: "Mexico", flag: "🇲🇽" },
    ],
  },
  {
    name: "Africa",
    countries: [
      { slug: "za", name: "South Africa", flag: "🇿🇦" },
      { slug: "ng", name: "Nigeria", flag: "🇳🇬" },
      { slug: "ma", name: "Morocco", flag: "🇲🇦" },
    ],
  },
  {
    name: "Asia",
    countries: [
      { slug: "cn", name: "China", flag: "🇨🇳" },
      { slug: "jp", name: "Japan", flag: "🇯🇵" },
      { slug: "in", name: "India", flag: "🇮🇳" },
    ],
  },
  {
    name: "Europe",
    countries: [
      { slug: "gb", name: "United Kingdom", flag: "🇬🇧" },
      { slug: "fr", name: "France", flag: "🇫🇷" },
      { slug: "de", name: "Germany", flag: "🇩🇪" },
    ],
  },
  {
    name: "Oceania",
    countries: [
      { slug: "au", name: "Australia", flag: "🇦🇺" },
      { slug: "nz", name: "New Zealand", flag: "🇳🇿" },
    ],
  },
] satisfies Continents[];

export function CountriesDropdown({
  continents = countries,
  value,
  onValueChange = () => null,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  continents?: Continents[];
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  const currentCountry = continents
    .map((group) => group.countries.find((item) => item.slug === value))
    .find(Boolean);

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
                  {currentCountry?.flag}
                </span>
                <span className="truncate">{currentCountry?.name}</span>
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
                        value={country.slug}
                        onSelect={(currentValue: string) => {
                          onValueChange(currentValue);
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
