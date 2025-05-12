import type { Payload } from 'payload';
import type { SeedArgs } from '../utils';
import { getMenuId, getCtaId } from '../utils'; // Import ID getters

export const seedNavbar = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq' | 'mainMenu' | 'ctaKontakt'>): Promise<void> => {
  const { payload, tenantA1, simulatedReq, mainMenu, ctaKontakt } = args;
  payload.logger.info('--- Seeding Navbar Global ---');

  try {
    payload.logger.info(`Seeding Navbar for tenant ${tenantA1.id}...`);
    await payload.updateGlobal({
      slug: 'navbar',
      data: {
        ...(mainMenu ? { mainMenu: getMenuId(mainMenu) } : {}), // Use helper
        ...(ctaKontakt ? { mainCta: getCtaId(ctaKontakt) } : {}), // Use helper
        showLogoImage: true,
        showLogoText: true,
        isTransparent: false,
        isFixed: true,
      },
      req: simulatedReq, // Pass simulated request for tenant context
    });
    payload.logger.info(`Navbar seeded for tenant ${tenantA1.id}.`);
  } catch (err) {
    payload.logger.error('Error seeding Navbar global:', err);
    // Consider re-throwing if this is critical
  }
}; 