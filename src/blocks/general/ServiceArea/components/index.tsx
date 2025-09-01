import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';import DefaultServiceAreaSection from './default-service-area-section';
import type { ServiceAreaBlock as ServiceAreaBlockType, Media } from '@payload-types'; // Assuming ServiceAreaBlock is the type name

// Define LocationItem type if not directly available or needs adjustment
interface LocationItem {
  name: string;
  // Add other fields if they exist in block.locations
  id?: string | null;
}

// Helper to check if an item is a valid LocationItem object
const isLocationItem = (item: any): item is LocationItem => 
  item !== null && typeof item === 'object' && typeof item.name === 'string';

const ServiceAreaBlock = ({ searchParams,params, ...block }: ServiceAreaBlockType  & { searchParams?: SearchParams ,params?:Params}) => {
  // Assuming a template field might exist
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultServiceAreaSection
      // Validate locations - ensure it's an array of valid LocationItem objects
      const validLocations = (block.locations ?? [])
        .filter(isLocationItem);
      
      // Prepare mapImage - assuming it's a Media object in block data
      // const mapImage = typeof block.mapImage === 'object' && block.mapImage !== null ? block.mapImage as Media : undefined; // Removed as field doesn't exist on block type

      return (
        <DefaultServiceAreaSection {...block}/>
      );
      // Add other cases for different templates if needed
  }

  // Fallback
  // return <div>Please select a template for the Service Area block.</div>;
};

export default ServiceAreaBlock;
