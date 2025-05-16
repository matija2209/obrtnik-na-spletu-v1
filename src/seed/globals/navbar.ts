import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';
import { getMenuId, getCtaId } from '../utils'; // Import ID getters
import type { Navbar } from '../../../payload-types'; // Import the collection type

export const seedNavbar = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'mainMenu' | 'ctaKontakt'>): Promise<void> => {
  const { payload, tenantA1, mainMenu, ctaKontakt } = args;
  payload.logger.info('--- Seeding Navbar Collection ---');

  try {
    payload.logger.info(`Checking for existing Navbar data for tenant ${tenantA1.id} (${tenantA1.name})...`);
    const existing = await payload.find({
      collection: 'navbar', // Assuming 'navbar' is the collection slug
      where: {
        tenant: {
          equals: tenantA1.id,
        },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      payload.logger.info(`Navbar data already exists for tenant ${tenantA1.id} (${tenantA1.name}). Skipping seeding.`);
      return;
    }

    payload.logger.info(`Seeding Navbar for tenant ${tenantA1.id} (${tenantA1.name})...`);

    const dataToCreate: Partial<Navbar> & { tenant: string | number; descriptiveName: string } = {
      descriptiveName: `Navbar - ${tenantA1.name}`,
      showLogoImage: true,
      showLogoText: true,
      isTransparent: false,
      isFixed: true,
      tenant: tenantA1.id, // Associate with the tenant
    };

    if (mainMenu) {
      const menuId = getMenuId(mainMenu);
      if (typeof menuId === 'number') {
        dataToCreate.mainMenu = menuId;
      }
    }

    if (ctaKontakt) {
      const ctaId = getCtaId(ctaKontakt);
      if (typeof ctaId === 'number') {
        dataToCreate.mainCta = ctaId;
      }
    }

    await payload.create({
      collection: 'navbar', // Assuming 'navbar' is the collection slug
      data: dataToCreate as any, // Using 'as any' for now, will refine if type errors persist
    });
    payload.logger.info(`Navbar seeded for tenant ${tenantA1.id} (${tenantA1.name}).`);
  } catch (err) {
    payload.logger.error('Error seeding Navbar collection:', err);
  }
}; 