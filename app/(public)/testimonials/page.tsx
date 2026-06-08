import type { Metadata } from "next";

import { ConversionCTA } from "@/components/public/ConversionCTA";
import { TestimonialsGrid } from "@/components/public/TestimonialsGrid";
import { getClinicSettings } from "@/lib/clinic-settings";
import { pageMetadata } from "@/lib/seo";
import { getApprovedTestimonials } from "@/lib/testimonials";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getClinicSettings();

  return pageMetadata({
    title: `Patient Testimonials | ${settings.clinicName} Pimpri`,
    description: `Read what our patients say about their experience at ${settings.clinicName}, Pimpri.`,
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const settings = await getClinicSettings();

  const testimonials = await getApprovedTestimonials();

  const featured = testimonials.filter((item) => item.featured);
  const regular = testimonials.filter((item) => !item.featured);

  const reviewJsonLd = testimonials.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Dentist",
      name: settings.clinicName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: item.rating,
      bestRating: 5,
    },
    author: {
      "@type": "Person",
      name: item.patientName,
    },
    reviewBody: item.content,
  }));

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      {reviewJsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-[#1e3a5f] sm:text-5xl">
            What Our Patients Say
          </h1>
          <p className="mt-3 text-slate-600">Real patients, real results</p>
        </div>

        {featured.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">Featured Reviews</h2>
            <div className="mt-6">
              <TestimonialsGrid testimonials={featured} large />
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">All Reviews</h2>
          <div className="mt-6">
            {testimonials.length > 0 ? (
              <TestimonialsGrid testimonials={regular.length > 0 ? regular : testimonials} />
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
                Reviews coming soon.
              </p>
            )}
          </div>
        </section>

        <div className="mt-12">
          <ConversionCTA
            phone={settings.phone}
            title="Ready for your own transformation?"
            subtitle="Book a free consultation — we'll call you within 2 hours."
          />
        </div>
      </div>
    </div>
  );
}
