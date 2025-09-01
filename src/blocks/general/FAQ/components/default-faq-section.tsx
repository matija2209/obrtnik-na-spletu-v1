import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { FAQBlock } from '@payload-types';
import { ColorScheme, getBackgroundClass, getColorClasses } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getFaqItemsByIds } from '@/lib/payload';




// Basic Rich Text extraction (placeholder) - Mirroring the one from Projects section
// TODO: Replace with a proper RichText renderer component
const renderRichText = (richText: any): string => {
  try {
    // Attempt to extract the first text node's content
    return richText?.root?.children?.[0]?.children?.[0]?.text || '';
  } catch (error) {
    console.error("Error rendering rich text:", error);
    return ''; // Return empty string on error
  }
};

export default async function DefaultFaqSection(props: FAQBlock) {
  const { title, description, selectedFaqs, colourScheme, bgColor: backgroundColor, isTransparent, idHref } = props;

  // Process color classes
  const colorClasses = getColorClasses(colourScheme as ColorScheme);
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch FAQ items data
  const faqIds = extractIdsFromNullable(selectedFaqs);
  const faqItems = faqIds.length > 0 ? await getFaqItemsByIds(faqIds) : [];

  if (faqItems.length === 0) {
    return null;
  }

  return (
    <ContainedSection
      id={idHref ?? "faq"}
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading>
          <SectionHeading.Title className={colorClasses.textClass}>{title}</SectionHeading.Title>
          <SectionHeading.Description className={colorClasses.textClass}>
            {description}
          </SectionHeading.Description>
        </SectionHeading>
          
        <Accordion type="single" collapsible defaultValue="pricing">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()} className="border-0 mb-4 group">
              <AccordionTrigger className={cn(
                "py-4 px-6 data-[state=open]:bg-primary data-[state=closed]:bg-primary-foreground data-[state=open]:text-primary-foreground data-[state=closed]:text-foreground hover:bg-primary/80 font-medium rounded-md focus:outline-none transition-colors",
                colorClasses.textClass
              )}>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="mt-2 px-6 py-4 rounded-md group-data-[state=open]:bg-white bg-secondary">
                <p className={cn("group-data-[state=open]:text-foreground text-secondary-foreground", colorClasses.textClass)}>
                  {renderRichText(item.answer)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ContainedSection>
  );
} 