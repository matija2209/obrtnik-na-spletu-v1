import GalleryBlockVariant1 from './GalleryBlockVariant1';
import type { GalleryBlock as GalleryBlockType } from '@payload-types'; // Assuming GalleryBlock is the type name

const GalleryBlock = ({ ...block }: GalleryBlockType) => {
  switch (block?.template) {
    case 'default':
    default: 
      return (
        <GalleryBlockVariant1 
          {...block}
        />
      );
  }
};

export default GalleryBlock;
