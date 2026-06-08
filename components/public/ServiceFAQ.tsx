"use client";

import { useState } from "react";

import type { ServiceFAQ as ServiceFAQItem } from "@/lib/services";

type ServiceFAQProps = {
  items: ServiceFAQItem[];
};

export function ServiceFAQ({ items }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full min-h-11 items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[#1a1a2e] transition hover:bg-slate-50"
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
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
                <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
