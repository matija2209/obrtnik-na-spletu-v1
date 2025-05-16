import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';
import type { BusinessInfo } from '../../../payload-types'; // Import the collection type

export const seedBusinessInfo = async (args: Pick<SeedArgs, 'payload' | 'tenantA1'>): Promise<void> => {
  const { payload, tenantA1 } = args;
  payload.logger.info('--- Seeding BusinessInfo Collection for Tenant A1 ---');

  try {
    payload.logger.info(`Checking for existing BusinessInfo for tenant ${tenantA1.id}...`);
    const existing = await payload.find({
      collection: 'business-info',
      where: {
        tenant: {
          equals: tenantA1.id,
        },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      payload.logger.info(`BusinessInfo already exists for tenant ${tenantA1.id}. Skipping seeding for this tenant.`);
      return;
    }

    payload.logger.info(`Seeding BusinessInfo for tenant ${tenantA1.id}...`);
    await payload.create({
      collection: 'business-info',
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
        tenant: tenantA1.id, // Associate with the tenant
      },
    });
    payload.logger.info(`BusinessInfo collection entry seeded for tenant ${tenantA1.id}.`);
  } catch (err) {
    payload.logger.error('Error seeding BusinessInfo collection:', err);
  }
}; 