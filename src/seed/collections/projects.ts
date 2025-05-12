import type { Payload } from 'payload';
import type { Project } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedProjects = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'serviceVodoinstalacije' | 'testimonial1'>): Promise<{ projectAdaptacija?: Project, projectNovogradnja?: Project }> => {
  const { payload, tenantA1, serviceVodoinstalacije, testimonial1 } = args;
  payload.logger.info('--- Seeding Projects ---');
  let projectAdaptacija: Project | undefined = undefined;
  let projectNovogradnja: Project | undefined = undefined;

  const servicesPerformedAdaptacija = [serviceVodoinstalacije?.id].filter(Boolean) as number[];
  const relatedTestimonialsAdaptacija = [testimonial1?.id].filter(Boolean) as number[];

  try {
    payload.logger.info('Attempting to create Project: Adaptacija kopalnice Novak');
    projectAdaptacija = await payload.create({
      collection: 'projects',
      data: {
        tenant: tenantA1.id,
        title: 'Adaptacija kopalnice Novak',
        description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'Celovita prenova kopalnice v stanovanju družine Novak.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
        projectStatus: 'completed',
        location: 'Ljubljana',
        metadata: {
          startDate: new Date('2023-09-01').toISOString(),
          completionDate: new Date('2023-10-15').toISOString(),
          client: 'Družina Novak',
          budget: '10000 EUR',
        },
        tags: [{ tag: 'Adaptacija' }, { tag: 'Kopalnica' }],
        servicesPerformed: servicesPerformedAdaptacija,
        relatedTestimonials: relatedTestimonialsAdaptacija,
        // projectImages will be updated later
      },
    });
    payload.logger.info(`Created Project (Adaptacija kopalnice Novak): ${projectAdaptacija.id}`);
  } catch (err) {
    payload.logger.error('Error creating Project (Adaptacija kopalnice Novak):', err);
  }

  const servicesPerformedNovogradnja = [serviceVodoinstalacije?.id].filter(Boolean) as number[];

  try {
    payload.logger.info('Attempting to create Project: Novogradnja hiše Podlipnik');
    projectNovogradnja = await payload.create({
      collection: 'projects',
      data: {
        tenant: tenantA1.id,
        title: 'Novogradnja hiše Podlipnik',
        description: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'Izvedba vseh vodovodnih inštalacij v novozgrajeni enodružinski hiši.', version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
        projectStatus: 'completed',
        location: 'Domžale',
        metadata: {
          completionDate: new Date('2024-01-20').toISOString(),
          client: 'Gospod Podlipnik',
        },
        tags: [{ tag: 'Novogradnja' }, { tag: 'Hiša' }],
        servicesPerformed: servicesPerformedNovogradnja,
        // projectImages will be updated later
      },
    });
    payload.logger.info(`Created Project (Novogradnja hiše Podlipnik): ${projectNovogradnja.id}`);
  } catch (err) {
    payload.logger.error('Error creating Project (Novogradnja hiše Podlipnik):', err);
  }

  if (projectAdaptacija && projectNovogradnja) {
    payload.logger.info(`Projects seeded: ${projectAdaptacija.id}, ${projectNovogradnja.id}`);
  } else {
    payload.logger.warn('One or more Projects failed to seed.');
  }

  return { projectAdaptacija, projectNovogradnja };
}; 