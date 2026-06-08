import Link from "next/link";

import type { ServiceMeta } from "@/lib/services";

type ServiceCardProps = {
  service: Pick<ServiceMeta, "slug" | "title" | "shortDescription" | "icon">;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0d6e6e]/30 hover:shadow-md"
    >
      <span className="text-3xl" aria-hidden>
        {service.icon}
      </span>
      <h3 className="mt-3 font-semibold text-[#1a1a2e]">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {service.shortDescription}
      </p>
    </Link>
  );
}
