import DefaultGallerySection from './default-gallery-section';
import type { GalleryBlock as GalleryBlockType } from '@payload-types'; // Assuming GalleryBlock is the type name

const GalleryBlock = ({ ...block }: GalleryBlockType) => {
  // Assuming a template field might exist
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render GallerySection
      // GallerySection currently handles its own title, description, and photos internally.
      // Pass props from 'block' if GallerySection is refactored to accept them later.
      return (
        <DefaultGallerySection />
      );
      // Add other cases for different templates if needed
  }

  // Fallback
  // return <div>Please select a template for the Gallery block.</div>;
};

export default GalleryBlock;
