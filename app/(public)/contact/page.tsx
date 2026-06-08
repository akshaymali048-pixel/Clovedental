import type { Metadata } from "next";
import { Suspense } from "react";

import { AppointmentForm } from "@/components/public/AppointmentForm";
import { CopyAddressButton } from "@/components/public/CopyAddressButton";
import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import { TrackedWhatsAppLink } from "@/components/public/TrackedWhatsAppLink";
import { getClinicSettings } from "@/lib/clinic-settings";
import { pageMetadata } from "@/lib/seo";
import { buildWeeklySchedule, getMapsEmbedUrl } from "@/lib/timings-table";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClinicSettings();

  return pageMetadata({
    title: `Contact Us | ${settings.clinicName}, Pimpri`,
    description: `Visit ${settings.clinicName} in Pimpri, Pune. Find our address, opening hours, and contact details.`,
    path: "/contact",
  });
}

function AppointmentFormFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
}

export default async function ContactPage() {
  const settings = await getClinicSettings();
  const schedule = buildWeeklySchedule(settings.timings);
  const todayIndex = new Date().getDay();
  const mapsEmbedUrl = getMapsEmbedUrl(settings.address, settings.googleMapsUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness"],
    name: settings.clinicName,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Pimpri",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    openingHoursSpecification: schedule
      .filter((row) => !row.closed)
      .map((row) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: row.day,
        opens: "10:30",
        closes: "19:30",
      })),
    ...(settings.googleMapsUrl ? { hasMap: settings.googleMapsUrl } : {}),
  };

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-[#1e3a5f] sm:text-5xl">
            Find Us
          </h1>
          <p className="mt-3 text-slate-600">
            Visit us in Pimpri or get in touch — we are here to help.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">
                {settings.clinicName}
              </h2>
              <p className="mt-3 leading-relaxed text-slate-700">{settings.address}</p>
              <CopyAddressButton address={settings.address} />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </h3>
              <TrackedCallLink
                phone={settings.phone}
                className="mt-2 block text-2xl font-bold text-[#0d6e6e] hover:underline"
              >
                {settings.phone}
              </TrackedCallLink>
            </div>

            {settings.whatsapp ? (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  WhatsApp
                </h3>
                <TrackedWhatsAppLink
                  whatsapp={settings.whatsapp}
                  className="mt-2 inline-flex items-center gap-2 font-semibold text-[#25D366] hover:underline"
                >
                  Message us on WhatsApp →
                </TrackedWhatsAppLink>
              </div>
            ) : null}

            {settings.emailAlert ? (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </h3>
                <a
                  href={`mailto:${settings.emailAlert}`}
                  className="mt-2 block font-semibold text-[#0d6e6e] hover:underline"
                >
                  {settings.emailAlert}
                </a>
              </div>
            ) : null}

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Opening Hours
              </h3>
              <table className="mt-3 w-full text-sm">
                <tbody>
                  {schedule.map((row) => (
                    <tr
                      key={row.day}
                      className={
                        row.dayIndex === todayIndex
                          ? "bg-[#0d6e6e]/10 font-semibold"
                          : ""
                      }
                    >
                      <td className="py-2 pr-4 text-slate-700">{row.day}</td>
                      <td
                        className={`py-2 ${row.closed ? "font-semibold text-red-600" : "text-slate-600"}`}
                      >
                        {row.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <iframe
              title={`Map showing ${settings.clinicName}`}
              src={mapsEmbedUrl}
              width="100%"
              height={400}
              style={{ border: 0, borderRadius: 8 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">
            Send us a message
          </h2>
          <p className="mt-2 text-slate-600">
            Fill in the form and we will call you within 2 hours.
          </p>
          <div className="mt-6 max-w-lg">
            <Suspense fallback={<AppointmentFormFallback />}>
              <AppointmentForm landingPage="/contact" />
            </Suspense>
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#0d6e6e] p-8 text-center text-white">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Dental Emergency? Call us now.
          </h2>
          <p className="mt-3 text-slate-200">
            For urgent pain, swelling, or trauma — call immediately.
          </p>
          <TrackedCallLink
            phone={settings.phone}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#e07a4f] px-8 py-3 text-lg font-semibold transition hover:bg-[#cf6a42]"
          >
            Call {settings.phone}
          </TrackedCallLink>
        </section>
      </div>
    </div>
  );
}
