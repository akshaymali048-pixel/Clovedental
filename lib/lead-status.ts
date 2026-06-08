import type { LeadStatus } from "@prisma/client";

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string; borderClassName: string }
> = {
  NEW: {
    label: "New",
    className: "bg-blue-100 text-blue-700",
    borderClassName: "border-blue-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700",
    borderClassName: "border-amber-300",
  },
  BOOKED: {
    label: "Booked",
    className: "bg-green-100 text-green-700",
    borderClassName: "border-green-300",
  },
  VISITED: {
    label: "Visited",
    className: "bg-teal-100 text-teal-700",
    borderClassName: "border-teal-300",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-slate-100 text-slate-600",
    borderClassName: "border-slate-300",
  },
  SPAM: {
    label: "Spam",
    className: "bg-red-100 text-red-700",
    borderClassName: "border-red-300",
  },
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: STATUS_CONFIG.NEW.label,
  IN_PROGRESS: STATUS_CONFIG.IN_PROGRESS.label,
  BOOKED: STATUS_CONFIG.BOOKED.label,
  VISITED: STATUS_CONFIG.VISITED.label,
  CLOSED: STATUS_CONFIG.CLOSED.label,
  SPAM: STATUS_CONFIG.SPAM.label,
};

export const ALL_LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "BOOKED",
  "VISITED",
  "CLOSED",
  "SPAM",
];

export function isLeadStatus(value: string): value is LeadStatus {
  return ALL_LEAD_STATUSES.includes(value as LeadStatus);
}
