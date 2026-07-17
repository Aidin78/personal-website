"use client";

import Image from "next/image";
import { useState } from "react";

type ProjectGalleryProps = {
  cover: string;
  title: string;
  gallery: string[];
  galleryLabel: string;
  emptyHint: string;
};

export function ProjectGallery({
  cover,
  title,
  gallery,
  galleryLabel,
  emptyHint,
}: ProjectGalleryProps) {
  const extras = gallery.filter((item) => item !== cover);
  const images = [cover, ...extras];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? cover;
  const hasExtras = extras.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">{galleryLabel}</h2>
        {hasExtras ? (
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            {activeIndex + 1} / {images.length}
          </span>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface-solid">
        <div className="relative aspect-[16/10] sm:aspect-[16/9]">
          <Image
            key={activeImage}
            src={activeImage}
            alt={`${title} screenshot ${activeIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 70vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>

      {hasExtras ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={activeIndex === index}
              aria-label={`${title} thumbnail ${index + 1}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                activeIndex === index
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : emptyHint ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted">
          {emptyHint}
        </p>
      ) : null}
    </div>
  );
}
