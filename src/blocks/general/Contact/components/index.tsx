import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';
import DefaultContactSection from './default-contact-section';
import type { ContactBlock } from '@payload-types';

const ContactBlockComponent = ({ searchParams,params, ...block }: ContactBlock & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block?.template) {
    case 'default':
    default:
      return <DefaultContactSection {...block} />
  }
};

export default ContactBlockComponent;
