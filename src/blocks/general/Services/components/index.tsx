import ServicesBlockVariant1 from './ServicesBlockVariant1';
import type { ServicesBlock as ServicesBlockType, Service as PayloadService } from '@payload-types'; // Assuming ServicesBlock is the type name


const ServicesBlock = ({ ...block }: ServicesBlockType) => {


  switch (block.template) {

    case 'default':
    default: // Defaulting to render ServicesBlockVariant1
      return (
        <ServicesBlockVariant1
        {...block}
        />
      );
  }
  // Fallback if template is somehow invalid (shouldn't happen with validation)
  // return <div>Invalid template selected for Services block.</div>;
};

export default ServicesBlock;
