import Link from "next/link";

type SiteHeaderProps = {
  clinicName: string;
  phone: string;
};

export function SiteHeader({ clinicName, phone }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fafaf8]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="min-w-0 shrink">
          <span className="block truncate font-serif text-base font-bold text-[#1e3a5f] sm:text-lg">
            {clinicName}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <a
            href={`tel:${phone}`}
            className="whitespace-nowrap text-sm font-semibold text-[#0d6e6e] sm:text-base"
          >
            {phone}
          </a>

          <Link
            href="#book"
            className="hidden min-h-10 items-center justify-center rounded-lg bg-[#e07a4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf6a42] md:inline-flex"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </header>
  );
}
