import type { ClinicSettings } from "@prisma/client";

import { prisma } from "@/lib/db";

export type ClinicTimings = {
  weekdays?: string;
  saturday?: string;
  sunday?: string;
  closed?: string[];
};

export type ClinicSettingsData = {
  clinicName: string;
  phone: string;
  whatsapp: string | null;
  address: string;
  googleMapsUrl: string | null;
  timings: ClinicTimings;
  emailAlert: string | null;
};

const fallbackSettings: ClinicSettingsData = {
  clinicName: "Clove Dental",
  phone: "9192939495",
  whatsapp: "9192939495",
  address:
    "240/1, Shop No 112, 113, 114, 115, 116, 117, Laxmi Complex, Near Big Bazar, Mumbai Pune Road, Pimpri Colony, Pimpri Chinchwad, Pune",
  googleMapsUrl: null,
  timings: {
    weekdays: "10:30 AM – 07:30 PM",
    saturday: "10:30 AM – 07:30 PM",
    sunday: "10:30 AM – 07:30 PM",
    closed: ["Monday"],
  },
  emailAlert: null,
};

function parseTimings(timings: ClinicSettings["timings"]): ClinicTimings {
  if (!timings || typeof timings !== "object" || Array.isArray(timings)) {
    return fallbackSettings.timings;
  }

  const value = timings as Record<string, unknown>;

  return {
    weekdays: typeof value.weekdays === "string" ? value.weekdays : undefined,
    saturday: typeof value.saturday === "string" ? value.saturday : undefined,
    sunday: typeof value.sunday === "string" ? value.sunday : undefined,
    closed: Array.isArray(value.closed)
      ? value.closed.filter((item): item is string => typeof item === "string")
      : undefined,
  };
}

export async function getClinicSettings(): Promise<ClinicSettingsData> {
  try {
    const settings = await prisma.clinicSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      return fallbackSettings;
    }

    return {
      clinicName: settings.clinicName,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: settings.address,
      googleMapsUrl: settings.googleMapsUrl,
      timings: parseTimings(settings.timings),
      emailAlert: settings.emailAlert,
    };
  } catch {
    return fallbackSettings;
  }
}
