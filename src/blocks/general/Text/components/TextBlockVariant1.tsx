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
    bgColor,
  } = props;

  const backgroundClass = getBackgroundClass(bgColor as any);

  return (
    <ContainedSection
      id={idHref ?? "o-nas"}
      overlayClassName={backgroundClass}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      {text && <RichText data={text} />}
    </ContainedSection>
  );
}