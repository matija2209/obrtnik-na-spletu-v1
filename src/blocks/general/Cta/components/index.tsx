
import type { CtaBlock } from '@payload-types';
import CtaBlockVariant1 from './CtaBlockVariant1';

const CtaBlockComponent = ({ ...block }: CtaBlock) => {
  switch (block?.template) {
    case 'default':
    default:
      return <CtaBlockVariant1 {...block} />
  }
};

export default CtaBlockComponent;
