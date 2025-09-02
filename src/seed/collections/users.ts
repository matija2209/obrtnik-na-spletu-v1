import type { Tenant, User } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedUsers = async (args: Pick<SeedArgs, 'payload' > & { demoTenant: Tenant }): Promise<{ userForGlobalUpdates: User }> => {
  const { payload, demoTenant } = args;
  payload.logger.info('--- Seeding Users ---');

  // --- Create Super Admin ---
  payload.logger.info('Creating super admin...');
  await payload.create({
    collection: 'users',
    data: {
      email: 'matija@we-hate-copy-pasting.com',
      password: 'Matija113!', // Use a secure default password
      firstName: 'Matija',
      lastName: 'Ziberna',
      roles: ['super-admin'],
    },
  });
  payload.logger.info('Super admin created.');

  // --- Create Tenant A1 User ---
  payload.logger.info('Creating tenant user "miralem" for A1...');
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo-tenant-admin@we-hate-copy-pasting.com',
      password: 'gmb-2025', // Use a secure default password
      firstName: 'Demo Tenant Admin',
      lastName: 'User',
      roles: ['user'],
      tenants: [{ tenant: demoTenant.id, roles: ['tenant-admin'] }],
    },
  });

  await payload.create({
    collection: 'users',
    data: {
      email: 'demo-user@we-hate-copy-pasting.com',
      password: 'gmb-2025', // Use a secure default password
      firstName: 'Demo User',
      lastName: 'User',
      roles: ['user'],
    },
  });
  payload.logger.info('Tenant user "miralem" created.');


  // --- Fetch Tenant User for Global Updates ---
  // Using A1 user for seeding globals related to A1 tenant
  payload.logger.info('Fetching tenant user for global updates...');
  const tenantUserResult = await payload.find({
    collection: 'users',
    where: { email: { equals: 'demo-tenant-admin@we-hate-copy-pasting.com' } },
    limit: 1,
    depth: 1, // Populate relationships like tenants
  });

  if (!tenantUserResult.docs[0]) {
    payload.logger.error('Could not find tenant user to perform global updates.');
    throw new Error('Tenant user demo-tenant-admin@we-hate-copy-pasting.com not found for seeding globals.');
  }
  const userForGlobalUpdates = tenantUserResult.docs[0] as User; // Cast to User type
  payload.logger.info(`Using user ${userForGlobalUpdates.email} for subsequent global seeds.`);

  return { userForGlobalUpdates };
}; 