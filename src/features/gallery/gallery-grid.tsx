'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
export interface Photo {
    id: number;
    src: string;
    alt: string;
    base64?: string;
  }
  
interface GalleryGridProps {
    photos: Photo[];
    onOpenLightbox: (index: number) => void;
}

export default function GalleryGrid({ photos, onOpenLightbox }: GalleryGridProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Touch event states for swipe functionality
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Items per page - 4 on desktop (2x2), 1 on mobile
    const itemsPerPage = isMobile ? 1 : 4;
    const totalPages = Math.ceil(photos.length / itemsPerPage);

    // Check if we're on mobile on component mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Initial check
        checkMobile();

        // Add event listener
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null); // Reset touch end on new touch start
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isSwipeLeft = distance > minSwipeDistance;
        const isSwipeRight = distance < -minSwipeDistance;

        if (isSwipeLeft) {
            nextPage();
        } else if (isSwipeRight) {
            prevPage();
        }

        // Reset touch states
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Navigate to previous page with infinite loop
    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Navigate to next page with infinite loop
    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    // Get current photos to display
    const getCurrentPhotos = () => {
        // Create an array to simulate infinite scrolling
        const extendedPhotos = [...photos, ...photos, ...photos]; // Repeat photos 3 times
        const startIdx = currentPage * itemsPerPage;
        const offset = photos.length; // Use this to center our visible window in the extended array

        return extendedPhotos.slice(offset + startIdx, offset + startIdx + itemsPerPage);
    };

    return (
        <div
            className="relative w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="grid grid-cols-2 gap-4 mx-auto max-w-5xl transition-all duration-500 ease-in-out"
                style={{
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                }}
            >
                {getCurrentPhotos().map((photo, index) => {
                    const globalIndex = (currentPage * itemsPerPage + index) % photos.length;
                    return (
                        <div
                            key={`${photo.id}-${index}`}
                            className="aspect-[4/3] cursor-pointer p-2"
                            onClick={() => onOpenLightbox(globalIndex)}
                            role="button"
                            aria-label={`Open lightbox for ${photo.alt}`}
                        >
                            <Image
                                placeholder="blur"
                                blurDataURL={photo.base64} // Provide the base64-encoded low-res image
                                src={photo.src}
                                alt={photo.alt}
                                width={500}
                                height={375}
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10 hover:bg-black/70 transition-colors"
                onClick={prevPage}
                aria-label="Previous page"
            >
                <ArrowLeft size={24} />
            </button>
            <button
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10 hover:bg-black/70 transition-colors"
                onClick={nextPage}
                aria-label="Next page"
            >
                <ArrowRight size={24} />
            </button>
        </div>
    );
} 