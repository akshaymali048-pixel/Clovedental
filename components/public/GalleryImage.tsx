"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImageProps = {
  src: string;
  alt: string;
  sizes: string;
};

export function GalleryImage({ src, alt, sizes }: GalleryImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
        Photo unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
