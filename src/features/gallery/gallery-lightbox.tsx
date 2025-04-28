'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Photo } from './types';

interface GalleryLightboxProps {
    photos: Photo[];
    selectedPhotoIndex: number | null;
    onClose: () => void;
    onNavigate: (direction: 'next' | 'prev') => void;
    touchStart: (e: React.TouchEvent) => void;
    touchMove: (e: React.TouchEvent) => void;
    touchEnd: () => void;
}

export default function GalleryLightbox({
    photos,
    selectedPhotoIndex,
    onClose,
    onNavigate,
    touchStart,
    touchMove,
    touchEnd
}: GalleryLightboxProps) {
    if (selectedPhotoIndex === null) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            onClick={onClose}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
        >
            {/* Close Button - Positioned at top right of screen */}
            <button
                className="absolute top-4 right-4 bg-white/80 text-black p-3 rounded-full cursor-pointer z-20 hover:bg-white transition-colors shadow-md"
                onClick={onClose}
                aria-label="Close lightbox"
            >
                <X size={24} />
            </button>

            {/* Navigation Buttons - Hidden on Mobile */}
            <button
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white/80 text-black p-4 rounded-full z-10 hover:bg-white transition-colors shadow-md hidden sm:block"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('prev');
                }}
                aria-label="Previous image"
            >
                <ArrowLeft size={24} />
            </button>
            <button
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white/80 text-black p-4 rounded-full z-10 hover:bg-white transition-colors shadow-md hidden sm:block"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('next');
                }}
                aria-label="Next image"
            >
                <ArrowRight size={24} />
            </button>

            <div
                className="relative max-w-[85vw] max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Current Image */}
                <Image
                    placeholder="blur"
                    blurDataURL={photos[selectedPhotoIndex].base64} // Provide the base64-encoded low-res image
                    src={photos[selectedPhotoIndex].src}
                    alt={photos[selectedPhotoIndex].alt}
                    width={1200}
                    height={800}
                    className="w-auto h-auto max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                />

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-black bg-white/80 px-4 py-2 rounded-full shadow-md">
                    {selectedPhotoIndex + 1} / {photos.length}
                </div>
            </div>
        </div>
    );
} 