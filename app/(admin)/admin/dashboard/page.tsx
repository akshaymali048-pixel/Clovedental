import Link from "next/link";
import type { LeadStatus } from "@prisma/client";

import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { prisma } from "@/lib/db";
import { ALL_LEAD_STATUSES, STATUS_CONFIG } from "@/lib/lead-status";
import { requireAuth } from "@/lib/session";

export default async function AdminDashboardPage() {
  await requireAuth();

  // Charts deferred. Show raw numbers first.
  // Visualize after owner has identified which numbers matter.

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    statusCounts,
    totalLeads,
    recentLeads,
    callsWeek,
    waWeek,
    formsWeek,
    callsMonth,
    waMonth,
    formsMonth,
  ] = await Promise.all([
    prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.eventLog.count({
      where: { type: "CALL_CLICK", createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.eventLog.count({
      where: { type: "WHATSAPP_CLICK", createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.eventLog.count({
      where: { type: "FORM_SUBMIT", createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.eventLog.count({
      where: { type: "CALL_CLICK", createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.eventLog.count({
      where: { type: "WHATSAPP_CLICK", createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.eventLog.count({
      where: { type: "FORM_SUBMIT", createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  const countByStatus = new Map<LeadStatus, number>(
    statusCounts.map((row) => [row.status, row._count.id]),
  );

  const newCount = countByStatus.get("NEW") ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Quick overview of your leads.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Leads" value={totalLeads} />
        <SummaryCard label="Last 30 Days" value={recentLeads} />
        <Link
          href="/admin/leads?status=NEW"
          className="rounded-xl border border-blue-200 bg-blue-50 p-5 transition hover:border-blue-300"
        >
          <p className="text-sm font-medium text-blue-700">New (unworked)</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{newCount}</p>
        </Link>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          By Status
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_LEAD_STATUSES.map((status) => {
            const config = STATUS_CONFIG[status];
            const count = countByStatus.get(status) ?? 0;

            return (
              <Link
                key={status}
                href={`/admin/leads?status=${status}`}
                className={`rounded-xl border bg-white p-5 transition hover:shadow-sm ${config.borderClassName}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <LeadStatusBadge status={status} />
                  <span className="text-2xl font-bold text-slate-900">{count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Conversion Channels
        </h2>
        {/* Visualisation of this data deferred to Slice 7.
            Show numbers now. Learn which matters. Chart later. */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-700">Channel</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Last 7 days</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Last 30 days</th>
              </tr>
            </thead>
            <tbody>
              <ConversionRow label="📞 Calls" week={callsWeek} month={callsMonth} />
              <ConversionRow label="💬 WA" week={waWeek} month={waMonth} />
              <ConversionRow label="📋 Forms" week={formsWeek} month={formsMonth} />
              <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                <td className="px-4 py-3 text-slate-900">Total</td>
                <td className="px-4 py-3 text-slate-900">
                  {callsWeek + waWeek + formsWeek}
                </td>
                <td className="px-4 py-3 text-slate-900">
                  {callsMonth + waMonth + formsMonth}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Call and WhatsApp counts reflect button taps, not completed calls.
        </p>
      </div>
    </div>
  );
}

function ConversionRow({
  label,
  week,
  month,
}: {
  label: string;
  week: number;
  month: number;
}) {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-4 py-3 text-slate-700">{label}</td>
      <td className="px-4 py-3 text-slate-900">{week}</td>
      <td className="px-4 py-3 text-slate-900">{month}</td>
    </tr>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
