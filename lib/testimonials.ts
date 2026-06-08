import type { Testimonial } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    return await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getFeaturedTestimonials(limit = 3): Promise<Testimonial[]> {
  try {
    return await prisma.testimonial.findMany({
      where: { approved: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Failed to fetch featured testimonials:", error);
    return [];
  }
}
