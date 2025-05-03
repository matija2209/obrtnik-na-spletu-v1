import DefaultServicesSection from './default-services-section';
import type { ServicesBlock as ServicesBlockType, Service as PayloadService } from '@payload-types'; // Assuming ServicesBlock is the type name

// Helper to check if an item is a Service object (not a number or string ID)
const isServiceObject = (item: string | number | PayloadService): item is PayloadService => 
  typeof item === 'object' && item !== null && 'title' in item; // Check for a known required field like 'title'

const ServicesBlock = ({ ...block }: ServicesBlockType) => {
  // Assuming a template field might exist
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultServicesSection
      // Validate selectedServices: ensure it's an array of PayloadService objects
      // Assuming the relationship field is named 'selectedServices'
      const validServices = (block.selectedServices ?? [])
        .map((item: string | number | PayloadService) => isServiceObject(item) ? item : null)
        .filter((item: PayloadService | null): item is PayloadService => item !== null);

      // DefaultServicesSection requires services, so handle the case where none are valid/selected
      if (validServices.length === 0) {
        // Optionally return null or a placeholder
         return null; 
        // return <div>No services available to display.</div>;
      }

      return (
        <DefaultServicesSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          services={validServices} // Pass validated services
        />
      );
      // Add other cases for different templates if needed
  }

  // Fallback
  // return <div>Please select a template for the Services block.</div>;
};

export default ServicesBlock;
