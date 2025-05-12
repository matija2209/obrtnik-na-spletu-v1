import type { Payload } from 'payload';
import type { Form } from '../../../payload-types';
import type { SeedArgs } from '../utils';

export const seedForms = async (args: Pick<SeedArgs, 'payload' | 'tenantA1' | 'simulatedReq'>): Promise<{ contactForm?: Form, defaultSiteContactForm?: Form }> => {
  const { payload, tenantA1, simulatedReq } = args;
  payload.logger.info('--- Seeding Forms ---');
  let contactForm: Form | undefined = undefined;
  let defaultSiteContactForm: Form | undefined = undefined;

  const commonFormFields = [
    {
      name: 'name',
      label: 'Ime in Priimek',
      blockType: 'text' as 'text', // Ensure literal type
      required: true,
      width: 100,
    },
    {
      name: 'email',
      label: 'Vaš Email Naslov',
      blockType: 'email' as 'email',
      required: true,
      width: 100,
    },
    {
      name: 'message',
      label: 'Sporočilo',
      blockType: 'textarea' as 'textarea',
      required: true,
      width: 100,
    },
    {
      name: 'privacyConsent',
      label: 'Strinjam se s politiko zasebnosti in obdelavo osebnih podatkov.',
      blockType: 'checkbox' as 'checkbox',
      required: true,
      width: 100,
    },
  ];

  const commonEmailConfig = [
    {
      emailTo: '{{tenant.email}}',
      emailFrom: '{{field.email}}',
      subject: 'Novo sporočilo preko spletne strani',
      message: {
        root: {
          type: 'root',
          children: [
            { type: 'p', children: [{ text: 'Prejeli ste novo sporočilo:' }], version: 1 },
            { type: 'p', children: [{ text: 'Ime: {{field.name}}' }], version: 1 },
            { type: 'p', children: [{ text: 'Email: {{field.email}}' }], version: 1 },
            { type: 'p', children: [{ text: 'Sporočilo: {{field.message}}' }], version: 1 },
          ],
          direction: null as null | 'ltr' | 'rtl', // Added type for direction
          format: '' as 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '', // Added type for format
          indent: 0,
          version: 1,
        }
      }
    }
  ];

  const commonConfirmationMessage = {
    root: {
      type: 'root',
      children: [{ type: 'p', children: [{ text: 'Hvala za vaše sporočilo! Odgovorili vam bomo v najkrajšem možnem času.' }], version: 1 }],
      direction: null as null | 'ltr' | 'rtl',
      format: '' as 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '',
      indent: 0,
      version: 1,
    }
  };

  // Seed A1 Specific Contact Form
  try {
    payload.logger.info('Attempting to create Form: Stopite v stik (A1 Specifični)');
    contactForm = await payload.create({
      collection: 'forms',
      data: {
        tenant: tenantA1.id,
        title: 'Stopite v stik',
        submitButtonLabel: 'Pošlji sporočilo',
        confirmationType: 'message',
        confirmationMessage: commonConfirmationMessage,
        fields: commonFormFields,
        emails: commonEmailConfig,
      },
      req: simulatedReq,
    });
    payload.logger.info(`Created Form (A1 Specific): ${contactForm.id}`);
  } catch (err) {
    payload.logger.error('Error creating Form (A1 Specific):', err);
  }

  // Seed Default Website Contact Form
  try {
    payload.logger.info('Attempting to create Form: Default Website Contact Form');
    defaultSiteContactForm = await payload.create({
      collection: 'forms',
      data: {
        tenant: tenantA1.id, // Also for tenant A1, but can be reused or adapted
        title: 'Default Website Contact Form',
        submitButtonLabel: 'Pošlji sporočilo',
        confirmationType: 'message',
        confirmationMessage: commonConfirmationMessage,
        fields: commonFormFields,
        emails: commonEmailConfig,
      },
      req: simulatedReq,
    });
    payload.logger.info(`Created Default Website Contact Form: ${defaultSiteContactForm.id}`);
  } catch (err) {
    payload.logger.error('Error creating Default Website Contact Form:', err);
  }

  if (contactForm || defaultSiteContactForm) {
    payload.logger.info('Forms seeding potentially completed (check logs for errors).');
  } else {
    payload.logger.warn('No Forms were seeded.');
  }

  return { contactForm, defaultSiteContactForm };
}; 