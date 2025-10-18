import { useZero } from "@rocicorp/zero/react";

import type { Dentist, Schema } from "@repo/zero/src/schema";
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

import type { DentistsWithAppointments } from "../query";
import { authClient } from "~/auth/client";
import { useZeroQuery } from "~/providers/zero";
import { buildQuery } from "../query";
import { useCalendarStore } from "../store";

export function DentistsSelector() {
  const z = useZero<Schema>();

  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  const currentDate = useCalendarStore((state) => state.currentDate);
  const filteredDentists = useCalendarStore((state) => state.filteredDentists);
  const updateFilteredDentists = useCalendarStore(
    (state) => state.updateFilteredDentists,
  );

  function handleFilter(dentist: DentistsWithAppointments) {
    const exists = filteredDentists.some((d) => d.id === dentist.id);
    if (exists) {
      if (filteredDentists.length < 2) return;
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

  function selectedDentistNamesLabel(dentists: Dentist[]) {
    if (dentists.length === 0) return "All Dentists";
    const names = dentists.map(
      (d) => `Dr. ${truncateText(d.firstName + " " + d.lastName, 10)}`,
    );
    if (names.length <= 2) return names.join(", ");
    return `${names[0]} + ${names.length - 1} more`;
  }

  const orgId = activeOrganization?.id ?? organizations?.[0]?.id ?? "";
  const { data: dentists } = useZeroQuery(buildQuery(z, currentDate, orgId));

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
            {selectedDentistNamesLabel(dentists)}
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
                      <span>
                        Dr. {dentist.firstName + " " + dentist.lastName}
                      </span>
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
