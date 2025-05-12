import type { Payload } from 'payload';
import type { Service } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedServices = async (args: Pick<SeedArgs, 'payload' | 'tenantA1'>): Promise<{ serviceVodoinstalacije?: Service, serviceMontaza?: Service }> => {
  const { payload, tenantA1 } = args;
  payload.logger.info('--- Seeding Services ---');
  let serviceVodoinstalacije: Service | undefined = undefined;
  let serviceMontaza: Service | undefined = undefined;

  try {
    payload.logger.info('Attempting to create Service: Vodoinštalacije');
    serviceVodoinstalacije = await payload.create({
      collection: 'services',
      data: {
        tenant: tenantA1.id,
        title: 'Vodoinštalacije',
        description: 'Nudimo celovite rešitve za vodovodne inštalacije, od načrtovanja do izvedbe in vzdrževanja.',
        features: [{ featureText: 'Novogradnje' }, { featureText: 'Adaptacije' }, { featureText: 'Popravila' }],
        images: [], // Images will be updated later
        priceDisplay: 'Po dogovoru',
      },
    });
    payload.logger.info(`Created Service (Vodoinštalacije): ${serviceVodoinstalacije.id}`);
  } catch (err) {
    payload.logger.error('Error creating Service (Vodoinštalacije):', err);
  }

  try {
    payload.logger.info('Attempting to create Service: Montaža sanitarne opreme');
    serviceMontaza = await payload.create({
      collection: 'services',
      data: {
        tenant: tenantA1.id,
        title: 'Montaža sanitarne opreme',
        description: 'Strokovna montaža tuš kabin, kadi, WC školjk, umivalnikov in ostale sanitarne opreme.',
        features: [{ featureText: 'Montaža' }, { featureText: 'Priklop' }, { featureText: 'Svetovanje' }],
        images: [], // Images will be updated later
        priceDisplay: 'Od €150 dalje',
      },
    });
    payload.logger.info(`Created Service (Montaža): ${serviceMontaza.id}`);
  } catch (err) {
    payload.logger.error('Error creating Service (Montaža sanitarne opreme):', err);
  }

  if (serviceVodoinstalacije && serviceMontaza) {
    payload.logger.info(`Services seeded: ${serviceVodoinstalacije.id}, ${serviceMontaza.id}`);
  } else {
    payload.logger.warn('One or more Services failed to seed.');
  }

  return { serviceVodoinstalacije, serviceMontaza };
}; 