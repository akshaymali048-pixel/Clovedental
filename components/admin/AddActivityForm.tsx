"use client";

import { useActionState, useEffect, useRef } from "react";

import { addLeadActivity, type AddActivityState } from "@/actions/leads";
import { Button } from "@/components/ui/Button";

type AddActivityFormProps = {
  leadId: string;
};

const initialState: AddActivityState = {
  success: false,
};

export function AddActivityForm({ leadId }: AddActivityFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const boundAction = addLeadActivity.bind(null, leadId);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-800">Add Note</h3>

      <form ref={formRef} action={formAction} className="mt-4 flex flex-col gap-3">
        <textarea
          name="action"
          rows={3}
          required
          minLength={3}
          maxLength={500}
          placeholder="e.g. Called — no answer. Will try again tomorrow at 11am."
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0d6e6e] focus:ring-2 focus:ring-[#0d6e6e]/20"
        />

        {state.error ? (
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="text-sm text-green-700">Note added ✓</p>
        ) : null}

        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Adding..." : "Add Note"}
        </Button>
      </form>
    </div>
  );
}
