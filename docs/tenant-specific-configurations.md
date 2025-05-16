# How-To: Implement Tenant-Specific "Globals" with @payloadcms/plugin-multi-tenant

Hi there! After spending a few days setting up the @payloadcms/plugin-multi-tenant for a project, I ran into a common challenge: making "global" configurations (like Navbar, Footer, or Business Info) specific to each tenant. If you've tried to use Payload's built-in Globals for this, you probably noticed they aren't tenant-aware out of the box. I quickly discovered that you can't just add globals under the multi-tenant plugin config the way you do with collections. This guide shares what I learned and how you can solve this elegantly!

This guide addresses a common challenge: making global-like configurations (e.g., Navbar, Footer, Business Info) specific to each tenant when using the `@payloadcms/plugin-multi-tenant` in Payload CMS. It assumes you already have the multi-tenant plugin installed and configured for your general collections.

## The Core Problem: True Tenant-Specific Globals

Payload's standard **Globals** are inherently site-wide. When building a multi-tenant application, you need each tenant to have its own distinct version of these settings. The official documentation for `@payloadcms/plugin-multi-tenant` focuses on tenant-scoping for regular collections but might not explicitly detail how to achieve this "global-per-tenant" behavior.

### Common Pitfalls (What Doesn't Work)

You might have tried to adapt standard Globals for multi-tenancy using hooks like `beforeRead` or `afterChange` to filter or modify data based on the current tenant. **These approaches are generally not the intended or effective way to create truly isolated, single-instance configurations per tenant with this plugin.** The plugin is not designed to partition a single Global document among tenants.

### The Correct Approach: Collections are Key

To properly implement tenant-specific "globals," you **must** define them as Payload **Collections**. The `@payloadcms/plugin-multi-tenant` then provides a specific mechanism to make these collections behave as if they were a single, editable configuration for each tenant.

## The Solution: Collections as Tenant-Specific "Globals"

The recommended and supported approach is to:
1. Define your configurations (Navbar, Footer, etc.) as regular Payload **Collections** instead of Globals.
2. Instruct the `@payloadcms/plugin-multi-tenant` to treat these specific collections as "global" for each tenant by using the `isGlobal: true` flag in the plugin's configuration.

**This is a crucial detail that is not always emphasized in the code or docs, so make sure you don't miss it!**

Here's how:

### 1. Define as a Collection

Instead of creating a `GlobalConfig` (e.g., `src/globals/MySettings.ts`), you define a `CollectionConfig` (e.g., `src/collections/MyTenantSettingsCollection.ts`).

**Example: `src/collections/TenantBusinessInfoCollection.ts`**

```typescript
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin'; // Your access control
import type { CollectionConfig } from 'payload';

export const TenantBusinessInfoCollection: CollectionConfig = {
  slug: 'tenant-business-info',
  labels: {
    singular: 'Business Info (Tenant)',
    plural: 'Business Info (Tenants)',
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    read: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess, // Or more restrictive
  },
  admin: {
    description: 'Business information specific to this tenant.',
    group: 'Tenant Configuration',
    useAsTitle: 'companyName', // Or another identifying field
  },
  fields: [
    // Define fields as you would for a Global (e.g., companyName, address, logo)
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    // ... other fields ...
  ],
};
```

**Key points:**
*   The `slug` can be what you would have used for the global.
*   Access controls like `create`, `read`, `update`, `delete` should be set appropriately. Using a custom access control function like `superAdminOrTenantAdminAccess` ensures that only authorized tenant admins or super admins can manage these settings. The multi-tenant plugin will further scope these operations.
*   `admin.useAsTitle` is helpful if a super admin views a list of these configurations.

### 2. Register in `payload.config.ts`

Import your new collection and add it to the `collections` array in your `payload.config.ts`. Remove it from the `globals` array if you were converting an existing Global.

```typescript
// payload.config.ts
import { BusinessInfoCollection } from '@/collections/BusinessInfoCollection';
// ... other imports ...

const allCollections: CollectionConfig[] = [
  // ... other collections ...
  BusinessInfoCollection, // Add your new collection
];

const allGlobals: GlobalConfig[] = [
  // Ensure the old global (if any) is removed from here
];

export default buildConfig({
  // ...
  collections: allCollections.map(addDeployHook), // If you use a deploy hook pattern
  globals: allGlobals.map(addDeployHook),
  // ...
});
```

### 3. Configure in `multiTenantPlugin`

In the `plugins` array of your `payload.config.ts`, find your `multiTenantPlugin` configuration. Add your new collection's slug to the `collections` object within the plugin options, and set `isGlobal: true`.

```typescript
// payload.config.ts
// ... imports ...
import { BusinessInfoCollection } from '@/collections/BusinessInfoCollection'; // Or your collection name

export default buildConfig({
  // ... other config ...
  plugins: [
    // ... other plugins ...
    multiTenantPlugin<Config>({
      // ... other multi-tenant plugin options ...
      collections: {
        // ... other tenant-scoped collections ...
        [BusinessInfoCollection.slug]: { isGlobal: true },
        // Add other collections intended to be tenant-globals here:
        // [TenantNavbarCollection.slug]: { isGlobal: true },
        // [TenantFooterCollection.slug]: { isGlobal: true },
      } as any, // The 'as any' might be used depending on your exact type setup
    }),
  ],
});
```

Setting `isGlobal: true` tells the `@payloadcms/plugin-multi-tenant` to ensure that only one document for this collection can exist per tenant. It handles the underlying logic to make this collection behave like a global from the perspective of a tenant administrator.

> **Tip:** This detail is very important and not always obvious in the code or docs. If you want a collection to behave like a global for each tenant, you must set `isGlobal: true` in the plugin config. [See the official docs for more.](https://payloadcms.com/docs/plugins/multi-tenant#basic-usage)

## Access Control & Data Management

*   **Tenant Scoping:** The multi-tenant plugin automatically handles the association of these "tenant-global" documents with the correct tenant.
*   **Admin UI:** Tenant administrators will typically see an interface to edit their single instance of this configuration. Super administrators might have a view that allows them to select a tenant and then edit its specific configuration, or see a list of all tenant configurations.

## Data Migration for Existing Globals

If you are converting an existing Payload Global to this new tenant-specific collection model:

1.  **Data Loss:** The data from the old global will **not** automatically transfer to the new collection structure.
2.  **Manual/Scripted Migration:** You will need to devise a strategy to migrate the existing global data. This typically involves:
    *   Identifying which tenant the old global data belongs to (if it was meant for a specific one, or if it's a default for new tenants).
    *   Creating a new document in the tenant-specific collection for the relevant tenant(s) and populating it with the old global's data.

This might involve writing a one-time script using Payload's Local API.

> **Personal note:** In my experience, when I created a collection with identical fields to an existing global, the underlying table was correctly migrated and the data persisted without issues. However, it's always a good idea to back up your data before making structural changes, just to be safe!

By following these steps, you can effectively manage configurations that need to be unique per tenant while leveraging the power and convenience of the `@payloadcms/plugin-multi-tenant`.

---

If you found this helpful or would like to see more content like this, let me know! I'm happy to share more tips and guides from my experience working with Payload CMS and multi-tenant setups.