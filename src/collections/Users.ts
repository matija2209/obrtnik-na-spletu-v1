import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels:{
    singular: 'Uporabnik',
    plural: 'Uporabniki',
  },
  auth: {
    useAPIKey: true, // <-- Enable API Keys here!
    // You can add other auth options here if needed:
    // verify: true, // Example: require email verification
    // tokenExpiration: 7200, // Example: 2 hour token expiration
  },
  admin: {
    useAsTitle: 'email', // Show email in the admin list view
    description: 'Uporabniki za prijavo v administracijo.',
  },
  access: {
    // Define who can read, create, update, delete users
    // Example: Allow anyone to create, but only admins or the user themselves to read/update
    create: () => true,
    read: ({ req: { user } }) => !!user, // Allow logged-in users to read users (adjust as needed)
    update: ({ req: { user } }) => !!user, // Allow logged-in users to update users (adjust as needed)
  },
  fields: [
    // Add any custom fields for your users if needed
    // {
    //   name: 'name',
    //   type: 'text',
    // },
    // Payload automatically adds 'email', 'password', 'salt', 'hash', etc. when auth is enabled
    {
        name: 'roles',
        type: 'select',
        hasMany: true,
        defaultValue: ['user'],
        options: ['admin', 'user'],
        // Ensure only admins can edit roles
    }
  ],
} 