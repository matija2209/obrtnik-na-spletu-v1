import type { Block } from 'payload';
import type { TestimonialsBlock } from '@payload-types';
import isTransparent from '@/fields/isTransperant';

import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: {
      sl: 'Mnenja odsek (Splošni)',
      de: 'Bewertungs Abschnitt (Allgemein)',
      en: 'Testimonials Section (General)',
    },
    plural: {
      sl: 'Mnenja odseki (Splošni)',
      de: 'Bewertungs Abschnitte (Allgemein)',
      en: 'Testimonials Sections (General)',
    },
  },
  fields: [
    {
      name: 'template',
      label: {
        sl: 'Predloga',
        de: 'Vorlage',
        en: 'Template',
      },
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: {
            sl: 'Privzeti način',
            de: 'Standard-Layout',
            en: 'Default Layout',
          },
          value: 'default',
        },
        
      ],
    },
    {
      name: 'kicker',
      type: 'text',
      label: {
        sl: 'Kicker',
        de: 'Kicker',
        en: 'Kicker',
      },
      defaultValue: '',
    },
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      required: false,
      
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        sl: 'Podnaslov',
        de: 'Untertitel',
        en: 'Subtitle',
      },
      defaultValue: '',
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    
    {
      name: 'googleReviewCta',
      label: {
        sl: 'Google Review CTA',
        de: 'Google Review CTA',
        en: 'Google Review CTA',
      },
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false, // Allow only one CTA
    },
    {
      name: 'selectedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: {
        sl: 'Mnenje',
        de: 'Bewertung',
        en: 'Testimonial',
      },
      admin:{
        description: {
          sl: 'Izberite mnenja, ki se bodo prikazala v odseku.',
          de: 'Wählen Sie Bewertungen, die in der Sektion angezeigt werden.',
          en: 'Select testimonials to display in the section.',
        }
      }
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"mnenja"
    },
    // Add googleReviewCta field based on recycled code
   
  ]
};

export default TestimonialsBlock; 