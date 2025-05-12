import type { Payload } from 'payload';
import type { Testimonial } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedTestimonials = async (args: Pick<SeedArgs, 'payload' | 'tenantA1'>): Promise<{ testimonial1?: Testimonial, testimonial2?: Testimonial }> => {
  const { payload, tenantA1 } = args;
  payload.logger.info('--- Seeding Testimonials ---');
  let testimonial1: Testimonial | undefined = undefined;
  let testimonial2: Testimonial | undefined = undefined;

  try {
    payload.logger.info('Attempting to create Testimonial: Ana K.');
    testimonial1 = await payload.create({
      collection: 'testimonials',
      data: {
        tenant: tenantA1.id,
        name: 'Ana K.',
        testimonialDate: new Date('2024-04-15').toISOString(),
        source: 'manual',
        location: 'Ljubljana',
        service: 'Adaptacija kopalnice',
        content: 'Zelo zadovoljni s hitrostjo in kvaliteto izvedbe prenove kopalnice. Priporočam!',
        rating: 5,
      },
    });
    payload.logger.info(`Created Testimonial (Ana K.): ${testimonial1.id}`);
  } catch (err) {
    payload.logger.error('Error creating Testimonial (Ana K.):', err);
  }

  try {
    payload.logger.info('Attempting to create Testimonial: Marko P.');
    testimonial2 = await payload.create({
      collection: 'testimonials',
      data: {
        tenant: tenantA1.id,
        name: 'Marko P.',
        testimonialDate: new Date('2024-05-01').toISOString(),
        source: 'google',
        location: 'Domžale',
        service: 'Menjava vodovodnih cevi',
        content: 'Profesionalen odnos in odlično opravljeno delo. Držali so se dogovorjenih rokov.',
        rating: 5,
      },
    });
    payload.logger.info(`Created Testimonial (Marko P.): ${testimonial2.id}`);
  } catch (err) {
    payload.logger.error('Error creating Testimonial (Marko P.):', err);
  }

  if (testimonial1 && testimonial2) {
    payload.logger.info(`Testimonials seeded: ${testimonial1.id}, ${testimonial2.id}`);
  } else {
    payload.logger.warn('One or more Testimonials failed to seed.');
  }

  return { testimonial1, testimonial2 };
}; 