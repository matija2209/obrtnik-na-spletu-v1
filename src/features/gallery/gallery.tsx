'use client';

import { useState } from 'react';
import GalleryGrid from './gallery-grid';
import GalleryLightbox from './gallery-lightbox';
import { Photo } from './types';

interface GalleryProps {
    photos: Photo[];
}

export default function Gallery({ photos }: GalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Touch event state for lightbox navigation
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Handle touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isSwipeLeft = distance > minSwipeDistance;
        const isSwipeRight = distance < -minSwipeDistance;

        // Only handle lightbox navigation here
        if (selectedPhotoIndex !== null) {
            if (isSwipeLeft) {
                navigateLightbox('next');
            } else if (isSwipeRight) {
                navigateLightbox('prev');
            }
        }

        // Reset touch states
        setTouchStart(null);
        setTouchEnd(null);
    };

    const openLightbox = (index: number) => {
        setSelectedPhotoIndex(index);
    };

    const closeLightbox = () => {
        setSelectedPhotoIndex(null);
    };

    const navigateLightbox = (direction: 'next' | 'prev') => {
        if (selectedPhotoIndex !== null) {
            let newIndex;
            if (direction === 'next') {
                newIndex = (selectedPhotoIndex + 1) % photos.length;
            } else {
                newIndex = (selectedPhotoIndex - 1 + photos.length) % photos.length;
            }
            setSelectedPhotoIndex(newIndex);
        }
    };

    return (
        <>
            <GalleryGrid
                photos={photos}
                onOpenLightbox={openLightbox}
            />

            <GalleryLightbox
                photos={photos}
                selectedPhotoIndex={selectedPhotoIndex}
                onClose={closeLightbox}
                onNavigate={navigateLightbox}
                touchStart={handleTouchStart}
                touchMove={handleTouchMove}
                touchEnd={handleTouchEnd}
            />
        </>
    );
} 