import Link from "next/link";

import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import type { ClinicTimings } from "@/lib/clinic-settings";

type SiteFooterProps = {
  clinicName: string;
  phone: string;
  address: string;
  googleMapsUrl: string | null;
  timings: ClinicTimings;
};

function formatTimings(timings: ClinicTimings): string {
  const parts: string[] = [];
  if (timings.weekdays) parts.push(`Tue–Fri: ${timings.weekdays}`);
  if (timings.saturday) parts.push(`Sat: ${timings.saturday}`);
  if (timings.sunday) parts.push(`Sun: ${timings.sunday}`);
  if (timings.closed?.length) parts.push(`Closed: ${timings.closed.join(", ")}`);
  return parts.join(" · ");
}

const footerLinks = [
  { href: "/doctor", label: "Doctor" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({
  clinicName,
  phone,
  address,
  googleMapsUrl,
  timings,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-[#1e3a5f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-serif text-xl font-bold">{clinicName}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{address}</p>
            {googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-[#f4b183] hover:underline"
              >
                Get Directions →
              </a>
            ) : null}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Explore
            </h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-[#f4b183]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </h4>
            <TrackedCallLink
              phone={phone}
              className="mt-3 block text-lg font-semibold text-white hover:text-[#f4b183]"
            >
              {phone}
            </TrackedCallLink>
            <Link
              href="/#book"
              className="mt-4 inline-block text-sm font-semibold text-[#f4b183] hover:underline"
            >
              Book Appointment
            </Link>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Working Hours
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {formatTimings(timings)}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} {clinicName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
