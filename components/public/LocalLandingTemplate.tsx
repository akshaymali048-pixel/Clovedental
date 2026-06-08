import Link from "next/link";
import { Suspense } from "react";

import { AppointmentForm } from "@/components/public/AppointmentForm";
import { ConversionCTA } from "@/components/public/ConversionCTA";
import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import {
  buildLocalPageSlug,
  getLocalPageCopy,
  type LocalPageType,
  type Neighbourhood,
} from "@/lib/local-seo";

type LocalLandingTemplateProps = {
  type: LocalPageType;
  neighbourhood: Neighbourhood;
  clinicName: string;
  phone: string;
  address: string;
};

function AppointmentFormFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
}

export function LocalLandingTemplate({
  type,
  neighbourhood,
  clinicName,
  phone,
  address,
}: LocalLandingTemplateProps) {
  const copy = getLocalPageCopy(type, neighbourhood, clinicName);
  const landingPage = `/${buildLocalPageSlug(type, neighbourhood.slug)}`;
  const defaultService = type === "dental-implants" ? "Dental Implants" : "";

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="text-sm text-slate-500">
          <Link href="/" className="hover:text-[#0d6e6e]">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800">{copy.h1}</span>
        </nav>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0d6e6e]">
            {neighbourhood.name}, Pune
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#1e3a5f] sm:text-5xl">
            {copy.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{copy.intro}</p>

          <ul className="mt-6 space-y-2">
            {copy.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-slate-700">
                <span className="text-[#0d6e6e]" aria-hidden>
                  ✓
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackedCallLink
              phone={phone}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0d6e6e] px-6 py-3 font-semibold text-white transition hover:bg-[#0a5a5a]"
            >
              Call {phone}
            </TrackedCallLink>
            <Link
              href="/#book"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e07a4f] px-6 py-3 font-semibold text-white transition hover:bg-[#cf6a42]"
            >
              Book Free Consultation
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">
            Visit us from {neighbourhood.name}
          </h2>
          <p className="mt-3 text-slate-600">{address}</p>
          <p className="mt-2 text-sm text-slate-500">
            Open Tuesday–Sunday, 10:30 AM – 7:30 PM. Closed Mondays.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">
            Request a callback
          </h2>
          <p className="mt-2 text-slate-600">
            Fill in your details and we&apos;ll call you within 2 hours.
          </p>
          <div className="mt-6 max-w-lg">
            <Suspense fallback={<AppointmentFormFallback />}>
              <AppointmentForm
                defaultService={defaultService}
                landingPage={landingPage}
              />
            </Suspense>
          </div>
        </section>

        <div className="mt-8">
          <ConversionCTA
            phone={phone}
            title={`Ready to visit ${clinicName}?`}
            subtitle={`Patients from ${neighbourhood.name} and across PCMC trust us for honest advice and gentle care.`}
          />
        </div>
      </div>
    </div>
  );
}
