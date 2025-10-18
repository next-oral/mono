import { memo } from "react";
import { X } from "lucide-react";

import { Button } from "@repo/design/components/ui/button";
import { cn } from "@repo/design/lib/utils";

import type { DataTableFilterActions } from "../core/types";
import type { Locale } from "../lib/i18n";
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
      aria-label="Reset filters"
      variant="outline"
      size="sm"
      className={cn(
        "border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive h-7 border-dashed",
        !hasFilters && "hidden",
      )}
      onClick={actions?.removeAllFilters}
      // onClick={onReset}
    >
      <X />
      <span className="hidden md:block">{t("clear", locale)}</span>
    </Button>
  );
}
