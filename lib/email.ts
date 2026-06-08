import { Resend } from "resend";
import type { Lead } from "@prisma/client";

import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadAlert(lead: Lead): Promise<void> {
  const settings = await prisma.clinicSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings?.emailAlert) {
    console.warn("No emailAlert configured in ClinicSettings — skipping lead email");
    return;
  }

  const service = lead.service ?? "General enquiry";
  const source =
    lead.utmSource || lead.utmMedium
      ? [lead.utmSource, lead.utmMedium].filter(Boolean).join(" / ")
      : "Direct";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f;">🦷 New Lead Received</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;">Name</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
            <a href="tel:${lead.phone}" style="color: #0d6e6e;">${lead.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;">Service</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${service}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;">Preferred Time</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${lead.preferredTime ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;">Message</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${lead.message ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; background: #f8fafc;">Source</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${source}</td>
        </tr>
      </table>
      <a href="tel:${lead.phone}"
         style="display: inline-block; background: #e07a4f; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
        📞 Call ${lead.name} Now
      </a>
    </div>
  `;

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Clove Dental <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: settings.emailAlert,
    subject: `🦷 New Lead: ${lead.name} — ${service}`,
    html,
  });
}
