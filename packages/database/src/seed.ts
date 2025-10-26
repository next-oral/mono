import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { reset as drizzleReset, seed as drizzleSeed } from "drizzle-seed";

import { db } from "./client";
import * as drizzleSchema from "./schema";
import { surfaces } from "./schema";

// Tooth type definitions
const toothTypes = [
  { name: "Molar" as const, description: "Back teeth used for grinding" },
  {
    name: "Premolar" as const,
    description: "Teeth between canines and molars",
  },
  { name: "Incisor" as const, description: "Front teeth used for cutting" },
  { name: "Canine" as const, description: "Pointed teeth used for tearing" },
];

// Tooth type to surface mappings
const toothTypeSurfaceMappings = [
  // Molars have all 5 surfaces
  {
    toothType: "Molar",
    surfaces: ["Buccal", "Lingual", "Mesial", "Distal", "Occlusal"],
  },
  // Premolars have all 5 surfaces
  {
    toothType: "Premolar",
    surfaces: ["Buccal", "Lingual", "Mesial", "Distal", "Occlusal"],
  },
  // Incisors have 3 surfaces (no Buccal/Lingual)
  { toothType: "Incisor", surfaces: ["Mesial", "Distal", "Occlusal"] },
  // Canines have 3 surfaces (no Buccal/Lingual)
  { toothType: "Canine", surfaces: ["Mesial", "Distal", "Occlusal"] },
];

const manualToothData = [
  // Maxillary Right (positions 1-8)
  { position: 1, name: "Maxillary Right Third Molar", toothType: "Molar" },
  { position: 2, name: "Maxillary Right Second Molar", toothType: "Molar" },
  { position: 3, name: "Maxillary Right First Molar", toothType: "Molar" },
  {
    position: 4,
    name: "Maxillary Right Second Premolar",
    toothType: "Premolar",
  },
  {
    position: 5,
    name: "Maxillary Right First Premolar",
    toothType: "Premolar",
  },
  { position: 6, name: "Maxillary Right Canine", toothType: "Canine" },
  {
    position: 7,
    name: "Maxillary Right Lateral Incisor",
    toothType: "Incisor",
  },
  {
    position: 8,
    name: "Maxillary Right Central Incisor",
    toothType: "Incisor",
  },

  // Maxillary Left (positions 9-16)
  { position: 9, name: "Maxillary Left Central Incisor", toothType: "Incisor" },
  {
    position: 10,
    name: "Maxillary Left Lateral Incisor",
    toothType: "Incisor",
  },
  { position: 11, name: "Maxillary Left Canine", toothType: "Canine" },
  {
    position: 12,
    name: "Maxillary Left First Premolar",
    toothType: "Premolar",
  },
  {
    position: 13,
    name: "Maxillary Left Second Premolar",
    toothType: "Premolar",
  },
  { position: 14, name: "Maxillary Left First Molar", toothType: "Molar" },
  { position: 15, name: "Maxillary Left Second Molar", toothType: "Molar" },
  { position: 16, name: "Maxillary Left Third Molar", toothType: "Molar" },

  // Mandibular Left (positions 17-24)
  { position: 17, name: "Mandibular Left Third Molar", toothType: "Molar" },
  { position: 18, name: "Mandibular Left Second Molar", toothType: "Molar" },
  { position: 19, name: "Mandibular Left First Molar", toothType: "Molar" },
  {
    position: 20,
    name: "Mandibular Left Second Premolar",
    toothType: "Premolar",
  },
  {
    position: 21,
    name: "Mandibular Left First Premolar",
    toothType: "Premolar",
  },
  { position: 22, name: "Mandibular Left Canine", toothType: "Canine" },
  {
    position: 23,
    name: "Mandibular Left Lateral Incisor",
    toothType: "Incisor",
  },
  {
    position: 24,
    name: "Mandibular Left Central Incisor",
    toothType: "Incisor",
  },

  // Mandibular Right (positions 25-32)
  {
    position: 25,
    name: "Mandibular Right Central Incisor",
    toothType: "Incisor",
  },
  {
    position: 26,
    name: "Mandibular Right Lateral Incisor",
    toothType: "Incisor",
  },
  { position: 27, name: "Mandibular Right Canine", toothType: "Canine" },
  {
    position: 28,
    name: "Mandibular Right First Premolar",
    toothType: "Premolar",
  },
  {
    position: 29,
    name: "Mandibular Right Second Premolar",
    toothType: "Premolar",
  },
  { position: 30, name: "Mandibular Right First Molar", toothType: "Molar" },
  { position: 31, name: "Mandibular Right Second Molar", toothType: "Molar" },
  { position: 32, name: "Mandibular Right Third Molar", toothType: "Molar" },
];

async function seedToothTypesAndSurfaces() {
  console.log("🦷 Seeding tooth types and surfaces...");

  // Insert tooth types
  const toothTypeMap = new Map<string, string>();
  for (const toothType of toothTypes) {
    const toothTypeId = createId();
    await db
      .insert(drizzleSchema.toothType)
      .values({
        id: toothTypeId,
        name: toothType.name,
        description: toothType.description,
      })
      .onConflictDoUpdate({
        target: [drizzleSchema.toothType.name],
        set: {
          id: toothTypeId,
          name: toothType.name,
          description: toothType.description,
        },
      });

    toothTypeMap.set(toothType.name, toothTypeId);
    console.log(`✅ Created tooth type: ${toothType.name}`);
  }

  // Insert surfaces
  const surfaceMap = new Map<string, string>();
  // console.log(surfaces);
  const surfacesDb = await db.query.toothSurface.findMany();
  for (const entry of surfacesDb) {
    const surface = surfaces.find((s) => s.name === entry.name);
    if (!surface) {
      continue;
    }

    await db
      .update(drizzleSchema.toothSurface)
      .set({
        description: surface.description,
      })
      .where(eq(drizzleSchema.toothSurface.id, entry.id));

    surfaceMap.set(surface.name, entry.id);

    console.log(`✅ Created surface: ${surface.name}`);
  }

  // Insert tooth type to surface mappings
  for (const mapping of toothTypeSurfaceMappings) {
    const toothTypeId = toothTypeMap.get(mapping.toothType);
    if (!toothTypeId) {
      throw new Error(`Tooth type not found: ${mapping.toothType}`);
    }

    for (const surfaceName of mapping.surfaces) {
      const surfaceId = surfaceMap.get(surfaceName);
      if (!surfaceId) {
        throw new Error(`Surface not found: ${surfaceName}`);
      }

      await db
        .insert(drizzleSchema.toothTypeSurface)
        .values({
          toothTypeId,
          surfaceId,
        })
        .onConflictDoNothing();
    }
    console.log(
      `✅ Mapped ${mapping.toothType} to ${mapping.surfaces.length} surfaces`,
    );
  }

  return { toothTypeMap, surfaceMap };
}

async function seedManualTeeth(toothTypeMap: Map<string, string>) {
  console.log("🦷 Seeding teeth manually...");

  for (const toothInfo of manualToothData) {
    const toothId = createId();
    const toothTypeId = toothTypeMap.get(toothInfo.toothType);

    if (!toothTypeId) {
      throw new Error(`Tooth type not found: ${toothInfo.toothType}`);
    }

    await db
      .insert(drizzleSchema.tooth)
      .values({
        id: toothId,
        name: toothInfo.name,
        position: toothInfo.position,
        toothTypeId,
        notation: "UNS" as const,
      })
      .onConflictDoUpdate({
        target: drizzleSchema.tooth.position,
        set: {
          id: toothId,
          name: toothInfo.name,
          toothTypeId,
          notation: "UNS" as const,
        },
      });

    console.log(
      `✅ Created tooth ${toothInfo.position} (${toothInfo.name}) - ${toothInfo.toothType}`,
    );
  }
}

async function seed() {
  const {
    // account,
    // user,
    verification: _verification,
    session: _session,
    invitation: _invitation,
    waitlist: _waitlist,

    toothTypeSurface: _toothTypeSurface,
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
          name: funcs.companyName(),
          slug: funcs.companyName().generate().toLowerCase().replace(/ /g, "-"),
          createdAt: funcs.date(),
        },
      },
      patient: {
        count: 800,
        columns: {
          gender: funcs.valuesFromArray({
            values: ["MALE", "FEMALE", "OTHER"],
          }),
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
      tooth: {
        count: 32,
        columns: {
          position: funcs.int({ minValue: 1, maxValue: 32, isUnique: true }),
        },
      },
      toothSurface: {
        count: 5,
        columns: {
          name: funcs.valuesFromArray({
            values: surfaces.map((surface) => surface.name),
            isUnique: true,
          }),
          description: funcs.loremIpsum(),
        },
      },
      toothType: {
        count: 4,
        columns: {
          name: funcs.valuesFromArray({
            values: toothTypes.map((toothType) => toothType.name),
            isUnique: true,
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

    // Seed tooth types, surfaces, and their relationships
    const { toothTypeMap } = await seedToothTypesAndSurfaces();

    await seedManualTeeth(toothTypeMap);

    console.log("✅ Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

await seed();
