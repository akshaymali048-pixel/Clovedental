export type Neighbourhood = {
  slug: string;
  name: string;
  proximity: string;
};

export const neighbourhoods: Neighbourhood[] = [
  {
    slug: "pimpri",
    name: "Pimpri",
    proximity: "in the heart of Pimpri, minutes from Mumbai Pune Road",
  },
  {
    slug: "chinchwad",
    name: "Chinchwad",
    proximity: "a short drive from Chinchwad and Pimpri Colony",
  },
  {
    slug: "ravet",
    name: "Ravet",
    proximity: "easily reachable from Ravet and the PCMC belt",
  },
  {
    slug: "akurdi",
    name: "Akurdi",
    proximity: "convenient for patients coming from Akurdi and Nigdi",
  },
  {
    slug: "punawale",
    name: "Punawale",
    proximity: "well connected from Punawale and the western PCMC corridor",
  },
  {
    slug: "wakad",
    name: "Wakad",
    proximity: "accessible from Wakad, Baner Road, and the Hinjewadi commute",
  },
  {
    slug: "hinjewadi",
    name: "Hinjewadi",
    proximity: "ideal for professionals travelling from Hinjewadi IT Park",
  },
  {
    slug: "nigdi",
    name: "Nigdi",
    proximity: "close to Nigdi, Akurdi, and Pradhikaran",
  },
];

export type LocalPageType = "dental-implants" | "dentist";

export function buildLocalPageSlug(
  type: LocalPageType,
  neighbourhoodSlug: string,
): string {
  return `${type}-${neighbourhoodSlug}`;
}

export function parseLocalPageSlug(
  slug: string,
): { type: LocalPageType; neighbourhood: Neighbourhood } | null {
  for (const type of ["dental-implants", "dentist"] as const) {
    const prefix = `${type}-`;
    if (!slug.startsWith(prefix)) continue;

    const neighbourhoodSlug = slug.slice(prefix.length);
    const neighbourhood = neighbourhoods.find((n) => n.slug === neighbourhoodSlug);
    if (neighbourhood) {
      return { type, neighbourhood };
    }
  }

  return null;
}

export function getAllLocalPageSlugs(): string[] {
  return neighbourhoods.flatMap((n) => [
    buildLocalPageSlug("dental-implants", n.slug),
    buildLocalPageSlug("dentist", n.slug),
  ]);
}

export function getLocalPageCopy(
  type: LocalPageType,
  neighbourhood: Neighbourhood,
  clinicName: string,
): {
  h1: string;
  intro: string;
  bullets: string[];
  metaTitle: string;
  metaDescription: string;
} {
  if (type === "dental-implants") {
    return {
      h1: `Dental Implants in ${neighbourhood.name}, Pune`,
      intro: `Looking for dental implants near ${neighbourhood.name}? ${clinicName} is ${neighbourhood.proximity}. We offer implant consultations, transparent pricing, and treatment plans tailored to your bone health and smile goals.`,
      bullets: [
        "Free first consultation — no obligation",
        "Single-tooth and full-arch implant options",
        "Digital planning and experienced implant care",
        "Flexible payment plans available",
      ],
      metaTitle: `Dental Implants in ${neighbourhood.name}, Pune | ${clinicName}`,
      metaDescription: `Expert dental implant treatment near ${neighbourhood.name}, Pune. Free consultation at ${clinicName}. Call or book online today.`,
    };
  }

  return {
    h1: `Dentist in ${neighbourhood.name}, Pune`,
    intro: `Need a trusted dentist near ${neighbourhood.name}? ${clinicName} is ${neighbourhood.proximity}. From routine check-ups to braces, root canals, and smile makeovers — we care for families across PCMC.`,
    bullets: [
      "Free consultation for new patients",
      "Gentle care for adults and children",
      "Evening appointments Tuesday–Sunday",
      "Transparent costs before treatment begins",
    ],
    metaTitle: `Dentist in ${neighbourhood.name}, Pune | ${clinicName}`,
    metaDescription: `Visit ${clinicName} — a trusted dentist near ${neighbourhood.name}, Pune. Book a free consultation for implants, braces, cleaning, and more.`,
  };
}
