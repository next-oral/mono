import { memo } from "react";
import { FilterXIcon } from "lucide-react";

import { cn } from "@repo/design/lib/utils";

import type { DataTableFilterActions } from "../core/types";
import type { Locale } from "../lib/i18n";
import { Button } from "../../ui/button";
import { t } from "../lib/i18n";

interface FilterActionsProps {
  hasFilters: boolean;
  actions?: DataTableFilterActions;
  locale?: Locale;
}

export const FilterActions = memo(__FilterActions);
function __FilterActions({
  hasFilters,
  actions,
  locale = "en",
}: FilterActionsProps) {
  return (
    <Button
      className={cn("h-7 !px-2", !hasFilters && "hidden")}
      variant="destructive"
      onClick={actions?.removeAllFilters}
    >
      <FilterXIcon />
      <span className="hidden md:block">{t("clear", locale)}</span>
    </Button>
  );
}
