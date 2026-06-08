"use client";

import { useMemo, useState } from "react";

import { FAQAccordion } from "@/components/public/FAQAccordion";
import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import {
  faqCategories,
  faqs,
  type FAQCategory,
} from "@/lib/faq";

type FAQPageContentProps = {
  phone: string;
};

export function FAQPageContent({ phone }: FAQPageContentProps) {
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "All">("All");

  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All") {
      return faqs;
    }
    return faqs.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-[#fafaf8] py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-[#1e3a5f] sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-slate-600">
            Answers about visiting our clinic, costs, treatments, and emergencies.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {faqCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-[#0d6e6e] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#0d6e6e]/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <FAQAccordion items={filteredFaqs} defaultOpenIndex={null} showHeader={false} />
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#0d6e6e] p-8 text-center text-white">
          <h2 className="font-serif text-2xl font-bold">Still have questions? Call us.</h2>
          <p className="mt-2 text-slate-200">
            Our team is happy to walk you through anything not covered here.
          </p>
          <TrackedCallLink
            phone={phone}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e07a4f] px-8 py-3 font-semibold text-white transition hover:bg-[#cf6a42]"
          >
            Call {phone}
          </TrackedCallLink>
        </div>
      </div>
    </div>
  );
}
