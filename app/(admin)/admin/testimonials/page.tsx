import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import { prisma } from "@/lib/db";
import { getAllServices } from "@/lib/services";
import { requireAuth } from "@/lib/session";

export default async function AdminTestimonialsPage() {
  await requireAuth();

  const [testimonials, services] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    }),
    Promise.resolve(getAllServices()),
  ]);

  const pending = testimonials.filter((item) => !item.approved);
  const published = testimonials.filter((item) => item.approved);
  const serviceOptions = services.map((service) => service.title);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
        <p className="mt-1 text-sm text-slate-600">
          Approve, feature, and manage patient reviews shown on the website.
        </p>
      </div>

      <TestimonialsTable
        pending={pending}
        published={published}
        serviceOptions={serviceOptions}
      />
    </div>
  );
}
