"use client";

import { useRouter } from "next/navigation";
import type { LeadStatus } from "@prisma/client";

import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { formatAbsoluteTime, formatRelativeTime } from "@/lib/format-date";

export type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  service: string | null;
  status: LeadStatus;
  createdAt: Date;
  utmSource: string | null;
  utmMedium: string | null;
  _count: { activities: number };
};

type LeadListTableProps = {
  leads: LeadListItem[];
};

export function LeadListTable({ leads }: LeadListTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">Treatment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Source</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => router.push(`/admin/leads/${lead.id}`)}
              className="cursor-pointer transition hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-semibold text-slate-900">{lead.name}</td>
              <td className="px-4 py-3">
                <a
                  href={`tel:${lead.phone}`}
                  onClick={(event) => event.stopPropagation()}
                  className="font-medium text-[#0d6e6e] hover:underline"
                >
                  {lead.phone}
                </a>
              </td>
              <td className="px-4 py-3 text-slate-600">{lead.service ?? "—"}</td>
              <td className="px-4 py-3">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">{lead.utmSource ?? "Direct"}</td>
              <td className="px-4 py-3 text-slate-600">
                <time
                  dateTime={lead.createdAt.toISOString()}
                  title={formatAbsoluteTime(lead.createdAt)}
                >
                  {formatRelativeTime(lead.createdAt)}
                </time>
              </td>
              <td className="px-4 py-3">
                {lead._count.activities > 0 ? (
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {lead._count.activities}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
