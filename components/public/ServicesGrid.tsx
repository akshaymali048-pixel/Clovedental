import { ServiceCard } from "@/components/public/ServiceCard";
import { getAllServices } from "@/lib/services";

export function ServicesGrid() {
  const services = getAllServices();

  return (
    <section className="bg-[#fafaf8] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
            Our Dental Services
          </h2>
          <p className="mt-3 text-slate-600">
            Comprehensive care for every smile, under one roof.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
