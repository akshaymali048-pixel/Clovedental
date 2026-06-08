"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ClinicTimings } from "@/lib/clinic-settings";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/session";

const settingsSchema = z.object({
  clinicName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  whatsapp: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit WhatsApp number")
    .optional()
    .or(z.literal("")),
  address: z.string().min(10).max(500),
  googleMapsUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  emailAlert: z.string().email("Enter a valid email").optional().or(z.literal("")),
  weekdaysHours: z.string().min(3).max(100),
  saturdayHours: z.string().min(3).max(100),
  sundayHours: z.string().min(3).max(100),
  closedDays: z.string().max(200),
});

export type UpdateSettingsState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
};

function parseClosedDays(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);
}

function buildTimings(data: z.infer<typeof settingsSchema>): ClinicTimings {
  return {
    weekdays: data.weekdaysHours,
    saturday: data.saturdayHours,
    sunday: data.sundayHours,
    closed: parseClosedDays(data.closedDays),
  };
}

export async function updateClinicSettings(
  _prevState: UpdateSettingsState,
  formData: FormData,
): Promise<UpdateSettingsState> {
  await requireAuth();

  const raw = {
    clinicName: formData.get("clinicName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    whatsapp: formData.get("whatsapp")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    googleMapsUrl: formData.get("googleMapsUrl")?.toString() ?? "",
    emailAlert: formData.get("emailAlert")?.toString() ?? "",
    weekdaysHours: formData.get("weekdaysHours")?.toString() ?? "",
    saturdayHours: formData.get("saturdayHours")?.toString() ?? "",
    sundayHours: formData.get("sundayHours")?.toString() ?? "",
    closedDays: formData.get("closedDays")?.toString() ?? "",
  };

  const parsed = settingsSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please fix the errors below.",
      errors,
    };
  }

  const data = parsed.data;
  const timings = buildTimings(data);

  await prisma.clinicSettings.upsert({
    where: { id: "singleton" },
    update: {
      clinicName: data.clinicName,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      address: data.address,
      googleMapsUrl: data.googleMapsUrl || null,
      emailAlert: data.emailAlert || null,
      timings,
    },
    create: {
      id: "singleton",
      clinicName: data.clinicName,
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      address: data.address,
      googleMapsUrl: data.googleMapsUrl || null,
      emailAlert: data.emailAlert || null,
      timings,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return {
    success: true,
    message: "Settings saved. Changes are live on the website.",
  };
}
