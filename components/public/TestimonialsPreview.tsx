import Link from "next/link";
import type { Testimonial } from "@prisma/client";

import { TestimonialsGrid } from "@/components/public/TestimonialsGrid";

type TestimonialsPreviewProps = {
  testimonials: Testimonial[];
};

export function TestimonialsPreview({ testimonials }: TestimonialsPreviewProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#fafaf8] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
            What Our Patients Say
          </h2>
          <p className="mt-3 text-slate-600">Real patients, real results</p>
        </div>

        <div className="mt-10">
          <TestimonialsGrid testimonials={testimonials} featured large />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/testimonials"
            className="inline-flex min-h-11 items-center font-semibold text-[#0d6e6e] hover:underline"
          >
            Read all reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}
