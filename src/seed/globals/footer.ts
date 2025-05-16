import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';
import { getMenuId } from '../utils'; // Import ID getter
import type { Footer } from '../../../payload-types'; // Import the collection type

export const seedFooter = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'footerMenu' | 'socialMenu'>): Promise<void> => {
  const { payload, tenantA1, footerMenu, socialMenu } = args;
  payload.logger.info('--- Seeding Footer Collection ---');

  try {
    payload.logger.info(`Checking for existing Footer data for tenant ${tenantA1.id} (${tenantA1.name})...`);
    const existing = await payload.find({
      collection: 'footer', // Assuming 'footer' is the collection slug
      where: {
        tenant: {
          equals: tenantA1.id,
        },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      payload.logger.info(`Footer data already exists for tenant ${tenantA1.id} (${tenantA1.name}). Skipping seeding.`);
      return;
    }

    payload.logger.info(`Seeding Footer for tenant ${tenantA1.id} (${tenantA1.name})...`);

    const menuSectionsData: Footer['menuSections'] = [];
    if (footerMenu) {
      const menuId = getMenuId(footerMenu);
      if (typeof menuId === 'number') {
        menuSectionsData.push({ blockType: 'menuSection' as const, menu: menuId });
      }
    }
    if (socialMenu) {
      const menuId = getMenuId(socialMenu);
      if (typeof menuId === 'number') {
        menuSectionsData.push({ blockType: 'menuSection' as const, title: 'Povezave', menu: menuId });
      }
    }

    await payload.create({ 
      collection: 'footer', 
      data: {

        copyrightText: '© {{year}} A1 INŠTALACIJE d.o.o. Vse pravice pridržane.',
        menuSections: menuSectionsData,
        ...(socialMenu && typeof getMenuId(socialMenu) === 'number' ? { socialMenu: getMenuId(socialMenu) } : {}),
        showContactInFooter: true,
        showLogoText: true,
        tenant: tenantA1.id, 
      },
    });
    payload.logger.info(`Footer seeded for tenant ${tenantA1.id} (${tenantA1.name}).`);
  } catch (err) {
    payload.logger.error('Error seeding Footer collection:', err);
  }
}; 