export type GalleryItem = {
  id: string;
  type: "before_after" | "clinic";
  treatment: string;
  beforeUrl: string | null;
  afterUrl: string | null;
  imageUrl: string | null;
  caption: string;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=500&h=400&fit=crop`;

export const galleryItems: GalleryItem[] = [
  {
    id: "ba-1",
    type: "before_after",
    treatment: "Dental Implants",
    beforeUrl: unsplash("photo-1606811856475-5e6fcdc6e509"),
    afterUrl: unsplash("photo-1609840114035-3c981b782dfe"),
    imageUrl: null,
    caption: "Sample result — single tooth implant restoration",
  },
  {
    id: "ba-2",
    type: "before_after",
    treatment: "Teeth Whitening",
    beforeUrl: unsplash("photo-1606811856475-5e6fcdc6e509"),
    afterUrl: unsplash("photo-1609840114035-3c981b782dfe"),
    imageUrl: null,
    caption: "Sample result — professional whitening treatment",
  },
  {
    id: "ba-3",
    type: "before_after",
    treatment: "Braces",
    beforeUrl: unsplash("photo-1588776814546-1ffcf47267a5"),
    afterUrl: unsplash("photo-1609207825181-52d3214556dd"),
    imageUrl: null,
    caption: "Sample result — orthodontic alignment",
  },
  {
    id: "ba-4",
    type: "before_after",
    treatment: "Smile Makeover",
    beforeUrl: unsplash("photo-1616391182219-e080b4d1043a"),
    afterUrl: unsplash("photo-1609840114035-3c981b782dfe"),
    imageUrl: null,
    caption: "Sample result — cosmetic smile enhancement",
  },
  {
    id: "clinic-1",
    type: "clinic",
    treatment: "Clinic",
    beforeUrl: null,
    afterUrl: null,
    imageUrl: unsplash("photo-1704455306251-b4634215d98f"),
    caption: "Modern treatment rooms with digital X-ray",
  },
  {
    id: "clinic-2",
    type: "clinic",
    treatment: "Clinic",
    beforeUrl: null,
    afterUrl: null,
    imageUrl: unsplash("photo-1598256989800-fe5f95da9787"),
    caption: "Comfortable waiting area for families",
  },
  {
    id: "clinic-3",
    type: "clinic",
    treatment: "Clinic",
    beforeUrl: null,
    afterUrl: null,
    imageUrl: unsplash("photo-1497366754035-f200968a6e72"),
    caption: "Sterilisation and safety protocols",
  },
];

export const galleryFilters = [
  "All",
  "Implants",
  "Braces",
  "Whitening",
  "Smile Makeover",
  "Clinic",
] as const;

export type GalleryFilter = (typeof galleryFilters)[number];

export function matchesGalleryFilter(item: GalleryItem, filter: GalleryFilter): boolean {
  if (filter === "All") return true;
  if (filter === "Clinic") return item.type === "clinic";
  if (filter === "Implants") return item.treatment.includes("Implant");
  if (filter === "Braces") return item.treatment.includes("Braces");
  if (filter === "Whitening") return item.treatment.includes("Whitening");
  if (filter === "Smile Makeover") return item.treatment.includes("Smile");
  return true;
}
