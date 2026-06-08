import type { Metadata } from "next";

import { DoctorProfile } from "@/components/public/DoctorProfile";
import { doctor } from "@/lib/doctor";
import { getClinicSettings } from "@/lib/clinic-settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClinicSettings();

  return pageMetadata({
    title: `${doctor.name} — Dentist in Pimpri, Pune | ${settings.clinicName}`,
    description: `Meet ${doctor.name}, ${doctor.primaryDegree} with ${doctor.yearsExperience}+ years of experience in Pimpri, Pune.`,
    path: "/doctor",
  });
}

export default async function DoctorPage() {
  const settings = await getClinicSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: doctor.name,
    medicalSpecialty: "Dentistry",
    image: doctor.photoUrl,
    worksFor: {
      "@type": "Dentist",
      name: settings.clinicName,
      address: settings.address,
      telephone: settings.phone,
    },
  };

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <DoctorProfile phone={settings.phone} />
      </div>
    </div>
  );
}
