import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { FAQBlock, FaqItem } from '@payload-types';
import { ColorScheme, getBackgroundClass, getColorClasses } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { getFaqItems } from '@/lib/payload';
import { extractIdsFromNullable } from '@/utilities/extractIds';



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
  const { title, subtitle , selectedFaqs,  bgc: backgroundColor, isTransparent, idHref } = props;

  // Extract IDs and fetch FAQ data


  // Process color classes
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection
      id={idHref ?? "faq"}
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading>
          <SectionHeading.Title className='text-center'>{title}</SectionHeading.Title>
          <SectionHeading.Description className='text-center'>
            {subtitle}
          </SectionHeading.Description>
        </SectionHeading>
          
        <Accordion type="single" collapsible defaultValue="pricing">
          {selectedFaqs && (selectedFaqs as FaqItem[]).map((item: FaqItem) => {
            return (
              <AccordionItem key={item.id} value={item.id.toString()} className="border-0 mb-4 group">
                <AccordionTrigger className={cn(
                  "py-4 px-6 data-[state=open]:bg-secondary data-[state=closed]:bg-secondary data-[state=open]:text-primary-foreground data-[state=closed]:text-primary-foreground hover:bg-primary font-medium rounded-md focus:outline-none transition-colors",

                )}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="mt-2 px-6 py-4 rounded-md group-data-[state=open]:bg-white bg-secondary">
                  <p className={cn("group-data-[state=open]:text-foreground text-secondary")}>
                    {renderRichText(item.answer)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </ContainedSection>
  );
} 