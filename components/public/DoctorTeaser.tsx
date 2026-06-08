import Image from "next/image";
import Link from "next/link";

import { doctor } from "@/lib/doctor";

export function DoctorTeaser() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl">
          <Image
            src={doctor.photoUrl}
            alt={`Portrait of ${doctor.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0d6e6e]">
            Your Dentist
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
            {doctor.name}
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            {doctor.primaryDegree} · {doctor.yearsExperience}+ years experience in Pimpri
          </p>
          <p className="mt-4 leading-relaxed text-slate-700">{doctor.philosophy[0]}</p>
          <Link
            href="/doctor"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-[#0d6e6e] hover:underline"
          >
            Meet {doctor.name} →
          </Link>
        </div>
      </div>
    </section>
  );
}
