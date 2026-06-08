import Link from "next/link";
import { notFound } from "next/navigation";

import { AddActivityForm } from "@/components/admin/AddActivityForm";
import { LeadActivityFeed } from "@/components/admin/LeadActivityFeed";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { UpdateStatusForm } from "@/components/admin/UpdateStatusForm";
import { formatAbsoluteTime } from "@/lib/format-date";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/session";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  await requireAuth();

  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) {
    notFound();
  }

  const source =
    lead.utmSource || lead.utmMedium
      ? [lead.utmSource, lead.utmMedium].filter(Boolean).join(" / ")
      : "Direct";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex text-sm font-medium text-[#0d6e6e] hover:underline"
      >
        ← All Leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
              <LeadStatusBadge status={lead.status} />
            </div>

            <a
              href={`tel:${lead.phone}`}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#0d6e6e] px-6 py-3 text-lg font-semibold text-white transition hover:bg-[#0a5a5a] sm:w-auto"
            >
              📞 Call {lead.phone}
            </a>

            <dl className="mt-6 space-y-4 text-sm">
              {lead.email ? (
                <DetailRow label="Email" value={lead.email} />
              ) : null}
              <DetailRow label="Treatment" value={lead.service ?? "—"} />
              <DetailRow label="Preferred Time" value={lead.preferredTime ?? "—"} />
              <DetailRow label="Message" value={lead.message ?? "—"} />
            </dl>

            <hr className="my-6 border-slate-200" />

            <dl className="space-y-4 text-sm">
              <DetailRow label="Source" value={source} />
              <DetailRow label="Campaign" value={lead.utmCampaign ?? "—"} />
              <DetailRow label="Landing Page" value={lead.landingPage ?? "—"} />
              <DetailRow
                label="Created"
                value={formatAbsoluteTime(lead.createdAt)}
              />
            </dl>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <UpdateStatusForm leadId={lead.id} currentStatus={lead.status} />
          <LeadActivityFeed activities={lead.activities} />
          <AddActivityForm leadId={lead.id} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}
