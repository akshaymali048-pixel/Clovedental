import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.clinicSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      clinicName: "Clove Dental",
      phone: "9393553232",
      whatsapp: "9393553232",
      address:
        "240/1, Shop No 112, 113, 114, 115, 116, 117, Laxmi Complex, Near Big Bazar, Mumbai Pune Road, Pimpri Colony, Pimpri Chinchwad, Pune",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Clove+Dental+Pimpri+Pune",
      timings: {
        weekdays: "10:30 AM – 07:30 PM",
        saturday: "10:30 AM – 07:30 PM",
        sunday: "10:30 AM – 07:30 PM",
        closed: ["Monday"],
      },
      emailAlert: "leads@smilecare.in",
    },
  });

  const email = (process.env.ADMIN_EMAIL ?? "admin@smilecare.in").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = "Clinic Admin";

  const passwordHash = await hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name },
  });

  const testimonials = [
    {
      patientName: "Hrishikesh Mehetre",
      treatment: "Dental Fillings & Cleaning",
      content:
        "Had a great experience at Clove Dental, Chinchwad branch. Went for two fillings and teeth cleaning, and Dr. Megha did an excellent job.",
      rating: 5,
    },
    {
      patientName: "Umesh Patil",
      treatment: "Kids Dentistry",
      content:
        "Very friendly, caring and knowledgeable doctor. I visited for my son Umang's dental consultation and felt completely at ease.",
      rating: 5,
    },
    {
      patientName: "Angel Velip",
      treatment: "General Dentistry",
      content:
        "The staff is friendly and professional and they made me feel completely comfortable. Thank you Dr. Megha and staff.",
      rating: 5,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { patientName: testimonial.patientName, content: testimonial.content },
    });

    if (!existing) {
      await prisma.testimonial.create({
        data: {
          ...testimonial,
          approved: true,
          featured: true,
        },
      });
    }
  }

  console.log("✓ Seeded");
  console.log(`✓ Admin user seeded: ${email}`);
  console.log("  ⚠ Change ADMIN_PASSWORD in .env before production deploy");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
