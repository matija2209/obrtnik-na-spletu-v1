import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';

interface FaqItem { 
  id: number | string; // Allow number or string for ID
  question?: string | null;
  answer?: any | null; // Type for rich text is complex, using 'any' for now
}

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqData?: FaqItem[];
}

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

export default function DefaultFaqSection({
  title,
  description,
  faqData,
}: FaqSectionProps) {
  return (
    <ContainedSection
      id="pogosta-vprasanja"
      bgColor="bg-white"
      verticalPadding="xl"
    >
      <div className="max-w-4xl mx-auto">
      <SectionHeading>
            <SectionHeading.Title>{title}</SectionHeading.Title>
            <SectionHeading.Description>
                {description}
            </SectionHeading.Description>
          </SectionHeading>
          
        <Accordion type="single" collapsible defaultValue="pricing">
          {faqData && faqData.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()} className="border-0 mb-4 group">
              <AccordionTrigger className="py-4 px-6 data-[state=open]:bg-primary data-[state=closed]:bg-primary-foreground data-[state=open]:text-primary-foreground data-[state=closed]:text-foreground hover:bg-primary/80 font-medium rounded-md focus:outline-none transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="mt-2 px-6 py-4 rounded-md group-data-[state=open]:bg-white bg-secondary">
                <p className="group-data-[state=open]:text-foreground text-secondary-foreground">
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