import React from 'react';
import Link from 'next/link';
import { Cta } from '@payload-types';
import CtaButton from '@/components/ui/cta-button';

interface TitleSubtitleProps {
  preTitle?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  ctas?: Cta[]
}

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
  preTitle,
  title,
  subtitle,
  ctas
}) => {
  return (
    <div className="">
      {preTitle && (
        <p className="text-primary font-bold text-sm sm:text-base md:text-lg mb-2 tracking-wider">
          {preTitle}
        </p>
      )}
      <h1 className="
        text-4xl     // Base (mobile) size
        sm:text-4xl  // Small screens
        md:text-5xl  // Medium screens
        lg:text-5xl  // Large screens
        xl:text-6xl  // Extra-large screens
        2xl:text-7xl // 2X large screens
        font-bold 
        mb-4
      ">{title}</h1>
      {subtitle && (
        <p className="
          text-lg     // Base (mobile) size
          sm:text-xl  // Small screens
          md:text-xl  // Medium screens
          lg:text-2xl // Large screens
          xl:text-2xl // Extra-large screens
          2xl:text-3xl // 2X large screens
          mb-8
        ">
          {subtitle}
        </p>
      )}
      {ctas && ctas.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {ctas.map((cta) => (
            <CtaButton key={cta.id} mainCta={cta} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TitleSubtitle; 