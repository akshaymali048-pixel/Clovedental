"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import type { ServiceMeta } from "@/lib/services";

type SiteNavProps = {
  clinicName: string;
  phone: string;
  services: Pick<ServiceMeta, "slug" | "title">[];
};

export function SiteNav({ clinicName, phone, services }: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const defaultServiceSlug = services[0]?.slug ?? "dental-implants";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fafaf8]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <span className="whitespace-nowrap font-serif text-base font-bold text-[#1e3a5f] sm:text-lg">
            {clinicName}
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-4 md:flex lg:gap-6">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="text-sm font-medium text-slate-700 hover:text-[#0d6e6e]"
              aria-expanded={servicesOpen}
            >
              Services ▾
            </button>
            {servicesOpen ? (
              <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <TrackedCallLink
            phone={phone}
            className="whitespace-nowrap text-sm font-semibold text-[#0d6e6e] sm:text-base"
          >
            {phone}
          </TrackedCallLink>

          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <Link
            href="/#book"
            className="hidden min-h-10 items-center justify-center rounded-lg bg-[#e07a4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf6a42] md:inline-flex"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="space-y-3">
            <Link
              href={`/services/${defaultServiceSlug}`}
              className="block text-sm font-medium text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Link>
            <NavLink href="/gallery" onClick={() => setMobileOpen(false)}>
              Gallery
            </NavLink>
            <NavLink href="/faq" onClick={() => setMobileOpen(false)}>
              FAQ
            </NavLink>
            <NavLink href="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </NavLink>
            <Link
              href="/#book"
              className="inline-flex min-h-11 items-center rounded-lg bg-[#e07a4f] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-slate-700 hover:text-[#0d6e6e]"
    >
      {children}
    </Link>
  );
}
