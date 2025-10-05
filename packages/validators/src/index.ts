import { z } from "zod/v4";

export const UserPositions = [
  "Dentist",
  "Dental Assistant",
  "Receptionist",
  "Hygienist",
  "Practice Manager",
  "Orthodontist",
  "Oral Surgeon",
  "Lab Technician",
  "Other",
] as const;

export const LocaleCodes = [
  "en-US",
  "en-GB",
  "es-ES",
  "es-MX",
  "fr-FR",
  "fr-CA",
  "de-DE",
  "it-IT",
  "pt-BR",
  "pt-PT",
  "nl-NL",
  "sv-SE",
  "no-NO",
  "da-DK",
  "fi-FI",
  "ja-JP",
  "ko-KR",
  "zh-CN",
  "zh-TW",
  "ar-SA",
  "hi-IN",
  "ru-RU",
  "pl-PL",
  "tr-TR",
] as const;
export interface LocaleObject {
  code: (typeof LocaleCodes)[number];
  name: string;
  flag: string;
}

export const Locales = [
  { code: "en-US", name: "English (United States)", flag: "🇺🇸" },
  { code: "en-GB", name: "English (United Kingdom)", flag: "🇬🇧" },
  { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
  { code: "es-MX", name: "Spanish (Mexico)", flag: "🇲🇽" },
  { code: "fr-FR", name: "French (France)", flag: "🇫🇷" },
  { code: "fr-CA", name: "French (Canada)", flag: "🇨🇦" },
  { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian (Italy)", flag: "🇮🇹" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
  { code: "pt-PT", name: "Portuguese (Portugal)", flag: "🇵🇹" },
  { code: "nl-NL", name: "Dutch (Netherlands)", flag: "🇳🇱" },
  { code: "sv-SE", name: "Swedish (Sweden)", flag: "🇸🇪" },
  { code: "no-NO", name: "Norwegian (Norway)", flag: "🇳🇴" },
  { code: "da-DK", name: "Danish (Denmark)", flag: "🇩🇰" },
  { code: "fi-FI", name: "Finnish (Finland)", flag: "🇫🇮" },
  { code: "ja-JP", name: "Japanese (Japan)", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean (South Korea)", flag: "🇰🇷" },
  { code: "zh-CN", name: "Chinese Simplified (China)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese Traditional (Taiwan)", flag: "🇹🇼" },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)", flag: "🇸🇦" },
  { code: "hi-IN", name: "Hindi (India)", flag: "🇮🇳" },
  { code: "ru-RU", name: "Russian (Russia)", flag: "🇷🇺" },
  { code: "pl-PL", name: "Polish (Poland)", flag: "🇵🇱" },
  { code: "tr-TR", name: "Turkish (Turkey)", flag: "🇹🇷" },
] as const satisfies LocaleObject[];

export type LocaleCode = LocaleObject["code"];

export const groupedLocales = Locales.reduce(
  (groups, locale) => {
    const language = locale.code.split("-")[0];
    const languageName = language
      ? new Intl.DisplayNames(["en"], { type: "language" }).of(language)
      : null;

    if (!languageName) return {};

    groups[languageName] ??= [];
    groups[languageName].push(locale);
    return groups;
  },
  {} as Record<string, (typeof Locales)[number][]>,
);

export const profileFormSchema = z.object({
  firstName: z
    .string({
      message: "Firstname is required",
    })
    .min(1, {
      message: "Must be at least 3 characters",
    }),
  lastName: z
    .string({
      message: "Lastname is required",
    })
    .min(1, {
      message: "Must be at least 3 characters",
    }),
  position: z.enum(UserPositions),
  locale: z.enum(LocaleCodes),
  email: z.string().email(),
});
export type ProfileForm = z.infer<typeof profileFormSchema>;

export type OnboardingStep =
  | "welcome"
  | "started"
  | "profile"
  | "organization"
  | "clinic"
  | "invite";

export interface ProfileData {
  step: "profile";
  email: string;
  name: string;
}
export interface OrganizationData {
  step: "organization";
  checkSlug: (slug: string) => Promise<boolean>;
}

export type OnboardingData =
  | ProfileData
  | OrganizationData
  | { step: Exclude<OnboardingStep, "profile" | "organization"> };

export const organizations = ["multi-clinic", "single-clinic"] as const;
export type OrganizationType = (typeof organizations)[number];
export const orgFormSchema = z.object({
  name: z.string().min(1),
  type: z.enum(organizations),
});
export type OrgForm = z.infer<typeof orgFormSchema>;

export const ClinicTypes = [
  // By Specialization
  "General",
  "Pediatrics",
  "Orthodontics",
  "Periodontics",
  "Endodontics",
  "Prosthodontics",
  "Oral and Maxillofacial Surgery",
  "Cosmetic",
  "Geriatric",
  "Implant",

  // By Practice Model
  "Private Dental",
  "Group Dental Practice",
  "Corporate Dental",
  "Hospital-Based Dental",
  "University Dental",
  "Mobile Dental",
  "Community/Public Health Dental",
  "Emergency Dental",
] as const;

export const clinicSchema = z.object({
  orgId: z.string(),
  clinics: z.array(
    z.object({
      name: z.string().min(1, {
        message: "Clinic is required",
      }),
      country: z.enum(["us", "de", "au"], {
        message: "Country is required",
      }),
      speciality: z.enum(ClinicTypes, {
        message: "Speciality is required",
      }),
    }),
  ),
});

export type ClinicForm = z.infer<typeof clinicSchema>;

export const INVALID_SLUGS_REGEX =
  /^(www|admin|api|auth|login|logout|signup|register|user|users|me|account|settings|dashboard|about|contact|support|help|privacy|terms|status|blog|faq|system|config|root|files|explore|search|feed|notifications|messages|inbox|home|app|application|client|waitlist|onboarding|server|backend|frontend|undefined|null|true|false|404|500)$/i;

export function must<T>(
  value: T | undefined | null,
  message = "Assertion failed. Required value is null or undefined.",
): T {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
  return value;
}
