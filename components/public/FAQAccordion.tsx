"use client";

import { useState } from "react";

import type { FAQItem } from "@/lib/faq";

type FAQAccordionProps = {
  items: FAQItem[];
  defaultOpenIndex?: number | null;
  showHeader?: boolean;
};

export function FAQAccordion({
  items,
  defaultOpenIndex = 0,
  showHeader = true,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <section className={showHeader ? "bg-white py-16 sm:py-20" : ""}>
      <div className={showHeader ? "mx-auto max-w-3xl px-4 sm:px-6" : ""}>
        {showHeader ? (
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-600">
              Everything you need to know before your visit.
            </p>
          </div>
        ) : null}

        <div
          className={`divide-y divide-slate-200 rounded-xl border border-slate-200 ${showHeader ? "mt-10" : ""}`}
        >
          {items.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full min-h-11 items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#1a1a2e] transition hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`shrink-0 text-[#0d6e6e] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
