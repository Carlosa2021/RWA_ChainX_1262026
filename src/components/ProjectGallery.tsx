"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface ProjectGalleryProps {
  images: string[];
  name: string;
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

/**
 * Galería principal para proyectos inmobiliarios.
 * Optimiza las imágenes usando next/image (lazy loading + responsive).
 * - Usa layout fill para la imagen destacada.
 * - Thumbnails clicables.
 * - Fallback automático si la lista está vacía.
 */
export function ProjectGallery({
  images,
  name,
  initialIndex = 0,
  onChange,
  className = "h-64"
}: ProjectGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/images/placeholder-property.jpg"];
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    // Sincroniza cambios externos de initialIndex con el estado interno
    if (initialIndex !== index) {
      setIndex(initialIndex);
    }
    // index se omite deliberadamente para evitar bucles; la sincronización es unidireccional desde prop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex]);

  const setImage = (i: number) => {
    setIndex(i);
    onChange?.(i);
  };

  const prev = () => setImage(index === 0 ? safeImages.length - 1 : index - 1);
  const next = () => setImage(index === safeImages.length - 1 ? 0 : index + 1);

  return (
    <div className={`relative bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden ${className}`}>
      {/* Imagen principal */}
      <div className="relative w-full h-full">
        <Image
          src={safeImages[index]}
          alt={`${name} - Imagen ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === 0}
          className="object-cover"
        />
      </div>

      {/* Controles */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setImage(i)}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'} transition-colors`}
              />
            ))}
          </div>
        </>
      )}

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="absolute bottom-0 right-0 flex gap-1 p-2 overflow-x-auto max-w-[70%]">
          {safeImages.slice(0, 8).map((img, i) => (
            <button
              key={img + i}
              onClick={() => setImage(i)}
              className={`relative w-12 h-12 rounded border ${i === index ? 'border-pink-500' : 'border-white/40'} overflow-hidden`}
            >
              <Image
                src={img}
                alt={`Thumb ${i + 1}`}
                fill
                sizes="48px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectGallery;