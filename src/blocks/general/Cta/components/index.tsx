import type { CtaBlock } from '@payload-types';
import DefaultServiceCtaSection from './default-cta-section';
import { SearchParams } from 'next/dist/server/request/search-params';

const CtaBlockComponent = async ({ searchParams, ...block }: CtaBlock & { searchParams?: SearchParams }) => {
  switch (block?.template) {
    case 'default':
    default:
      return <DefaultServiceCtaSection {...block} />
  }
};

export default CtaBlockComponent;
