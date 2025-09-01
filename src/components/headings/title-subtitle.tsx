import React from 'react';
import Link from 'next/link';
import { Cta } from '@payload-types';

import CtaButtons from '../common/cta-buttons';
import { ColorScheme, getColorClasses } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import SectionHeading from '../layout/section-heading';

interface TitleSubtitleProps {
  preTitle?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  ctas?: Cta[]
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
  preTitle,
  title,
  subtitle,
  ctas,
  variant
}) => {
  return (
    <div className="">
      {preTitle && (
        <p className={cn("text-sm sm:text-base md:text-lg  tracking-wider",
        )}>
          {preTitle}
        </p>
      )}
      <SectionHeading
      />
      <SectionHeading.Title>
        {title}
      </SectionHeading.Title>
      <SectionHeading.Description>
        {subtitle}
      </SectionHeading.Description>
      
      {ctas && ctas.length > 0 && (
        <CtaButtons
        variant={variant}
          ctas={ctas as Cta[]}
        />
      )}
    </div>
  );
};

export default TitleSubtitle; 