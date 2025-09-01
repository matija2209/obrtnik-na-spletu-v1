import { SearchParams } from 'next/dist/server/request/search-params';
import DefaultContactSection from './default-contact-section';
import type { ContactBlock } from '@payload-types';

const ContactBlockComponent = ({ searchParams, ...block }: ContactBlock & { searchParams?: SearchParams }) => {
  switch (block?.template) {
    case 'default':
    default:
      return <DefaultContactSection {...block} />
  }
};

export default ContactBlockComponent;
