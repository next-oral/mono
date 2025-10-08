import type { Row, Zero } from "@rocicorp/zero";
import { addDays } from "date-fns";

import type { Schema } from "@repo/zero/src/schema";

export function buildQuery(
  zero: Zero<Schema>,
  currentDate: Date,
  orgId: string,
) {
  const today = currentDate.getTime();
  const tomorrow = addDays(currentDate, 1).getTime();
  return zero.query.dentist
    .where("orgId", "=", orgId)
    .related("appointments", (q) =>
      q
        .where((ops) => {
          return ops.and(
            ops.cmp("start", ">=", today),
            ops.cmp("start", "<=", tomorrow),
          );
        })
        .limit(100),
    );
}
export type DentistsWithAppointments = Row<ReturnType<typeof buildQuery>>;
