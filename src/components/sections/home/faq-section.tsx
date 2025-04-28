import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import SectionHeading from '@/components/layout/section-heading';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FaqSection({ faqData }: { faqData: FaqItem[] }) {
  return (
    <ContainedSection
      id="pogosta-vprasanja"
      bgColor="bg-white"
      verticalPadding="xl"
    >
      <div className="max-w-4xl mx-auto">
      <SectionHeading>
            <SectionHeading.Title>Pogosta vprašanja</SectionHeading.Title>
            <SectionHeading.Description>
                Če imate kakršno koli vprašanje ali potrebo po pomoči, smo tu za vas.
            </SectionHeading.Description>
          </SectionHeading>
          
        <Accordion type="single" collapsible defaultValue="pricing">
          {faqData.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-0 mb-4 group">
              <AccordionTrigger className="py-4 px-6 data-[state=open]:bg-primary data-[state=closed]:bg-primary-foreground data-[state=open]:text-primary-foreground data-[state=closed]:text-foreground hover:bg-primary/80 font-medium rounded-md focus:outline-none transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="mt-2 px-6 py-4 rounded-md group-data-[state=open]:bg-white bg-secondary">
                <p className="group-data-[state=open]:text-foreground text-secondary-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ContainedSection>
  );
} 