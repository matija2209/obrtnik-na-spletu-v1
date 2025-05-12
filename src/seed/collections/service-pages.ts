import type { Payload } from 'payload';
// Assuming ServicePage type exists, import it
// import type { ServicePage } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedServicePages = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq' | 'serviceVodoinstalacije' | 'subServiceOdtok' | 'subServicePipe'>): Promise<void> => {
  const { payload, tenantA1, simulatedReq, serviceVodoinstalacije, subServiceOdtok, subServicePipe } = args;
  payload.logger.info('--- Seeding Service Pages ---');

  if (!serviceVodoinstalacije?.id) {
    payload.logger.warn('Skipping Service Page creation for Vodoinštalacije as parent service was not created.');
    return;
  }

  const relatedSubServices = [subServiceOdtok?.id, subServicePipe?.id].filter(Boolean) as number[];

  try {
    payload.logger.info('Attempting to create Service Page: Stran za Vodoinštalacije');
    await payload.create({
      collection: 'service-pages',
      data: {
        tenant: tenantA1.id,
        title: 'Stran za Vodoinštalacije',
        pageType: 'service',
        slug: 'vodoinstalacije-podrobno',
        publishedAt: new Date().toISOString(),
        services: serviceVodoinstalacije.id, // Link to the main service
        sub_services: relatedSubServices, // Link to related sub-services
        layout: [
          {
            blockType: 'servicesHero', // Corrected blockType slug
            template: 'default',
            title: 'Podrobno o Vodoinštalacijah',
            // Add other required fields if any
          },
          // Add other blocks like ServicesPresentation, ServicesFaq if needed
        ],
        // meta: {
        //   title: 'Vodoinštalacije Podrobno | A1 INŠTALACIJE',
        //   description: 'Vse o naših vodoinštalaterskih storitvah in podstoritvah.'
        // }
      },
      req: simulatedReq, // For tenant context and potential hooks
    });
    payload.logger.info(`Created Service Page: Stran za Vodoinštalacije for Service ID ${serviceVodoinstalacije.id}`);
  } catch (err) {
    payload.logger.error('Error creating Service Page (Stran za Vodoinštalacije):', err);
  }

  // Add logic for other service pages if needed
}; 