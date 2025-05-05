import type { Block } from 'payload';

const Service: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services Section',
    plural: 'Services Sections',
  },
  fields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Service Cards',
          value: 'service-cards',
        },
        {
          label: 'Big Cards',
          value: 'big-cards',
        },
        {
          label: 'Simple List',
          value: 'simple-list',
        },
        {
          label: 'Simple Card',
          value: 'simple-card',
        },
        {
          label: 'Service Feature Row',
          value: 'service-feature-row',
        },
        {
          label: 'Rounded Cards',
          value: 'rounded-cards',
        },
      ],
      defaultValue: 'default',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
    },
    {
      name: 'selectedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Select Services',
      admin: {
        description: 'Select the services to display in this section.',
      },
    },
    // {
    //   name: 'cta',
    //   type: 'relationship',
    //   hasMany: true,
    //   relationTo: 'ctas',
    //   label: 'Call to Action',
    //   required: false,
    //   admin: {
    //     description: 'Select a call to action button to display in this section.',
    //   },
    // },
    // You might want to add a CTA field specific to the services, like 'View Service Details'
    // {
    //   name: 'serviceCta',
    //   label: 'Service Call to Action Label',
    //   type: 'text',
    //   defaultValue: 'Learn More',
    // },
    // TODO: Consider adding an 'alternateLayout' boolean field here if needed
  ],
}; 

export default Service;