import { Suspense } from "react";
import type { Metadata } from "next";

import { AppointmentForm } from "@/components/public/AppointmentForm";
import { DoctorTeaser } from "@/components/public/DoctorTeaser";
import { FAQAccordion } from "@/components/public/FAQAccordion";
import { HeroSection } from "@/components/public/HeroSection";
import { ServicesGrid } from "@/components/public/ServicesGrid";
import { TestimonialsPreview } from "@/components/public/TestimonialsPreview";
import { TrustBar } from "@/components/public/TrustBar";
import { getClinicSettings } from "@/lib/clinic-settings";
import { homepageFaqs } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { getFeaturedTestimonials } from "@/lib/testimonials";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClinicSettings();

  return pageMetadata({
    title: `Best Dental Clinic in Pimpri, Pune | ${settings.clinicName}`,
    description:
      "Expert dental care in Pimpri, Pune. Book a free consultation for implants, braces, root canal, teeth whitening, and more.",
    path: "/",
  });
}

function AppointmentFormFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-11 rounded-lg bg-slate-200" />
      <div className="h-11 rounded-lg bg-slate-200" />
      <div className="h-11 rounded-lg bg-slate-200" />
      <div className="h-28 rounded-lg bg-slate-200" />
      <div className="h-11 rounded-lg bg-slate-200" />
    </div>
  );
}

export default async function HomePage() {
  const settings = await getClinicSettings();

  const featuredTestimonials = await getFeaturedTestimonials(3);

  const businessJsonLd = {
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:30",
        closes: "19:30",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "300000",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homepageFaqs.map((item) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <HeroSection phone={settings.phone} />
      <TrustBar />
      <ServicesGrid />
      <DoctorTeaser />
      <TestimonialsPreview testimonials={featuredTestimonials} />

      <section id="book" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
              Book Your Appointment
            </h2>
            <p className="mt-3 text-slate-600">
              Fill in your details and we&apos;ll call you within 2 hours.
            </p>
          </div>

          <div className="mt-8">
            <Suspense fallback={<AppointmentFormFallback />}>
              <AppointmentForm />
            </Suspense>
          </div>
        </div>
      </section>

      <FAQAccordion items={homepageFaqs} />
    </>
  );
}
