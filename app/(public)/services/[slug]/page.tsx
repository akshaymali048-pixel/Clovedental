import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

import { AppointmentForm } from "@/components/public/AppointmentForm";
import { ConversionCTA } from "@/components/public/ConversionCTA";
import { ServiceFAQ } from "@/components/public/ServiceFAQ";
import { compileMDXContent } from "@/lib/mdx";
import { getClinicSettings } from "@/lib/clinic-settings";
import { pageMetadata, siteUrl } from "@/lib/seo";
import {
  getAllServiceSlugs,
  getServiceBySlug,
} from "@/lib/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${slug}`,
  });
}

function AppointmentFormFallback() {
  return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const settings = await getClinicSettings();
  const MDXContent = await compileMDXContent(service.content);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: siteUrl(`/services/${slug}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
      },
    ],
  };

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.shortDescription,
    procedureType: "Dental",
  };

  const faqJsonLd =
    service.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="text-sm text-slate-500">
          <Link href="/" className="hover:text-[#0d6e6e]">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span>Services</span>
          <span className="mx-2">›</span>
          <span className="text-slate-800">{service.title}</span>
        </nav>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <span className="text-4xl" aria-hidden>
            {service.icon}
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#1e3a5f]">
            {service.title}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{service.shortDescription}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <MDXContent />
        </section>

        {service.steps.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">What to expect</h2>
            <ol className="mt-6 space-y-4">
              {service.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0d6e6e] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {service.faq.length > 0 ? (
          <section className="mt-8">
            <h2 className="mb-4 font-serif text-2xl font-bold text-[#1e3a5f]">
              Frequently Asked Questions
            </h2>
            <ServiceFAQ items={service.faq} />
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">
            Interested in {service.title}?
          </h2>
          <p className="mt-2 text-slate-600">
            Book a free consultation and we&apos;ll call you within 2 hours.
          </p>
          <div className="mt-6">
            <Suspense fallback={<AppointmentFormFallback />}>
              <AppointmentForm
                defaultService={service.formServiceValue}
                landingPage={`/services/${slug}`}
              />
            </Suspense>
          </div>
        </section>

        <div className="mt-8">
          <ConversionCTA
            phone={settings.phone}
            title={`Ready to start your ${service.title} journey?`}
            bookHref="/#book"
          />
        </div>
      </div>
    </div>
  );
}
