"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const campusImages = [
  "/images/campuses/harvard.png",
  "/images/campuses/stanford.png",
  "/images/campuses/hbs.png",
  "/images/campuses/oxford.png",
  "/images/campuses/oxford_spires.png",
  "/images/campuses/cambridge.png",
  "/images/campuses/wharton.png",
  "/images/campuses/tuck.png",
  "/images/campuses/baker.png",
  "/images/campuses/melbourne.png",
  "/images/campuses/sydney.png"
];

export default function CampusCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % campusImages.length);
        setIsTransitioning(false);
      }, 500); // Half of the fade transition time
    }, 3000);

    return () => clearInterval(interval);
  }, [nextIndex]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="aspect-[4/5] rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
        {/* Current Image */}
        <Image
          src={campusImages[currentIndex]}
          alt="Campus image"
          width={400}
          height={500}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          priority
        />
        
        {/* Next Image (preloaded) */}
        <Image
          src={campusImages[nextIndex]}
          alt="Campus image"
          width={400}
          height={500}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          priority
        />
        
        {/* Overlay with success text and rounded bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 rounded-b-xl">
          <p className="text-white text-sm font-medium">
            Our users have been accepted to Harvard Business School, GSB, and more! See how you can join them.
          </p>
        </div>
      </div>
    </div>
  );
} 