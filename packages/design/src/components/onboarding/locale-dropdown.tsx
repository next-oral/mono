import { useId, useState } from "react";

import type { LocaleCode } from "@repo/validators";

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
import { groupedLocales, locales } from "./schema";

export default function LocaleDropdown({
  onValueChange,
  value = "en-US",
  showFlags = true,
}: {
  onValueChange?: (value: LocaleCode) => void;
  value?: LocaleCode;
  showFlags?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  // Find the selected locale object
  const selectedLocale = locales.find((locale) => locale.code === value);

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
            {selectedLocale ? (
              <span className="flex min-w-0 items-center gap-2">
                {showFlags && (
                  <span className="text-lg leading-none">
                    {selectedLocale.flag}
                  </span>
                )}
                <span className="truncate">{selectedLocale.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select language</span>
            )}
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input max-h-80 w-full min-w-[var(--radix-popper-anchor-width)] overflow-auto p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              {Object.entries(groupedLocales).map(([language, locales]) => (
                <CommandGroup key={language} heading={language}>
                  {locales.map((locale) => (
                    <CommandItem
                      key={locale.code}
                      value={`${locale.name} ${locale.code}`}
                      onSelect={() => {
                        onValueChange?.(locale.code);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {showFlags && (
                          <span className="text-lg leading-none">
                            {locale.flag}
                          </span>
                        )}
                        <span>{locale.name}</span>
                      </div>
                      {value === locale.code && (
                        <CheckIcon size={16} className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
