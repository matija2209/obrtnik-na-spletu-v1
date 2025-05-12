import type { Payload } from 'payload';
import type { Page, HeroBlock, ServicesBlock, ProjectHighlightsBlock, AboutBlock, TestimonialsBlock, ServiceAreaBlock, FAQBlock, ContactBlock, Media } from '../../../payload-types'; 
import type { SeedArgs } from '../utils';
import {
  getServiceId,
  getProjectId,
  getTestimonialId,
  getFaqId,
  getOpeningHourId,
  getFormId,
  // No longer using getMediaId directly here as we need the full Media object or just the ID
} from '../utils';

export const seedPages = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq' | 'seededImageIds' | 'serviceVodoinstalacije' | 'serviceMontaza' | 'projectAdaptacija' | 'projectNovogradnja' | 'testimonial1' | 'testimonial2' | 'faq1' | 'faq2' | 'faq3' | 'regularHours' | 'defaultSiteContactForm' | 'ctaKontakt' | 'ctaVseStoritve' | 'mainMenu'> ): Promise<void> => {
  const { payload, tenantA1, simulatedReq, seededImageIds, serviceVodoinstalacije, serviceMontaza, projectAdaptacija, projectNovogradnja, testimonial1, testimonial2, faq1, faq2, faq3, regularHours, defaultSiteContactForm, ctaKontakt, ctaVseStoritve, mainMenu } = args;
  payload.logger.info('--- Seeding Pages ---');

  // --- Seed Home Page ---
  try {
    payload.logger.info(`Seeding 'home' page for tenant ${tenantA1.id}...`);

    const heroImageId = seededImageIds['hiša-terasa-zunanje-ureditve.jpg'];

    const layout: Page['layout'] = [
      // Hero Block
      {
        blockType: 'hero',
        template: 'default',
        kicker: 'A1 INŠTALACIJE',
        title: 'Vaš Zanesljiv Partner za Vodoinštalacije',
        subtitle: 'A1 INŠTALACIJE d.o.o. - Kakovost in zanesljivost na prvem mestu.',
        includeFollowersBadge: true,
        ...(heroImageId && { image: [heroImageId as number] }), // Pass ID directly
        features: [
          { iconText: '10+', text: 'Let izkušenj' },
          { iconText: '✓', text: 'Certificirani mojstri' },
          { iconText: '✓', text: 'Garancija na delo' },
        ],
        ctas: [ctaKontakt?.id, ctaVseStoritve?.id].filter(Boolean) as number[]
      } as HeroBlock,
      // Services Block
      {
        blockType: 'services',
        template: 'default',
        title: 'Naše Storitve',
        description: 'Nudimo širok spekter vodoinštalaterskih storitev.',
        selectedServices: [getServiceId(serviceVodoinstalacije), getServiceId(serviceMontaza)]
          .filter(Boolean) as number[],
        // cta: getCtaId(ctaVseStoritve),
      } as ServicesBlock,
      // Project Highlights Block
      {
        blockType: 'projectHighlights',
        template: 'default',
        title: 'Naši Projekti',
        description: 'Oglejte si nekaj naših uspešno zaključenih projektov.',
        buttonText: 'Vsi Projekti',
        buttonHref: '/projekti',
        highlightedProjects: [getProjectId(projectAdaptacija), getProjectId(projectNovogradnja)]
          .filter(Boolean) as number[],
      } as ProjectHighlightsBlock,
      // About Block
      {
        blockType: 'about',
        template: 'default',
        title: 'Spoznajte nas',
        description: 'Smo ekipa izkušenih vodoinštalaterjev, predanih kakovosti in zadovoljstvu strank. Z več kot 10 leti izkušenj zagotavljamo zanesljive in trajne rešitve.',
        ctas: [ctaKontakt?.id].filter(Boolean) as number[],
      } as AboutBlock,
      // Testimonials Block
      {
        blockType: 'testimonials',
        template: 'default',
        title: 'Mnenja naših strank',
        selectedTestimonials: [getTestimonialId(testimonial1), getTestimonialId(testimonial2)]
          .filter(Boolean) as number[],
      } as TestimonialsBlock,
      // Service Area Block
      {
        blockType: 'serviceArea',
        template: 'default',
        title: 'Kje delujemo?',
        showMap: true,
        locations: [ { name: 'Ljubljana' }, { name: 'Domžale' }, { name: 'Kamnik' }, { name: 'Kranj'} ],
        ctas: [ctaKontakt?.id].filter(Boolean) as number[],
      } as ServiceAreaBlock,
      // FAQ Block
      {
        blockType: 'faq',
        template: 'default',
        title: 'Pogosta Vprašanja',
        selectedFaqs: [getFaqId(faq1), getFaqId(faq2), getFaqId(faq3)]
          .filter(Boolean) as number[],
      } as FAQBlock,
      // Contact Block
      {
        blockType: 'contact',
        template: 'default',
        title: 'Stopite v stik',
        description: 'Za vsa vprašanja, povpraševanja ali nujne intervencije smo vam na voljo.',
        ...(regularHours ? { openingHoursSchedules: [getOpeningHourId(regularHours)].filter(Boolean) as number[] } : {}),
        phoneNumber: '069 653335',
        address: 'Stegne 35, 1000 Ljubljana',
        ...(defaultSiteContactForm ? { form: getFormId(defaultSiteContactForm) } : {}),
      } as ContactBlock,
    ];

    await payload.create({
      collection: 'pages',
      data: {
        tenant: tenantA1.id,
        title: 'Domov',
        slug: 'home',
        pageType: 'landing',
        layout,
        meta: {
          title: 'A1 INŠTALACIJE d.o.o. | Vodoinštalacije Ljubljana',
          description: 'Profesionalne vodoinštalaterske storitve in montaža sanitarne opreme v Ljubljani in okolici. A1 INŠTALACIJE d.o.o.',
        }
      },
      req: simulatedReq,
    });
    payload.logger.info(`'home' page seeded for tenant ${tenantA1.id}.`);
  } catch (err) {
    payload.logger.error('Error seeding \'home\' page:', err);
    // Decide if this should stop the whole seed process
  }

  // Add logic for other pages if needed
}; 