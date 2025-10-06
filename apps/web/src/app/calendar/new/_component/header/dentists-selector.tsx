import { Button } from "@repo/design/src/components/ui/button";
import { Checkbox } from "@repo/design/src/components/ui/checkbox";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/design/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design/src/components/ui/popover";
import { ChevronsUpDown } from "@repo/design/src/icons";
import { truncateText } from "@repo/design/src/lib/utils";

import type { Dentist } from "../types";
import { dentists } from "../constants";
import { useCalendarStore } from "../store";

export function DentistsSelector() {
  const filteredDentists = useCalendarStore((state) => state.filteredDentists);
  const updateFilteredDentists = useCalendarStore(
    (state) => state.updateFilteredDentists,
  );

  function handleFilter(dentist: Dentist) {
    const exists = filteredDentists.some((d) => d.id === dentist.id);
    if (exists) {
      if (filteredDentists.length < 2) {
        return;
      }
      updateFilteredDentists(
        filteredDentists.filter((x) => x.id !== dentist.id),
      );
    } else {
      updateFilteredDentists([...filteredDentists, dentist]);
    }
  }

  function handleSelectAll() {
    updateFilteredDentists(dentists);
  }

  function selectedDentistNamesLabel() {
    if (filteredDentists.length === 0) return "All Dentists";
    const names = filteredDentists.map(
      (d) => `Dr. ${truncateText(d.name, 10)}`,
    );
    if (names.length <= 2) return names.join(", ");
    return `${names[0]} + ${names.length - 1} more`;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs font-medium">Show</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            // aria-expanded={isDentistsSelectorOpen}
            className="justify-between overflow-x-hidden text-xs md:w-[240px]"
          >
            {selectedDentistNamesLabel()}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="size-fit p-0">
          <Command>
            <CommandInput placeholder="Search dentist..." className="h-9" />
            <CommandGroup className="border-b">
              <CommandItem
                onSelect={() => handleSelectAll()}
                className="data-[selected=true]:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filteredDentists.length === dentists.length}
                  />
                  <span>All Dentists</span>
                </div>
              </CommandItem>
            </CommandGroup>

            <CommandGroup>
              {dentists.map((dentist) => {
                const checked =
                  filteredDentists.length === 0 ||
                  filteredDentists.some((s) => s.id === dentist.id);
                return (
                  <CommandItem
                    key={dentist.id}
                    onSelect={() => handleFilter(dentist)}
                    className="capitalize data-[selected=true]:bg-transparent"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={checked} />
                      <span>Dr. {dentist.name}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
