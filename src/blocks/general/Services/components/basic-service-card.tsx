import React from 'react';
import type { Media, Service } from '@payload-types';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image'; // Assuming usage of Next.js Image

// Helper to check if an object is a Media object
const isMediaObject = (item: string | number | Media | null | undefined): item is Media =>
  typeof item === 'object' && item !== null && 'url' in item;

// Define the props for the BasicServiceCard
interface BasicServiceCardProps {
  service: Service;
  // Add other props if needed, e.g., transparentCards: boolean;
}

export const BasicServiceCard: React.FC<BasicServiceCardProps> = ({
  service,
  // transparentCards,
}) => {
  const { title, description, images } = service;

  // Get the first image if available and it's a Media object
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0]?.image : null;
  const imageMedia = isMediaObject(firstImage) ? firstImage : null;

  const renderImage = () => {
    if (!imageMedia || !imageMedia.url) return null;

    const altText = imageMedia.alt || title || ''; // Use service title as fallback alt text
    const srcUrl = imageMedia.url;
    const width = imageMedia.width;
    const height = imageMedia.height;

    // Use Next.js Image component
    return (
      <Image
        src={srcUrl}
        alt={altText}
        className="object-cover"
        fill // Use fill to cover the container
        priority={false} // Adjust priority as needed
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust based on your grid layout
        // You might need width and height if not using fill, or for placeholder
        // width={width || 400} // Provide default or fetched width
        // height={height || 400} // Provide default or fetched height
      />
    );
  };

  return (
    <div
      className={twMerge(
        'service-cards-item bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col h-full'
        // transparentCards ? '' : 'bg-white rounded-lg shadow-md' // Example of conditional styling
      )}
    >
      {imageMedia && (
        <div className="relative w-full h-64 mb-4 overflow-hidden rounded-md"> {/* Added rounded-md */}
          {renderImage()}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4 flex-grow">{description}</p>} {/* Added flex-grow */}
      {/* Removed CTA link from card - Block level CTA will handle this */}
      {/* <div className="mt-auto"> ... </div> */}
    </div>
  );
};

export default BasicServiceCard; 