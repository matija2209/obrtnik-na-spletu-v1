import type { Payload } from 'payload';
import type { FaqItem } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedFaqItems = async (args: Pick<SeedArgs, 'payload' | 'tenantA1'>): Promise<{ faq1?: FaqItem, faq2?: FaqItem, faq3?: FaqItem }> => {
  const { payload, tenantA1 } = args;
  payload.logger.info('--- Seeding FAQ Items ---');
  let faq1: FaqItem | undefined = undefined;
  let faq2: FaqItem | undefined = undefined;
  let faq3: FaqItem | undefined = undefined;

  const faqsData = [
    {
      question: 'Kakšen je vaš delovni čas?',
      answerText: 'Naš redni delovni čas je od ponedeljka do petka, od 8:00 do 16:00. Za nujne intervencije smo dosegljivi tudi izven delovnega časa.',
      logName: 'FAQ Item 1',
    },
    {
      question: 'Na katerem območju opravljate storitve?',
      answerText: 'Storitve opravljamo predvsem na območju osrednje Slovenije, vključno z Ljubljano z okolico, Domžalami, Kamnikom in Kranjem. Za večje projekte se lahko dogovorimo tudi za delo izven tega območja.',
      logName: 'FAQ Item 2',
    },
    {
      question: 'Ali nudite garancijo na opravljeno delo?',
      answerText: 'Da, na vse naše storitve in vgrajeni material nudimo ustrezno garancijo.',
      logName: 'FAQ Item 3',
    },
  ];

  try {
    payload.logger.info('Attempting to create FAQ Item 1');
    faq1 = await payload.create({
      collection: 'faq-items',
      data: {
        tenant: tenantA1.id,
        question: faqsData[0].question,
        category: 'general',
        answer: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: faqsData[0].answerText, version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
      },
    });
    payload.logger.info(`Created FAQ Item: ${faq1.id}`);
  } catch (err) {
    payload.logger.error('Error creating FAQ Item 1:', err);
  }

  try {
    payload.logger.info('Attempting to create FAQ Item 2');
    faq2 = await payload.create({
      collection: 'faq-items',
      data: {
        tenant: tenantA1.id,
        question: faqsData[1].question,
        category: 'general',
        answer: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: faqsData[1].answerText, version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
      },
    });
    payload.logger.info(`Created FAQ Item: ${faq2.id}`);
  } catch (err) {
    payload.logger.error('Error creating FAQ Item 2:', err);
  }

  try {
    payload.logger.info('Attempting to create FAQ Item 3');
    faq3 = await payload.create({
      collection: 'faq-items',
      data: {
        tenant: tenantA1.id,
        question: faqsData[2].question,
        category: 'general',
        answer: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: faqsData[2].answerText, version: 1 }], version: 1 }], direction: null, format: '', indent: 0, version: 1 } },
      },
    });
    payload.logger.info(`Created FAQ Item: ${faq3.id}`);
  } catch (err) {
    payload.logger.error('Error creating FAQ Item 3:', err);
  }

  if (faq1 && faq2 && faq3) {
    payload.logger.info(`FAQ Items seeded: ${faq1.id}, ${faq2.id}, ${faq3.id}`);
  } else {
    payload.logger.warn('One or more FAQ Items failed to seed.');
  }

  return { faq1, faq2, faq3 };
}; 