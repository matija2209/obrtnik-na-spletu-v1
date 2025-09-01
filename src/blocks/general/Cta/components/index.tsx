import type { CtaBlock } from '@payload-types';
import DefaultServiceCtaSection from './default-cta-section';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';
const CtaBlockComponent = async ({ searchParams,params, ...block }: CtaBlock & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block?.template) {
    case 'default':
    default:
      return <DefaultServiceCtaSection {...block} />
  }
};

export default CtaBlockComponent;
