import type { Testimonial } from "@prisma/client";

import { StarRating } from "@/components/public/StarRating";

type TestimonialsGridProps = {
  testimonials: Testimonial[];
  featured?: boolean;
  large?: boolean;
};

export function TestimonialsGrid({
  testimonials,
  featured = false,
  large = false,
}: TestimonialsGridProps) {
  const items = featured
    ? testimonials.filter((item) => item.featured)
    : testimonials;

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 ${large ? "md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}
    >
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-xl border border-slate-200 bg-white p-5 ${
            large && item.featured ? "md:col-span-1 lg:p-6" : ""
          }`}
        >
          <StarRating rating={item.rating} />
          <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
            &ldquo;{item.content}&rdquo;
          </blockquote>
          <footer className="mt-4 border-t border-slate-100 pt-3">
            <p className="font-semibold text-[#1a1a2e]">{item.patientName}</p>
            {item.treatment ? (
              <p className="text-xs text-slate-500">{item.treatment}</p>
            ) : null}
          </footer>
        </article>
      ))}
    </div>
  );
}
