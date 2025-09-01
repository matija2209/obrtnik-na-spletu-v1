import React from 'react';
import type { Form } from '@payload-types';
import RichText from '@/components/payload/RichText';
import { ContainedSection } from '@/components/layout/container-section';
import { ColorScheme, getBackgroundClass, getColorClasses } from '@/utilities/getColorClasses';
import { SearchParams } from 'next/dist/server/request/search-params';

// Define the interface for the Form block
interface FormBlockProps {
  form: number | Form;
  enableIntro?: boolean | null;
  introContent?: any;
  id?: string | null;
  blockName?: string | null;
  blockType: 'formBlock';
  colourScheme?: string;
  bgColor?: string;
  isTransparent?: boolean;
  idHref?: string;
}

const FormBlock = ({ searchParams,...block }: FormBlockProps & { searchParams?: SearchParams }) => {
  const { form, enableIntro, introContent, colourScheme, bgColor: backgroundColor, isTransparent, idHref } = block;

  // Process color classes
  const colorClasses = getColorClasses(colourScheme as ColorScheme);
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection
      id={idHref ?? "form"}
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      <div className="max-w-2xl mx-auto">
        {enableIntro && introContent && (
          <div className="mb-8">
            <RichText data={introContent} className={colorClasses.textClass} />
          </div>
        )}
        
        {/* TODO: Implement form rendering based on the form object */}
        {typeof form === 'object' && form && (
          <div>
            <h2 className={`text-2xl font-bold mb-6 ${colorClasses.textClass}`}>{form.title}</h2>
            {/* Form fields would be rendered here */}
            <p className={`${colorClasses.textClass} opacity-75`}>Form implementation coming soon...</p>
          </div>
        )}
      </div>
    </ContainedSection>
  );
};

export default FormBlock; 