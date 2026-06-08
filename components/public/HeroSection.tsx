import Link from "next/link";

import { TrackedCallLink } from "@/components/public/TrackedCallLink";

type HeroSectionProps = {
  phone: string;
};

export function HeroSection({ phone }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#0d6e6e] text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#e07a4f]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#f4b183]">
          Pimpri, Pune
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
          Your Smile. Your Confidence. Expert Care in Pimpri, Pune.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
          Gentle, expert dental care for your whole family — from routine check-ups
          to smile makeovers. Book a free consultation today.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="#book"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e07a4f] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#cf6a42]"
          >
            Book Free Consultation
          </Link>
          <TrackedCallLink
            phone={phone}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Call Now — {phone}
          </TrackedCallLink>
        </div>
      </div>
    </section>
  );
}
