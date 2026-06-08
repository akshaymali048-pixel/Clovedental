"use client";

import { useActionState, useEffect, useState } from "react";
import type { LeadStatus } from "@prisma/client";

import { updateLeadStatus, type UpdateStatusState } from "@/actions/leads";
import { Button } from "@/components/ui/Button";
import { ALL_LEAD_STATUSES, STATUS_CONFIG } from "@/lib/lead-status";

type UpdateStatusFormProps = {
  leadId: string;
  currentStatus: LeadStatus;
};

const initialState: UpdateStatusState = {
  success: false,
};

export function UpdateStatusForm({ leadId, currentStatus }: UpdateStatusFormProps) {
  const boundAction = updateLeadStatus.bind(null, leadId);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSaved(true);
      const timer = window.setTimeout(() => setShowSaved(false), 2000);
      return () => window.clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-800">Update Status</h3>

      <form action={formAction} className="mt-4 flex flex-col gap-3">
        <select
          name="newStatus"
          defaultValue={currentStatus}
          className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d6e6e] focus:ring-2 focus:ring-[#0d6e6e]/20"
        >
          {ALL_LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status].label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          {showSaved ? <span className="text-sm text-green-700">✓ Saved</span> : null}
        </div>
      </form>
    </div>
  );
}
