import fs from "fs";
import path from "path";

import matter from "gray-matter";

export type ServiceFAQ = {
  q: string;
  a: string;
};

export type ServiceMeta = {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  faq: ServiceFAQ[];
  steps: string[];
  formServiceValue: string;
};

export type ServiceContent = ServiceMeta & {
  content: string;
};

const SERVICES_DIR = path.join(process.cwd(), "content/services");

export const SERVICE_FORM_VALUES: Record<string, string> = {
  "dental-implants": "Dental Implants",
  "braces-aligners": "Braces / Aligners",
  "root-canal": "Root Canal",
  "teeth-whitening": "Teeth Whitening",
  "smile-makeover": "Smile Makeover",
  "kids-dentistry": "Kids Dentistry",
  dentures: "Dentures",
  "cleaning-checkup": "Cleaning / Check-up",
};

function parseServiceFile(fileName: string): ServiceContent {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(SERVICES_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug: data.slug ?? slug,
    title: data.title ?? "",
    shortDescription: data.shortDescription ?? "",
    icon: data.icon ?? "🦷",
    metaTitle: data.metaTitle ?? data.title ?? "",
    metaDescription: data.metaDescription ?? data.shortDescription ?? "",
    faq: Array.isArray(data.faq) ? data.faq : [],
    steps: Array.isArray(data.steps) ? data.steps : [],
    formServiceValue: SERVICE_FORM_VALUES[slug] ?? data.title ?? "",
    content,
  };
}

export function getAllServices(): ServiceMeta[] {
  if (!fs.existsSync(SERVICES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SERVICES_DIR).filter((file) => file.endsWith(".mdx"));

  return files.map((file) => {
    const service = parseServiceFile(file);
    return {
      slug: service.slug,
      title: service.title,
      shortDescription: service.shortDescription,
      icon: service.icon,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      faq: service.faq,
      steps: service.steps,
      formServiceValue: service.formServiceValue,
    };
  });
}

export function getAllServiceSlugs(): string[] {
  return getAllServices().map((service) => service.slug);
}

export function getServiceBySlug(slug: string): ServiceContent | null {
  const filePath = path.join(SERVICES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parseServiceFile(`${slug}.mdx`);
}
