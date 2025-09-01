import type { ServicesBlock as ServicesBlockType, Service as PayloadService } from '@payload-types'; // Assuming ServicesBlock is the type name
import ServicesSectionVariant8 from './ServicesSectionVariant8';
import DefaultServicesSection from './default-services-section';
import { SearchParams } from 'next/dist/server/request/search-params';

const ServicesBlock = async ({ searchParams, ...block }: ServicesBlockType  & { searchParams?: SearchParams }) => {
  switch (block.template) {
    
    case 'variant-8':
      return (
        <ServicesSectionVariant8
        {...block}
        />
      );
   
    case 'default':
    default: // Defaulting to render DefaultServicesSection
      return <DefaultServicesSection {...block} />
  }
  // Fallback if template is somehow invalid (shouldn't happen with validation)
  // return <div>Invalid template selected for Services block.</div>;
};

export default ServicesBlock;
