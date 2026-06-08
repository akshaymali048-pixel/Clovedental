import Link from "next/link";

import { TrackedCallLink } from "@/components/public/TrackedCallLink";

type ConversionCTAProps = {
  phone: string;
  title: string;
  subtitle?: string;
  bookHref?: string;
};

export function ConversionCTA({
  phone,
  title,
  subtitle,
  bookHref = "/#book",
}: ConversionCTAProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#0d6e6e] p-8 text-center text-white">
      <h2 className="font-serif text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-slate-200">{subtitle}</p> : null}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <TrackedCallLink
          phone={phone}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20"
        >
          Call Now
        </TrackedCallLink>
        {bookHref.startsWith("/") ? (
          <Link
            href={bookHref}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e07a4f] px-6 py-3 font-semibold transition hover:bg-[#cf6a42]"
          >
            Book Appointment
          </Link>
        ) : (
          <a
            href={bookHref}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e07a4f] px-6 py-3 font-semibold transition hover:bg-[#cf6a42]"
          >
            Book Appointment
          </a>
        )}
      </div>
    </section>
  );
}
