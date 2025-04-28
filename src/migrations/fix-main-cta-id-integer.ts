import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.pool.query(`
    -- Find the table containing main_cta_id column
    DO $$
    DECLARE
      table_with_column text;
    BEGIN
      SELECT table_name INTO table_with_column
      FROM information_schema.columns
      WHERE column_name = 'main_cta_id'
      AND table_schema = 'public'
      LIMIT 1;
      
      IF table_with_column IS NOT NULL THEN
        -- First drop the default constraint if it exists
        EXECUTE format('ALTER TABLE %I ALTER COLUMN main_cta_id DROP DEFAULT', table_with_column);
        
        -- Then convert the column type to integer
        EXECUTE format('ALTER TABLE %I ALTER COLUMN main_cta_id TYPE integer USING main_cta_id::integer', table_with_column);
        
        -- Set a new default if needed (using NULL as a safe default)
        EXECUTE format('ALTER TABLE %I ALTER COLUMN main_cta_id SET DEFAULT NULL', table_with_column);
      END IF;
    END
    $$;
  `)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.pool.query(`
    -- Convert back to text if needed
    DO $$
    DECLARE
      table_with_column text;
    BEGIN
      SELECT table_name INTO table_with_column
      FROM information_schema.columns
      WHERE column_name = 'main_cta_id'
      AND table_schema = 'public'
      LIMIT 1;
      
      IF table_with_column IS NOT NULL THEN
        -- First drop the default constraint
        EXECUTE format('ALTER TABLE %I ALTER COLUMN main_cta_id DROP DEFAULT', table_with_column);
        
        -- Then convert back to text
        EXECUTE format('ALTER TABLE %I ALTER COLUMN main_cta_id TYPE text', table_with_column);
        
        -- Set a text default if needed (empty string is a safe default for text)
        EXECUTE format('ALTER TABLE %I ALTER COLUMN main_cta_id SET DEFAULT NULL', table_with_column);
      END IF;
    END
    $$;
  `)
} 