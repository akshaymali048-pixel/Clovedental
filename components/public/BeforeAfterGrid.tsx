"use client";

import { useState } from "react";

import { GalleryImage } from "@/components/public/GalleryImage";
import {
  galleryFilters,
  galleryItems,
  matchesGalleryFilter,
  type GalleryFilter,
} from "@/lib/gallery";

export function BeforeAfterGrid() {
  const [filter, setFilter] = useState<GalleryFilter>("All");

  const filtered = galleryItems.filter((item) => matchesGalleryFilter(item, filter));
  const beforeAfter = filtered.filter((item) => item.type === "before_after");
  const clinicPhotos = filtered.filter((item) => item.type === "clinic");

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-2">
        {galleryFilters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filter === option
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {beforeAfter.length > 0 ? (
        <section>
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">Before & After</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {beforeAfter.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg bg-slate-100">
                  <div className="relative aspect-[5/4] border-r border-white">
                    <GalleryImage
                      src={item.beforeUrl ?? ""}
                      alt=""
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <span className="absolute left-2 top-2 z-10 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-[5/4]">
                    <GalleryImage
                      src={item.afterUrl ?? ""}
                      alt=""
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <span className="absolute left-2 top-2 z-10 rounded bg-[#0d6e6e] px-2 py-0.5 text-xs font-semibold text-white">
                      After
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-700">{item.caption}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {clinicPhotos.length > 0 ? (
        <section>
          <h2 className="font-serif text-2xl font-bold text-[#1e3a5f]">Our Clinic</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clinicPhotos.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="relative aspect-[3/2] bg-slate-100">
                  <GalleryImage
                    src={item.imageUrl ?? ""}
                    alt={item.caption}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="p-3 text-sm text-slate-600">{item.caption}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
