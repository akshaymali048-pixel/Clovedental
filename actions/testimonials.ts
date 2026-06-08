"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export type AddTestimonialState = {
  success: boolean;
  error?: string;
};

export async function approveTestimonial(id: string): Promise<void> {
  await requireAuth();

  await prisma.testimonial.update({
    where: { id },
    data: { approved: true },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function hideTestimonial(id: string): Promise<void> {
  await requireAuth();

  await prisma.testimonial.update({
    where: { id },
    data: { approved: false },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function toggleFeatured(id: string, featured: boolean): Promise<void> {
  await requireAuth();

  await prisma.testimonial.update({
    where: { id },
    data: { featured },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string): Promise<void> {
  await requireAuth();

  await prisma.testimonial.delete({
    where: { id },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function addTestimonial(
  _prevState: AddTestimonialState,
  formData: FormData,
): Promise<AddTestimonialState> {
  await requireAuth();

  const patientName = formData.get("patientName")?.toString().trim() ?? "";
  const treatment = formData.get("treatment")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString().trim() ?? "";
  const rating = Number(formData.get("rating") ?? "5");
  const featured = formData.get("featured") === "on";

  if (patientName.length < 2) {
    return { success: false, error: "Patient name must be at least 2 characters" };
  }

  if (content.length < 10) {
    return { success: false, error: "Review must be at least 10 characters" };
  }

  if (content.length > 500) {
    return { success: false, error: "Review must be 500 characters or fewer" };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" };
  }

  await prisma.testimonial.create({
    data: {
      patientName,
      treatment: treatment || null,
      content,
      rating,
      approved: true,
      featured,
    },
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");

  return { success: true };
}
