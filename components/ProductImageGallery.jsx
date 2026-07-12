"use client";

import { useState } from "react";
import Image from "next/image";

const ProductImageGallery = ({ mainImage, thumbnails = [], title }) => {
  const images = [mainImage, ...thumbnails.filter((t) => t !== mainImage)];
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md cursor-zoom-in bg-gray-50"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
      >
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        {isZooming && (
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: "200%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(image)}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedImage === image ? "true" : undefined}
              className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 shadow-sm transition hover:shadow-md ${
                selectedImage === image ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
