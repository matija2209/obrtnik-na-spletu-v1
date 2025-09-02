import type { MachineryBlock as MachineryBlockType } from '@payload-types';
import { ContainedSection } from '@/components/layout/container-section';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';

const MachineryBlock = ({ ...block }: MachineryBlockType) => {
  const { 
    title, 
    description, 
    bgc: backgroundColor,
    isTransparent
  } = block;

  // Get color classes and background styling
  
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
            <h2 >{title}</h2>
            {description && <p >{description}</p>}
            {/* Add machinery-specific content here */}
          </div>
        </ContainedSection>
      );
  }
};

export default MachineryBlock;
