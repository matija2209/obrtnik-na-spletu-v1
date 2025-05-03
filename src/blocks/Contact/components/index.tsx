import DefaultContactSection from './default-contact-section';
import type { ContactBlock as ContactBlockType } from '@payload-types'; // Assuming ContactBlock is the type name

const ContactBlock = ({ ...block }: ContactBlockType) => {
  // Assuming a template field might exist, though not strictly necessary if only one template
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultContactSection
      return (
        <DefaultContactSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          // Add other props from ContactBlockType if needed by DefaultContactSection in the future
        />
      );
      // Add other cases for different templates if needed
  }

  // Fallback (optional, as default case covers everything now)
  // return <div>Please select a template for the Contact block.</div>;
};

export default ContactBlock;
