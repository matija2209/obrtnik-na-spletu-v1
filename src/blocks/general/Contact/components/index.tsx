import ContactBlockVariant1 from './ContactBlockVariant1';
import type { ContactBlock } from '@payload-types';

const ContactBlockComponent = ({ ...block }: ContactBlock) => {
  switch (block?.template) {
    case 'default':
    default:
      return <ContactBlockVariant1 {...block} />
  }
};

export default ContactBlockComponent;
