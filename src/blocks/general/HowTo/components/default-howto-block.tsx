import React from 'react';
import { Cta, HowToBlock } from '@payload-types';
import CtaButtons from '@/components/common/cta-buttons';
import RichText from '@/components/payload/RichText';
import { ContainedSection } from '@/components/layout/container-section';
import { ColorScheme, getBackgroundClass, getColorClasses } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';

const DefaultHowToBlock: React.FC<HowToBlock> = (props) => {
  const { 
    title, 
    subtitle, 
    steps, 
    cta, 
    bgc:backgroundColor,
    isTransparent,
    template,

  } = props;

  // Process color classes
  
  const backgroundClass = getBackgroundClass( backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection
      overlayClassName={overlayClass}
      verticalPadding="xl"
      maxWidth="7xl"
    >
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          {title && (
            <h2 className={cn("text-3xl lg:text-4xl font-bold mb-4")}>
              {title}
            </h2>
          )}
        
          {/* Decorative line above title (like in the image) */}
          <div className="flex items-center justify-center mb-6">
            <div className={cn("h-px w-16")}></div>
            <span className={cn("px-3 text-sm font-medium tracking-wider uppercase")}>
              {subtitle && subtitle}
            </span>
            <div className={cn("h-px w-16")}></div>
          </div>
        </div>

        {/* Steps Section */}
        {steps && steps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                {/* Step Indicator */}
                <div className="flex justify-center mb-6">
                  {step.useIcon && step.icon ? (
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center")}>
                      <i className={`${step.icon} text-lg`} />
                    </div>
                  ) : (
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg")}>
                      {step.stepNumber || index + 1}
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="max-w-sm mx-auto">
                  {step.title && (
                    <h3 className={cn("text-xl font-semibold mb-4")}>
                      {step.title}
                    </h3>
                  )}
                  
                  {step.description && (
                    <div >
                      <RichText data={step.description}  />
                    </div>
                  )}
                </div>

                {/* Connector line for horizontal layout (except last item) */}
                {index < steps.length - 1 && (
                  <div className={cn("hidden md:block absolute top-6 left-1/2 w-full h-px transform translate-x-6 z-[-1]")} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className='mx-auto text-center mt-12'>
          {cta && cta.length > 0 && (
            <CtaButtons ctas={cta as Cta[]} />
          )}
        </div>
    </ContainedSection>
  );
};

export default DefaultHowToBlock;