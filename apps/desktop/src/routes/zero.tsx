import type { Zero } from "@rocicorp/zero";
import { useMemo, useState } from "react";
import { useQuery } from "@rocicorp/zero/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import type { Mutators } from "@repo/zero/mutators";
import type { Schema } from "@repo/zero/schema";

export const Route = createFileRoute("/zero")({
  component: PatientsPage,
});

const limit = 1000;
function listQuery(zero: Zero<Schema, Mutators>, q: string | undefined) {
  let query = zero.query.patient.orderBy("createdAt", "desc").limit(limit);

  if (q) {
    // simple name search on first or last name
    query = query.where("firstName", "ILIKE", `%${q}%`);
    // ('lastName', 'ILIKE', `%${q}%`);
  }
  return query;
}

function PatientsPage() {
  const router = useRouter();
  const { zero } = router.options.context;

  const [search, setSearch] = useState("");
  const qs = Route.useSearch();
  const searchParam = qs.q ?? "";

  const opts = useMemo(
    () => (search !== searchParam ? undefined : ({ ttl: "none" } as const)),
    [search, searchParam],
  );

  const [patients, { type }] = useQuery(zero.query.patient);
  const [total] = useQuery(zero.query.patient);

  const [clinicalNotes, { type: clinicalNotesType }] = useQuery(
    zero.query.clinicalNote.limit(10),
  );

  const [dentists, { type: dentistsType }] = useQuery(
    zero.query.dentist.limit(10),
  );

  console.log(patients);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* {`This is ${total.length} patients`} */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="text"
          placeholder="Search patients by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // setSearchParam(e.target.value);
          }}
          style={{ fontSize: "110%", padding: 6 }}
        />
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {patients.map((p) => (
          <li
            key={p.id}
            style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
          >
            <Link to="/patient" search={{ id: p.id }}>
              {p.lastName}, {p.firstName}
            </Link>
            {p.phone ? <span style={{ marginLeft: 8 }}>{p.phone}</span> : null}
            {<span style={{ marginLeft: 8 }}>{p.email}</span>}
            {<span style={{ marginLeft: 8 }}>{p.status}</span>}
          </li>
        ))}
        {type === "unknown" && patients.length < limit && <div>Loading...</div>}

        {dentistsType === "unknown" && <div>Loading...</div>}
        {dentistsType === "complete" && (
          <pre>{JSON.stringify(dentists, null, 2)}</pre>
        )}

        {clinicalNotesType === "unknown" && <div>Loading...</div>}
        {clinicalNotesType === "complete" && (
          <pre>{JSON.stringify(clinicalNotes, null, 2)}</pre>
        )}
      </ul>
    </div>
  );
}
