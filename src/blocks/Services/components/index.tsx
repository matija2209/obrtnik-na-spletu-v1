import DefaultServicesSection from './default-services-section';
import type { ServicesBlock as ServicesBlockType, Service as PayloadService } from '@payload-types'; // Assuming ServicesBlock is the type name
import ServiceCardsSection from './service-cards-section'; // Import the new template
import ServicesListSection from './services-list-section'; // Import the simple list template
import BigCardsSection from './big-cards-section'; // Import the big cards template
import SimpleCardSection from './simple-card-section'; // Import the simple card template
import ServiceFeatureRowSection from './service-feature-row-section'; // Import the feature row template
import RoundedCardsSection from './rounded-cards-section'; // Import the rounded cards template

// Helper to check if an item is a Service object (not a number or string ID)
const isServiceObject = (item: string | number | PayloadService): item is PayloadService => 
  typeof item === 'object' && item !== null && 'title' in item; // Check for a known required field like 'title'

// Helper function to validate services
const validateServices = (services: (string | number | PayloadService)[] | undefined | null): PayloadService[] => {
  return (services ?? [])
    .map((item) => (isServiceObject(item) ? item : null))
    .filter((item): item is PayloadService => item !== null);
};

const ServicesBlock = ({ ...block }: ServicesBlockType) => {
  const validServices = validateServices(block.selectedServices);

  if (validServices.length === 0) {
    // No valid services selected or populated, return null or a placeholder
    // console.warn('ServicesBlock: No valid services found for block', block.id);
    return null; 
  }

  switch (block.template) {
    case 'service-cards':
      return (
        <ServiceCardsSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices}
        />
      );
    case 'rounded-cards':
      return (
        <RoundedCardsSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices}
        />
      );
    case 'simple-list':
      return (
        <ServicesListSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices}
        />
      );
    case 'big-cards':
      return (
        <BigCardsSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices}
        />
      );
    case 'simple-card':
      return (
        <SimpleCardSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices}
        />
      );
    case 'service-feature-row': // Add case for the feature row template
      return (
        <ServiceFeatureRowSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices}
          // Pass any additional props if needed in the future
        />
      );
    case 'default':
    default: // Defaulting to render DefaultServicesSection
      return (
        <DefaultServicesSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices} 
        />
      );
  }
  // Fallback if template is somehow invalid (shouldn't happen with validation)
  // return <div>Invalid template selected for Services block.</div>;
};

export default ServicesBlock;
