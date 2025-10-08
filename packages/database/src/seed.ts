import { reset as drizzleReset, seed as drizzleSeed } from "drizzle-seed";

import { db } from "./client";
import * as drizzleSchema from "./schema";

export const toothName = [
  "Maxillary Right Third Molar",
  "Maxillary Right Second Molar",
  "Maxillary Right First Molar",
  "Maxillary Right Second Premolar",
  "Maxillary Right First Premolar",
  "Maxillary Right Canine",
  "Maxillary Right Lateral Incisor",
  "Maxillary Right Central Incisor",
  "Maxillary Left Central Incisor",
  "Maxillary Left Lateral Incisor",
  "Maxillary Left Canine",
  "Maxillary Left First Premolar",
  "Maxillary Left Second Premolar",
  "Maxillary Left First Molar",
  "Maxillary Left Second Molar",
  "Maxillary Left Third Molar",
  "Mandibular Left Third Molar",
  "Mandibular Left Second Molar",
  "Mandibular Left First Molar",
  "Mandibular Left Second Premolar",
  "Mandibular Left First Premolar",
  "Mandibular Left Canine",
  "Mandibular Left Lateral Incisor",
  "Mandibular Left Central Incisor",
  "Mandibular Right Central Incisor",
  "Mandibular Right Lateral Incisor",
  "Mandibular Right Canine",
  "Mandibular Right First Premolar",
  "Mandibular Right Second Premolar",
  "Mandibular Right First Molar",
  "Mandibular Right Second Molar",
  "Mandibular Right Third Molar",
];

async function seed() {
  const {
    // account,
    // user,
    verification,
    session,
    invitation,
    waitlist,
    // team,
    // teamMember,
    // member,
    ...schema
  } = drizzleSchema;

  try {
    const patient = await db.query.patient.findFirst();
    if (patient) {
      console.log("Database already seeded.");
      process.exit(0);
    }
    await drizzleReset(db, schema);

    await drizzleSeed(db, schema).refine((funcs) => ({
      // Seed base orgs to satisfy FK orgId on dependent tables
      team: {
        count: 3,
        columns: {
          createdAt: funcs.date(),
        },
      },
      user: {
        count: 3,
        columns: {
          name: funcs.fullName(),
          createdAt: funcs.date(),
        },
      },
      teamMember: {
        count: 3,
        columns: {
          createdAt: funcs.date(),
        },
      },
      member: {
        count: 3,
        columns: {
          createdAt: funcs.date(),
        },
      },

      organization: {
        count: 3,
        columns: {
          createdAt: funcs.date(),
        },
      },
      patient: {
        count: 800,
        columns: {
          dob: funcs.date({ minDate: "1900-01-01", maxDate: "2010-12-31" }),
          phone: funcs.phoneNumber({ template: "(###) ###-####" }),
        },
      },
      address: {
        count: 800,
        columns: {
          zipCode: funcs.postcode(),
          state: funcs.state(),
          city: funcs.city(),
          street: funcs.streetAddress(),
          country: funcs.country(),
        },
      },
      appointment: {
        count: 2000,
        columns: {
          start: funcs.date({ minDate: "2025-01-01", maxDate: "2026-12-31" }),
          end: funcs.date({ minDate: "2025-01-01", maxDate: "2026-12-31" }),
          note: funcs.loremIpsum(),
          description: funcs.loremIpsum(),
        },
      },
      clinicalNote: {
        count: 2000,
        columns: {
          notes: funcs.loremIpsum(),
        },
      },
      dentist: {
        count: 10,
        columns: {
          specialization: funcs.valuesFromArray({
            values: [
              "General Dentistry",
              "Orthodontics",
              "Periodontics",
              "Prosthodontics",
            ],
          }),
          licenseNumber: funcs.phoneNumber({ template: "###-####" }),
          phone: funcs.phoneNumber({ template: "(###) ###-####" }),
        },
      },
      treatmentPlan: {
        count: 400,
        columns: {
          notes: funcs.loremIpsum(),
        },
      },
      tooth: {
        count: 32,
        columns: {
          notation: funcs.default({ defaultValue: "UNS" }),
          position: funcs.int({ minValue: 1, maxValue: 32, isUnique: true }),
        },
      },

      file: {
        count: 100,
        columns: {
          storageUrl: funcs.default({
            defaultValue: "https://via.placeholder.com/150",
          }),
          fileType: funcs.valuesFromArray({
            values: ["image", "video", "audio", "document"],
          }),
        },
      },
      missingTooth: {
        count: 100,
        columns: {
          reason: funcs.loremIpsum(),
        },
      },
    }));
    console.log("✅ Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

await seed();
