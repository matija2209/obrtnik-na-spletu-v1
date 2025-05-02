import type { CollectionConfig } from 'payload';

export const OpeningHours: CollectionConfig = {
  slug: 'opening-hours',
  admin: {
    useAsTitle: 'name',
    description: 'Define different opening hours schedules (e.g., regular, seasonal, emergency).',
    defaultColumns: ['name', 'startDate', 'endDate', 'updatedAt'],
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Schedule Name',
      required: true,
      admin: {
        description: 'E.g., "Regular Hours", "Summer Schedule", "Emergency On-Call"',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Active From',
          admin: {
            description: 'Optional. Schedule is active starting from this date.',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd.MM.yyyy',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Active Until',
          admin: {
            description: 'Optional. Schedule is active until this date.',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd.MM.yyyy',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'dailyHours',
      type: 'array',
      label: 'Daily Hours Rules',
      minRows: 1,
      fields: [
        {
          name: 'days',
          type: 'select',
          label: 'Days of the Week',
          hasMany: true,
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'timeSlots',
          type: 'array',
          label: 'Time Slots',
          required: true,
          minRows: 1,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startTime',
                  type: 'date',
                  required: true,
                  label: 'Start Time',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      timeFormat: 'HH:mm',
                      timeIntervals: 5, // 5-minute intervals
                    },
                    width: '50%',
                  },
                },
                {
                  name: 'endTime',
                  type: 'date',
                  required: true,
                  label: 'End Time',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      timeFormat: 'HH:mm',
                      timeIntervals: 5, // 5-minute intervals
                    },
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Notes',
              admin: {
                description: 'Optional notes for this specific time slot (e.g., "Appointments only")',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'General Notes',
      admin: {
        description: 'Optional general notes for the entire schedule.',
      },
    },
  ],
}; 