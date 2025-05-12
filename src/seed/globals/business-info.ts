import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';

export const seedBusinessInfo = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq'>): Promise<void> => {
  const { payload, tenantA1, simulatedReq } = args;
  payload.logger.info('--- Seeding BusinessInfo Global ---');

  try {
    payload.logger.info(`Seeding BusinessInfo for tenant ${tenantA1.id}...`);
    await payload.updateGlobal({
      slug: 'business-info',
      data: {
        companyName: 'A1 INŠTALACIJE d.o.o.',
        companyAbout: 'Smo strokovnjaki za vodoinštalacije in montažo sanitarne opreme. Nudimo kakovostne storitve z dolgoletnimi izkušnjami.',
        vatId: 'SI35905875',
        businessId: '12345678', // Placeholder
        registryDate: new Date().toISOString(), // Placeholder
        location: 'Stegne 35, 1000 Ljubljana',
        phoneNumber: '069 653335',
        email: 'info.a1instalacije@gmail.com',
        facebookUrl: 'https://facebook.com/a1instalacije', // Placeholder
        googleReviewUrl: 'https://google.com/maps/place/a1instalacije', // Placeholder
        // logo and logoLight would need media uploads, skipping for basic seed
        leadGenPlatformUrls: [
          { platformName: 'Primerjam.si', url: 'https://primerjam.si/a1instalacije' },
          { platformName: 'MojMojster.net', url: 'https://mojmojster.net/a1instalacije' },
        ],
        coordinates: {
          latitude: 46.0784,
          longitude: 14.4616,
        },
        serviceRadius: 50000,
        metaTitle: 'A1 INŠTALACIJE d.o.o. | Vodoinštalacije Ljubljana',
        metaDescription: 'Profesionalne vodoinštalaterske storitve in montaža sanitarne opreme v Ljubljani in okolici. A1 INŠTALACIJE d.o.o.',
      },
      req: simulatedReq, // Pass simulated request for tenant context
    });
    payload.logger.info(`BusinessInfo seeded for tenant ${tenantA1.id}.`);
  } catch (err) {
    payload.logger.error('Error seeding BusinessInfo global:', err);
  }
}; 