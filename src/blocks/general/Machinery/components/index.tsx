import type { MachineryBlock as MachineryBlockType } from '@payload-types';
import { ContainedSection } from '@/components/layout/container-section';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';
const MachineryBlock = ({ searchParams,params, ...block }: MachineryBlockType  & { searchParams?: SearchParams ,params?:Params}) => {
  const { 
    title, 
    description, 
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = block;

  // Get color classes and background styling
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  switch (block?.template) {
    case 'default':
    default:
      return (
        <ContainedSection
          overlayClassName={overlayClass}
          verticalPadding="xl"
        >
          <div>
            <h2 className={colorClasses.textClass}>{title}</h2>
            {description && <p className={colorClasses.textClass}>{description}</p>}
            {/* Add machinery-specific content here */}
          </div>
        </ContainedSection>
      );
  }
};

export default MachineryBlock;
