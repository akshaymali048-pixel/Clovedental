"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  submitAppointment,
  type AppointmentFormState,
} from "@/actions/leads";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const initialState: AppointmentFormState = {
  success: false,
  message: "",
};

const serviceOptions = [
  "Dental Implants",
  "Braces / Aligners",
  "Root Canal",
  "Teeth Whitening",
  "Smile Makeover",
  "Kids Dentistry",
  "Dentures",
  "Cleaning / Check-up",
  "Other",
];

type AppointmentFormProps = {
  defaultService?: string;
  landingPage?: string;
};

export function AppointmentForm({
  defaultService = "",
  landingPage = "/",
}: AppointmentFormProps) {
  const searchParams = useSearchParams();
  const [formLoadedAt] = useState(() => String(Date.now()));
  const [state, formAction, isPending] = useActionState(
    submitAppointment,
    initialState,
  );

  const utmSource = searchParams.get("utm_source") ?? "";
  const utmMedium = searchParams.get("utm_medium") ?? "";
  const utmCampaign = searchParams.get("utm_campaign") ?? "";

  if (state.success && state.message) {
    return (
      <div
        role="status"
        className="rounded-xl border border-green-200 bg-green-50 px-6 py-8 text-center"
      >
        <p className="text-lg font-semibold text-green-800">✓ Request Received</p>
        <p className="mt-2 text-green-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="formLoadedAt" value={formLoadedAt} readOnly />
      <input type="hidden" name="utmSource" value={utmSource} readOnly />
      <input type="hidden" name="utmMedium" value={utmMedium} readOnly />
      <input type="hidden" name="utmCampaign" value={utmCampaign} readOnly />
      <input type="hidden" name="landingPage" value={landingPage} readOnly />

      <div
        style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <label htmlFor="website">Leave blank</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        label="Full Name *"
        name="name"
        placeholder="Your full name"
        required
        error={state.errors?.name}
      />

      <Field
        label="Mobile Number *"
        name="phone"
        type="tel"
        inputMode="numeric"
        placeholder="10-digit mobile number"
        required
        maxLength={10}
        error={state.errors?.phone}
      />

      <Field
        label="Email (optional)"
        name="email"
        type="email"
        placeholder="you@example.com"
        error={state.errors?.email}
      />

      <Field
        as="select"
        label="Service"
        name="service"
        defaultValue={defaultService}
        error={state.errors?.service}
      >
        <option value="">Select a service</option>
        {serviceOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Field>

      <Field
        label="Preferred Time"
        name="preferredTime"
        placeholder="e.g. Weekday mornings"
        error={state.errors?.preferredTime}
      />

      <Field
        as="textarea"
        label="Message (optional)"
        name="message"
        placeholder="Tell us about your concern..."
        maxLength={500}
        error={state.errors?.message}
      />

      {state.message && !state.success ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" variant="primary" fullWidth disabled={isPending}>
        {isPending ? "Sending..." : "Book Free Consultation"}
      </Button>
    </form>
  );
}
