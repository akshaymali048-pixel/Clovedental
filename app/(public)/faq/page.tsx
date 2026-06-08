import type { Metadata } from "next";

import { FAQPageContent } from "@/components/public/FAQPageContent";
import { getClinicSettings } from "@/lib/clinic-settings";
import { faqs } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClinicSettings();

  return pageMetadata({
    title: `FAQ | ${settings.clinicName}, Pimpri`,
    description:
      "Answers to common questions about dental treatments, costs, and visiting our clinic in Pimpri, Pune.",
    path: "/faq",
  });
}

export default async function FAQPage() {
  const settings = await getClinicSettings();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQPageContent phone={settings.phone} />
    </>
  );
}
