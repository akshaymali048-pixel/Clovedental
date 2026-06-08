import { z } from "zod";

import { prisma } from "@/lib/db";

const bodySchema = z.object({
  type: z.enum(["CALL_CLICK", "WHATSAPP_CLICK", "FORM_SUBMIT"]),
  page: z.string(),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (parsed.success) {
      await prisma.eventLog.create({
        data: {
          type: parsed.data.type,
          page: parsed.data.page,
          sessionId: parsed.data.sessionId ?? null,
        },
      });
    }
  } catch {
    // Analytics failure must not surface to the client
  }

  return Response.json({ ok: true }, { status: 200 });
}
