import Link from "next/link";
import type { LeadStatus } from "@prisma/client";

import { LeadListTable } from "@/components/admin/LeadListTable";
import { prisma } from "@/lib/db";
import { ALL_LEAD_STATUSES, STATUS_CONFIG, isLeadStatus } from "@/lib/lead-status";
import { requireAuth } from "@/lib/session";

type LeadsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

const filterOptions: Array<{ label: string; value?: LeadStatus }> = [
  { label: "All" },
  ...ALL_LEAD_STATUSES.map((status) => ({
    label: STATUS_CONFIG[status].label,
    value: status,
  })),
];

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  await requireAuth();

  const params = await searchParams;
  const statusFilter = params.status && isLeadStatus(params.status) ? params.status : undefined;

  // Pagination deferred to Slice 4. Limit 50 for now.
  const leads = await prisma.lead.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      phone: true,
      service: true,
      status: true,
      createdAt: true,
      utmSource: true,
      utmMedium: true,
      _count: { select: { activities: true } },
    },
  });

  const totalLeads = await prisma.lead.count();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="mt-1 text-sm text-slate-600">
          Scan new enquiries, tap to call, and update status quickly.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive =
            option.value === undefined
              ? !statusFilter
              : statusFilter === option.value;

          const href =
            option.value === undefined
              ? "/admin/leads"
              : `/admin/leads?status=${option.value}`;

          return (
            <Link
              key={option.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-slate-600">
            {totalLeads === 0
              ? "No leads yet. Share your website to start receiving enquiries."
              : "No leads found."}
          </p>
        </div>
      ) : (
        <LeadListTable leads={leads} />
      )}
    </div>
  );
}
