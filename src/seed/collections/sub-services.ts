import type { Payload } from 'payload';
import type { SubService } from '../../../payload-types'; // Assuming SubService type exists
import type { SeedArgs } from '../utils';

// Define return type more specifically if SubService type is confirmed
export const seedSubServices = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'serviceVodoinstalacije' | 'serviceMontaza'>): Promise<{ subServiceOdtok?: any, subServicePipe?: any, subServiceWC?: any, subServiceShower?: any }> => {
  const { payload, tenantA1, serviceVodoinstalacije, serviceMontaza } = args;
  payload.logger.info('--- Seeding Sub-Services ---');

  let subServiceOdtok: SubService | undefined = undefined;
  let subServicePipe: SubService | undefined = undefined;
  let subServiceWC: SubService | undefined = undefined;
  let subServiceShower: SubService | undefined = undefined;

  const currentDate = new Date().toISOString();

  if (serviceVodoinstalacije?.id) {
    try {
      payload.logger.info('Attempting to create Sub-Service: Odmaševanje odtokov');
      subServiceOdtok = await payload.create({
        collection: 'sub_services',
        data: {
          tenant: tenantA1.id,
          title: 'Odmaševanje odtokov',
          parentService: serviceVodoinstalacije.id,
          description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'Hitro in učinkovito odmaševanje vseh vrst odtokov.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
          bulletPoints: [{ point: 'Kuhinjski odtoki' }, { point: 'Kopalniški odtoki' }],
          price: 'Od 80 EUR',
          publishedAt: currentDate,
        },
      });
      payload.logger.info(`Created Sub-Service: ${subServiceOdtok.id} for Service: ${serviceVodoinstalacije.title}`);
    } catch (err) {
      payload.logger.error('Error creating Sub-Service (Odmaševanje odtokov):', err);
    }

    try {
      payload.logger.info('Attempting to create Sub-Service: Menjava pip in ventilov');
      subServicePipe = await payload.create({
        collection: 'sub_services',
        data: {
          tenant: tenantA1.id,
          title: 'Menjava pip in ventilov',
          parentService: serviceVodoinstalacije.id,
          description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'Strokovna menjava vseh vrst pip in ventilov.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
          bulletPoints: [{ point: 'Kuhinjske pipe' }, { point: 'Kopalniške pipe' }, { point: 'Ventili' }],
          price: 'Po dogovoru',
          publishedAt: currentDate,
        },
      });
      payload.logger.info(`Created Sub-Service: ${subServicePipe.id} for Service: ${serviceVodoinstalacije.title}`);
    } catch (err) {
      payload.logger.error('Error creating Sub-Service (Menjava pip in ventilov):', err);
    }
  } else {
    payload.logger.warn('Skipping sub-service creation for Vodoinštalacije as parent service was not created.');
  }

  if (serviceMontaza?.id) {
    try {
      payload.logger.info('Attempting to create Sub-Service: Montaža WC školjke');
      subServiceWC = await payload.create({
        collection: 'sub_services',
        data: {
          tenant: tenantA1.id,
          title: 'Montaža WC školjke',
          parentService: serviceMontaza.id,
          description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'Profesionalna montaža talnih in stenskih WC školjk.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
          bulletPoints: [{ point: 'Talne školjke' }, { point: 'Viseče školjke' }],
          price: 'Od 120 EUR',
          publishedAt: currentDate,
        },
      });
      payload.logger.info(`Created Sub-Service: ${subServiceWC.id} for Service: ${serviceMontaza.title}`);
    } catch (err) {
      payload.logger.error('Error creating Sub-Service (Montaža WC školjke):', err);
    }

    try {
      payload.logger.info('Attempting to create Sub-Service: Montaža tuš kabine');
      subServiceShower = await payload.create({
        collection: 'sub_services',
        data: {
          tenant: tenantA1.id,
          title: 'Montaža tuš kabine',
          parentService: serviceMontaza.id,
          description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'Montaža vseh tipov tuš kabin.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
          bulletPoints: [{ point: 'Klasične tuš kabine' }, { point: 'Walk-in tuši' }],
          price: 'Od 200 EUR',
          publishedAt: currentDate,
        },
      });
      payload.logger.info(`Created Sub-Service: ${subServiceShower.id} for Service: ${serviceMontaza.title}`);
    } catch (err) {
      payload.logger.error('Error creating Sub-Service (Montaža tuš kabine):', err);
    }
  } else {
    payload.logger.warn('Skipping sub-service creation for Montaža sanitarne opreme as parent service was not created.');
  }

  if (subServiceOdtok || subServicePipe || subServiceWC || subServiceShower) {
    payload.logger.info('Sub-Services seeding potentially completed (check logs for errors).');
  } else {
    payload.logger.warn('No Sub-Services were seeded (likely due to missing parent services or errors).');
  }

  return { subServiceOdtok, subServicePipe, subServiceWC, subServiceShower };
}; 