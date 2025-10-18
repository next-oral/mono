import type { Row, Zero } from "@rocicorp/zero";
import { addDays, startOfDay } from "date-fns";

import type { Schema } from "@repo/zero/schema";

export function buildQuery(
  zero: Zero<Schema>,
  currentDate: Date,
  orgId: string,
) {
  const today = startOfDay(currentDate).getTime();
  const tomorrow = startOfDay(addDays(currentDate, 1)).getTime();
  return zero.query.dentist
    .where("orgId", "=", orgId)
    .related("appointments", (q) =>
      q.where("start", ">=", today).where("start", "<=", tomorrow),
    );
}
export type DentistsWithAppointments = Row<ReturnType<typeof buildQuery>>;
