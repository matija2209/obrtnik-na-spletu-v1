import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import type { TextBlock } from '@payload-types'; 

import { getBackgroundClass } from '@/utilities/getColorClasses';
import RichText from '@/components/payload/RichText';

// Main About Section Component
export default async function TextBlockVariant1(props: TextBlock) {
  const { 
    text,
    idHref,
    bgc: backgroundColor,
  } = props;



  // Get color classes based on the selected scheme

  const backgroundClass = getBackgroundClass(backgroundColor as any);


  // Get background image for ContainedSection


  return (
    <ContainedSection
      id={idHref ?? "o-nas"}


      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      {text && <RichText data={text} />}
    </ContainedSection>
  );
}