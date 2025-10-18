import { ChevronsUpDown } from "lucide-react";

import { truncateText } from "@repo/design/lib/utils";

import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useCalendarStore } from "../store/store";

{
  /* Popover + Command (combobox-like) for selecting dentists (store objects) */
}
export function DentistsSelector() {
  const {
    dentists,
    isDentistsSelectorOpen,
    selectedDentists,
    setIsDentistsSelectorOpen,
    setSelectedDentists,
    toggleDentistSelectionObject,
  } = useCalendarStore();

  const selectedDentistNamesLabel = () => {
    if (selectedDentists.length === 0) return "All Dentists";
    const names = selectedDentists.map(
      (d) => `Dr. ${truncateText(d.name, 10)}`,
    );
    if (names.length <= 2) return names.join(", ");
    return `${names[0]} + ${names.length - 1} more`;
  };

  function selectAllDentistsObjects() {
    setSelectedDentists([]); // empty array = all
  }

  return (
    <Popover
      open={isDentistsSelectorOpen}
      onOpenChange={setIsDentistsSelectorOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isDentistsSelectorOpen}
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
              onSelect={() => selectAllDentistsObjects()}
              className="data-[selected=true]:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedDentists.length === 0} />
                <span>All Dentists</span>
              </div>
            </CommandItem>
          </CommandGroup>

          <CommandGroup>
            {dentists.map((dentist) => {
              const checked =
                selectedDentists.length === 0 ||
                selectedDentists.some((s) => s.id === dentist.id);
              return (
                <CommandItem
                  key={dentist.id}
                  onSelect={() => toggleDentistSelectionObject(dentist)}
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
  );
}
