import { z } from "zod";

const UserPostions = [
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

const codes = [
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
  code: (typeof codes)[number];
  name: string;
  flag: string;
}

export const locales = [
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
] as const satisfies readonly LocaleObject[];

export type Locale = LocaleObject["code"];

export const profileFormSchema = z.object({
  firstName: z
    .string({
      required_error: "Firstname is required",
    })
    .min(1, {
      message: "Must be at least 3 characters",
    }),
  lastName: z
    .string({
      required_error: "Lastname is required",
    })
    .min(1, {
      message: "Must be at least 3 characters",
    }),
  position: z.enum(UserPostions),
  locale: z.enum(codes),
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
}
export type OnboardingData =
  | ProfileData
  | { step: Exclude<OnboardingStep, "profile"> };

export const organizations = ["multi-clinic", "single-clinic"] as const;
export type OrganizationType = (typeof organizations)[number];
export const orgFormSchema = z.object({
  name: z.string().min(1),
  type: z.enum(organizations),
});
export type OrgForm = z.infer<typeof orgFormSchema>;

const clincTypes = [
  // By Specialization
  "General Dentistry Clinic",
  "Pediatric Dentistry Clinic",
  "Orthodontic Clinic",
  "Periodontic Clinic",
  "Endodontic Clinic",
  "Prosthodontic Clinic",
  "Oral and Maxillofacial Surgery Clinic",
  "Cosmetic Dentistry Clinic",
  "Geriatric Dentistry Clinic",
  "Implant Dentistry Clinic",

  // By Practice Model
  "Private Dental Clinic",
  "Group Dental Practice",
  "Corporate Dental Clinic",
  "Hospital-Based Dental Clinic",
  "University Dental Clinic",
  "Mobile Dental Clinic",
  "Community/Public Health Dental Clinic",
  "Emergency Dental Clinic",
] as const;

export const clinicSchema = z.object({
  orgId: z.string(),
  clinics: z.array(
    z.object({
      name: z.string().min(1, {
        message: "Clinic is required",
      }),
      country: z.enum(["us", "germany", "austria"]),
      speciality: z.enum(clincTypes),
    }),
  ),
});

export type ClinicForm = z.infer<typeof clinicSchema>;
