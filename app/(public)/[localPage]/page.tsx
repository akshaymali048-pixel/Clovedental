import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { LocalLandingTemplate } from "@/components/public/LocalLandingTemplate";
import { getClinicSettings } from "@/lib/clinic-settings";
import {
  getAllLocalPageSlugs,
  getLocalPageCopy,
  parseLocalPageSlug,
} from "@/lib/local-seo";
import { pageMetadata } from "@/lib/seo";

type LocalPageProps = {
  params: Promise<{ localPage: string }>;
};

export async function generateStaticParams() {
  return getAllLocalPageSlugs().map((localPage) => ({ localPage }));
}

export async function generateMetadata({ params }: LocalPageProps): Promise<Metadata> {
  const { localPage } = await params;
  const parsed = parseLocalPageSlug(localPage);

  if (!parsed) {
    return { title: "Page Not Found" };
  }

  const settings = await getClinicSettings();
  const copy = getLocalPageCopy(parsed.type, parsed.neighbourhood, settings.clinicName);

  return pageMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: `/${localPage}`,
  });
}

export default async function LocalLandingPage({ params }: LocalPageProps) {
  const { localPage } = await params;
  const parsed = parseLocalPageSlug(localPage);

  if (!parsed) {
    notFound();
  }

  const settings = await getClinicSettings();
  const { type, neighbourhood } = parsed;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness"],
    name: settings.clinicName,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: neighbourhood.name,
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: `${neighbourhood.name}, Pune`,
    },
  };

  const procedureJsonLd =
    type === "dental-implants"
      ? {
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: `Dental Implants in ${neighbourhood.name}`,
          description: `Dental implant treatment for patients in ${neighbourhood.name}, Pune`,
          procedureType: "Dental",
          provider: {
            "@type": "Dentist",
            name: settings.clinicName,
            telephone: settings.phone,
          },
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      {procedureJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
        />
      ) : null}
      <LocalLandingTemplate
        type={type}
        neighbourhood={neighbourhood}
        clinicName={settings.clinicName}
        phone={settings.phone}
        address={settings.address}
      />
    </>
  );
}
