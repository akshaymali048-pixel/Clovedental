import Image from "next/image";
import Link from "next/link";

import { TrackedCallLink } from "@/components/public/TrackedCallLink";
import { doctor } from "@/lib/doctor";

type DoctorProfileProps = {
  phone: string;
};

export function DoctorProfile({ phone }: DoctorProfileProps) {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-2xl">
          <Image
            src={doctor.photoUrl}
            alt={`Portrait of ${doctor.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 400px"
            priority
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0d6e6e]">
            Meet Your Dentist
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#1e3a5f]">{doctor.name}</h1>
          <p className="mt-2 text-lg text-slate-600">{doctor.title}</p>
          <p className="mt-4 text-slate-700">
            {doctor.primaryDegree} · {doctor.college} ({doctor.graduationYear})
          </p>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Credential label="Degree" value={doctor.primaryDegree} />
        <Credential label="College" value={doctor.college} />
        <Credential label="Year" value={doctor.graduationYear} />
        <Credential label="Registration" value={doctor.registrationNumber} />
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">Specialisations</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {doctor.specialisations.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Experience" value={`${doctor.yearsExperience}+ years`} />
        <StatCard label="Patients Treated" value={doctor.patientsTreated} />
        <StatCard label="Procedures" value={doctor.proceduresDone} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-[#fafaf8] p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">A note from {doctor.name}</h2>
        <div className="mt-4 space-y-4 text-slate-700 leading-relaxed">
          {doctor.philosophy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">Education</h2>
        <ol className="mt-4 space-y-4 border-l-2 border-[#0d6e6e]/30 pl-6">
          {doctor.education.map((entry) => (
            <li key={`${entry.degree}-${entry.year}`}>
              <p className="font-semibold text-[#1a1a2e]">{entry.degree}</p>
              <p className="text-sm text-slate-600">
                {entry.institution} · {entry.year}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">Professional Memberships</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {doctor.memberships.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#0d6e6e] p-8 text-center text-white">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          Book an appointment with {doctor.name}
        </h2>
        <p className="mt-3 text-slate-200">
          Take the first step toward a healthier, more confident smile.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedCallLink
            phone={phone}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20"
          >
            Call Now
          </TrackedCallLink>
          <Link
            href="/#book"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e07a4f] px-6 py-3 font-semibold transition hover:bg-[#cf6a42]"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-serif text-xl font-bold text-[#0d6e6e]">{value}</p>
    </div>
  );
}
