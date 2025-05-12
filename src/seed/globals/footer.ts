import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';
import { getMenuId } from '../utils'; // Import ID getter

export const seedFooter = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq' | 'footerMenu' | 'socialMenu'>): Promise<void> => {
  const { payload, tenantA1, simulatedReq, footerMenu, socialMenu } = args;
  payload.logger.info('--- Seeding Footer Global ---');

  try {
    payload.logger.info(`Seeding Footer for tenant ${tenantA1.id}...`);
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        copyrightText: '© {{year}} A1 INŠTALACIJE d.o.o. Vse pravice pridržane.',
        menuSections: [
          ...(footerMenu ? [{ blockType: 'menuSection' as const, menu: getMenuId(footerMenu) }] : []),
          ...(socialMenu ? [{ blockType: 'menuSection' as const, title: 'Povezave', menu: getMenuId(socialMenu) }] : []),
        ],
        ...(socialMenu ? { socialMenu: getMenuId(socialMenu) } : {}), // Use helper
        showContactInFooter: true,
        showLogoText: true,
      },
      req: simulatedReq, // Pass simulated request for tenant context
    });
    payload.logger.info(`Footer seeded for tenant ${tenantA1.id}.`);
  } catch (err) {
    payload.logger.error('Error seeding Footer global:', err);
  }
}; 