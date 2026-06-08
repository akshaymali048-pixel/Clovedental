import type { Metadata } from "next";

import { BeforeAfterGrid } from "@/components/public/BeforeAfterGrid";
import { ConversionCTA } from "@/components/public/ConversionCTA";
import { getClinicSettings } from "@/lib/clinic-settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClinicSettings();

  return pageMetadata({
    title: `Gallery — Dental Results | ${settings.clinicName}`,
    description:
      "Before and after photos from our dental treatments and a look inside our Pimpri clinic.",
    path: "/gallery",
  });
}

export default async function GalleryPage() {
  const settings = await getClinicSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.clinicName,
    telephone: settings.phone,
    address: settings.address,
  };

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-[#1e3a5f] sm:text-5xl">Our Work</h1>
          <p className="mt-3 text-slate-600">
            Real transformations and a look inside our clinic.
          </p>
        </div>

        <div className="mt-10">
          <BeforeAfterGrid />
        </div>

        <div className="mt-12">
          <ConversionCTA
            phone={settings.phone}
            title="Like what you see?"
            subtitle="Book a consultation and let's discuss what's possible for your smile."
          />
        </div>
      </div>
    </div>
  );
}
