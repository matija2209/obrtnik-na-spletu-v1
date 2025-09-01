import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';import DefaultGallerySection from './default-gallery-section';

import type { GalleryBlock as GalleryBlockType } from '@payload-types'; // Assuming GalleryBlock is the type name
import { Suspense } from 'react';

const GalleryBlock = ({ searchParams,params, ...block }: GalleryBlockType & { searchParams?: SearchParams ,params?:Params}) => {
  // Assuming a template field might exist
  switch (block?.template) {
    case 'variant1':
    case 'default':
    default: // Defaulting to render GallerySection
      return (
        <Suspense fallback={<div>Nalaganje galerije...</div>}>
          <DefaultGallerySection
            {...block}
          />
        </Suspense>
      );
      // Add other cases for different templates if needed
  }

  // Fallback
  // return <div>Please select a template for the Gallery block.</div>;
};

export default GalleryBlock;
