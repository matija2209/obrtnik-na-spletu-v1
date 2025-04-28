import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.pool.query(`
    -- First, check if the enum type exists
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_business_info_lead_gen_platform_urls_platform_name') THEN
        -- Create the enum type if it doesn't exist
        CREATE TYPE enum_business_info_lead_gen_platform_urls_platform_name AS ENUM ('Primerjam.si', 'Omisli.si', 'MojMojster.net');
      END IF;
    END
    $$;

    -- Then perform the column type update if the table exists
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_info_lead_gen_platform_urls') THEN
        -- Convert the platform_name column to use the enum type
        ALTER TABLE business_info_lead_gen_platform_urls 
        ALTER COLUMN platform_name TYPE enum_business_info_lead_gen_platform_urls_platform_name 
        USING platform_name::enum_business_info_lead_gen_platform_urls_platform_name;
      END IF;
    END
    $$;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.pool.query(`
    -- Convert back to text if needed
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_info_lead_gen_platform_urls') THEN
        ALTER TABLE business_info_lead_gen_platform_urls 
        ALTER COLUMN platform_name TYPE text;
      END IF;
    END
    $$;
  `)
} 