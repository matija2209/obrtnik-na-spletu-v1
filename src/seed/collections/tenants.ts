import type { Tenant } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedTenants = async (args: Pick<SeedArgs, 'payload'>): Promise<{ demoTenant: Tenant }> => {
  const { payload } = args;
  payload.logger.info('--- Seeding Tenants ---');

  // --- Create Tenant A1 ---
  payload.logger.info('Creating tenant "demo"...');
  const demoTenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Demo Tenant',
      slug: 'demo',
      domain:"demo.we-hate-copy-pasting.com",
      colors: {
        primary: 'oklch(0.82 0.1663 83.77)',
        primaryForeground: 'oklch(0.985 0 0)',
        secondary: 'oklch(0.32 0.1025 253.89)',
        secondaryForeground: 'oklch(0.98 0.005 0)',
        accent: 'oklch(0.77 0.1687 67.36)',
        accentForeground: 'oklch(0.205 0 0)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0 0)',
      },
      typography: {
        headingFont: {
          name: 'Inter',
          weights: [{ weight: '700' }],
          subsets: [{ subset: 'latin' }],
        },
        bodyFont: {
          name: 'Inter',
          weights: [{ weight: '400' }],
          subsets: [{ subset: 'latin' }],
        },
      },
      radius: '0.625rem',
    },
  });
  payload.logger.info(`Tenant "demo" created with ID: ${demoTenant.id}`);

  return { demoTenant };
}; 