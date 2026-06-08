"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { checkAppointmentRateLimit } from "@/lib/ratelimit";
import { sendLeadAlert } from "@/lib/email";
import { isLeadStatus, STATUS_LABELS } from "@/lib/lead-status";
import { requireAuth } from "@/lib/session";

const appointmentSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  service: z.string().optional(),
  message: z.string().max(500).optional(),
  preferredTime: z.string().max(100).optional(),
  website: z.string().max(0).optional(),
  formLoadedAt: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  landingPage: z.string().optional(),
});

export type AppointmentFormState = {
  success: boolean;
  message: string;
  errors?: Partial<Record<string, string>>;
};

const fakeSuccess: AppointmentFormState = {
  success: true,
  message: "Thank you for reaching out. We'll be in touch shortly.",
};

const realSuccess: AppointmentFormState = {
  success: true,
  message: "We'll call you within 2 hours to confirm your appointment.",
};

function parseFormData(formData: FormData) {
  return {
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    service: formData.get("service")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    preferredTime: formData.get("preferredTime")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
    formLoadedAt: formData.get("formLoadedAt")?.toString() ?? "",
    utmSource: formData.get("utmSource")?.toString() ?? "",
    utmMedium: formData.get("utmMedium")?.toString() ?? "",
    utmCampaign: formData.get("utmCampaign")?.toString() ?? "",
    landingPage: formData.get("landingPage")?.toString() ?? "",
  };
}

export async function submitAppointment(
  _prevState: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  const rateLimitOk = await checkAppointmentRateLimit(ip);
  if (!rateLimitOk) {
    return {
      success: false,
      message:
        "Too many requests. Please try again later or call us directly.",
    };
  }

  const raw = parseFormData(formData);

  if (raw.website) {
    return fakeSuccess;
  }

  const loadedAt = Number(raw.formLoadedAt);
  if (!Number.isNaN(loadedAt) && Date.now() - loadedAt < 3000) {
    return fakeSuccess;
  }

  const parsed = appointmentSchema.safeParse(raw);

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

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        service: data.service || null,
        message: data.message || null,
        preferredTime: data.preferredTime || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        landingPage: data.landingPage || null,
        activities: {
          create: {
            action: "New lead via web form",
            createdBy: "system",
          },
        },
      },
    });

    sendLeadAlert(lead).catch((error) => {
      console.error("Failed to send lead alert email:", error);
    });

    prisma.eventLog
      .create({
        data: {
          type: "FORM_SUBMIT",
          page: data.landingPage || "/",
          leadId: lead.id,
        },
      })
      .catch(() => {});

    return realSuccess;
  } catch (error) {
    console.error("Failed to create lead:", error);
    return {
      success: false,
      message: "Something went wrong. Please call us directly.",
    };
  }
}

export type UpdateStatusState = {
  success: boolean;
  error?: string;
};

export async function updateLeadStatus(
  leadId: string,
  _prevState: UpdateStatusState,
  formData: FormData,
): Promise<UpdateStatusState> {
  const session = await requireAuth();

  const newStatus = formData.get("newStatus")?.toString() ?? "";

  if (!isLeadStatus(newStatus)) {
    return { success: false, error: "Invalid status" };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: newStatus },
  });

  // createdBy convention: human admin actions use session.adminName, not "system"
  await prisma.leadActivity.create({
    data: {
      leadId,
      action: `Status changed to ${STATUS_LABELS[newStatus]}`,
      createdBy: session.adminName,
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");

  return { success: true };
}

export type AddActivityState = {
  success: boolean;
  error?: string;
};

export async function addLeadActivity(
  leadId: string,
  _prevState: AddActivityState,
  formData: FormData,
): Promise<AddActivityState> {
  const session = await requireAuth();

  const text = formData.get("action")?.toString().trim() ?? "";

  if (text.length < 3) {
    return { success: false, error: "Note must be at least 3 characters" };
  }

  if (text.length > 500) {
    return { success: false, error: "Note must be 500 characters or fewer" };
  }

  await prisma.leadActivity.create({
    data: {
      leadId,
      action: text,
      createdBy: session.adminName,
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);

  return { success: true };
}
