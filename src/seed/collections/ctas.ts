import type { Payload } from 'payload';
import type { Cta } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedCtas = async (args: Pick<SeedArgs, 'payload' | 'tenantA1'>): Promise<{ ctaKontakt?: Cta, ctaVseStoritve?: Cta }> => {
  const { payload, tenantA1 } = args;
  payload.logger.info('--- Seeding CTAs ---');
  let ctaKontakt: Cta | undefined = undefined;
  let ctaVseStoritve: Cta | undefined = undefined;

  try {
    payload.logger.info('Attempting to create CTA: Kontaktirajte nas');
    ctaKontakt = await payload.create({
      collection: 'ctas',
      data: {
        tenant: tenantA1.id,
        ctaText: 'Kontaktirajte nas',
        link: {
          type: 'external',
          externalUrl: '#kontakt', // Use externalUrl for anchors
          newTab: false,
        },
        ctaType: 'primary',
      },
    });
    payload.logger.info(`Created CTA (Kontaktirajte nas): ${ctaKontakt.id}`);
  } catch (err) {
    payload.logger.error('Error creating CTA (Kontaktirajte nas): ', err);
  }

  try {
    payload.logger.info('Attempting to create CTA: Vse Storitve');
    ctaVseStoritve = await payload.create({
      collection: 'ctas',
      data: {
        tenant: tenantA1.id,
        ctaText: 'Vse Storitve',
        link: {
          type: 'external',
          externalUrl: '/storitve', // Assume external/relative for now
          newTab: false,
        },
        ctaType: 'secondary',
      },
    });
    payload.logger.info(`Created CTA (Vse Storitve): ${ctaVseStoritve.id}`);
  } catch (err) {
    payload.logger.error('Error creating CTA (Vse Storitve):', err);
  }

  if (ctaKontakt && ctaVseStoritve) {
    payload.logger.info(`CTAs seeded: ${ctaKontakt.id}, ${ctaVseStoritve.id}`);
  } else {
    payload.logger.warn('One or more CTAs failed to seed.');
  }

  return { ctaKontakt, ctaVseStoritve };
}; 