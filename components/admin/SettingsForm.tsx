"use client";

import { useActionState, useEffect, useState } from "react";

import {
  updateClinicSettings,
  type UpdateSettingsState,
} from "@/actions/settings";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import type { ClinicSettingsData } from "@/lib/clinic-settings";

type SettingsFormProps = {
  settings: ClinicSettingsData;
};

const initialState: UpdateSettingsState = {
  success: false,
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateClinicSettings,
    initialState,
  );
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSaved(true);
      const timer = window.setTimeout(() => setShowSaved(false), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [state.success]);

  const closedDays = settings.timings.closed?.join(", ") ?? "";

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      {state.message && !state.success ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}

      {showSaved && state.success ? (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {state.message}
        </p>
      ) : null}

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Clinic details
        </h2>
        <Field
          label="Clinic name"
          name="clinicName"
          defaultValue={settings.clinicName}
          error={state.errors?.clinicName}
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          defaultValue={settings.phone}
          error={state.errors?.phone}
          required
        />
        <Field
          label="WhatsApp number"
          name="whatsapp"
          type="tel"
          inputMode="numeric"
          defaultValue={settings.whatsapp ?? ""}
          error={state.errors?.whatsapp}
          placeholder="10-digit mobile (optional)"
        />
        <Field
          as="textarea"
          label="Address"
          name="address"
          rows={4}
          defaultValue={settings.address}
          error={state.errors?.address}
          required
        />
        <Field
          label="Google Maps URL"
          name="googleMapsUrl"
          type="url"
          defaultValue={settings.googleMapsUrl ?? ""}
          error={state.errors?.googleMapsUrl}
          placeholder="https://maps.google.com/..."
        />
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Opening hours
        </h2>
        <Field
          label="Tuesday – Friday"
          name="weekdaysHours"
          defaultValue={settings.timings.weekdays ?? ""}
          error={state.errors?.weekdaysHours}
          placeholder="10:30 AM – 07:30 PM"
          required
        />
        <Field
          label="Saturday"
          name="saturdayHours"
          defaultValue={settings.timings.saturday ?? ""}
          error={state.errors?.saturdayHours}
          required
        />
        <Field
          label="Sunday"
          name="sundayHours"
          defaultValue={settings.timings.sunday ?? ""}
          error={state.errors?.sundayHours}
          required
        />
        <Field
          label="Closed days"
          name="closedDays"
          defaultValue={closedDays}
          error={state.errors?.closedDays}
          placeholder="Monday"
        />
        <p className="text-xs text-slate-500">
          Separate multiple days with commas, e.g. Monday, Wednesday
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Lead notifications
        </h2>
        <Field
          label="Alert email"
          name="emailAlert"
          type="email"
          defaultValue={settings.emailAlert ?? ""}
          error={state.errors?.emailAlert}
          placeholder="leads@yourclinic.com"
        />
        <p className="text-xs text-slate-500">
          New appointment requests are sent to this address. Verify your domain in
          Resend before going live.
        </p>
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
