import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('sl');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_ctas_cta_type" AS ENUM('primary', 'secondary', 'destructive', 'outline', 'ghost', 'link', 'icon');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'in-progress', 'completed');
  CREATE TYPE "public"."enum_business_info_lead_gen_platform_urls_platform_name" AS ENUM('Primerjam.si', 'Omisli.si', 'MojMojster.net');
  CREATE TYPE "public"."enum_navbar_nav_items_children_icon" AS ENUM('Sparkles', 'Zap', 'Drop', 'Hands', 'Footprints', 'Paintbrush');
  CREATE TABLE IF NOT EXISTS "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "projects_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt_text" varchar DEFAULT ''
  );
  
  CREATE TABLE IF NOT EXISTS "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar DEFAULT '' NOT NULL,
  	"description" varchar DEFAULT '',
  	"location" varchar DEFAULT '',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"service_id" varchar,
  	"image_id" integer,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"time" varchar,
  	"location" varchar,
  	"service" varchar,
  	"rating" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "testimonials_locales" (
  	"content" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "faq_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "ctas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"cta_href" varchar NOT NULL,
  	"cta_classname" varchar,
  	"cta_type" "enum_ctas_cta_type" DEFAULT 'primary',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "ctas_locales" (
  	"cta_text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"service_id" integer NOT NULL,
  	"location" varchar NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "machinery_specifications_spec_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "machinery_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"spec_name" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "machinery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"tab_name" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tenants_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"services_id" integer,
  	"testimonials_id" integer,
  	"faq_items_id" integer,
  	"ctas_id" integer,
  	"inquiries_id" integer,
  	"machinery_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "business_info_lead_gen_platform_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform_name" "enum_business_info_lead_gen_platform_urls_platform_name" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "business_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"company_about" varchar NOT NULL,
  	"vat_id" varchar NOT NULL,
  	"business_id" varchar NOT NULL,
  	"registry_date" timestamp(3) with time zone NOT NULL,
  	"location" varchar NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"facebook_url" varchar,
  	"google_review_url" varchar,
  	"logo_id" integer NOT NULL,
  	"logo_light_id" integer,
  	"coordinates_latitude" numeric DEFAULT 46.2191697 NOT NULL,
  	"coordinates_longitude" numeric DEFAULT 15.4705641 NOT NULL,
  	"service_radius" numeric NOT NULL,
  	"meta_title" varchar NOT NULL,
  	"meta_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "navbar_nav_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"icon" "enum_navbar_nav_items_children_icon"
  );
  
  CREATE TABLE IF NOT EXISTS "navbar_nav_items_children_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "navbar_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"has_children" boolean DEFAULT false,
  	"href" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "navbar_nav_items_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "navbar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"main_cta_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_hero_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_about_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_about_benefits_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_service_area_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_service_area_locations_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_contact_working_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"hours" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"project_highlights_button_href" varchar DEFAULT '/projekti',
  	"about_image_id" integer NOT NULL,
  	"about_cta_id" integer,
  	"testimonials_cta_id" integer,
  	"gallery_button_href" varchar DEFAULT '/galerija',
  	"service_area_map_image_id" integer NOT NULL,
  	"contact_phone_number" varchar NOT NULL,
  	"contact_address" varchar NOT NULL,
  	"faq_default_open_item_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_locales" (
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar,
  	"services_title" varchar NOT NULL,
  	"services_description" varchar,
  	"machinery_title" varchar DEFAULT 'Naš Vozni Park' NOT NULL,
  	"machinery_description" varchar DEFAULT 'Ponudba gradbene mehanizacije za najem',
  	"project_highlights_title" varchar NOT NULL,
  	"project_highlights_description" varchar,
  	"project_highlights_button_text" varchar,
  	"about_title" varchar NOT NULL,
  	"about_description" varchar NOT NULL,
  	"testimonials_title" varchar NOT NULL,
  	"gallery_title" varchar NOT NULL,
  	"gallery_description" varchar,
  	"gallery_button_text" varchar,
  	"service_area_title" varchar NOT NULL,
  	"service_area_description" varchar NOT NULL,
  	"service_area_additional_info" varchar,
  	"contact_title" varchar NOT NULL,
  	"contact_description" varchar,
  	"faq_title" varchar NOT NULL,
  	"faq_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"ctas_id" integer,
  	"services_id" integer,
  	"machinery_id" integer,
  	"projects_id" integer,
  	"testimonials_id" integer,
  	"media_id" integer,
  	"faq_items_id" integer
  );
  
  DO $$ BEGIN
   ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "projects_images" ADD CONSTRAINT "projects_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "projects_images" ADD CONSTRAINT "projects_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "projects" ADD CONSTRAINT "projects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services" ADD CONSTRAINT "services_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "faq_items_locales" ADD CONSTRAINT "faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "ctas" ADD CONSTRAINT "ctas_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "ctas_locales" ADD CONSTRAINT "ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ctas"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "machinery_specifications_spec_details" ADD CONSTRAINT "machinery_specifications_spec_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."machinery_specifications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "machinery_specifications" ADD CONSTRAINT "machinery_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."machinery"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "machinery" ADD CONSTRAINT "machinery_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "machinery" ADD CONSTRAINT "machinery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ctas_fk" FOREIGN KEY ("ctas_id") REFERENCES "public"."ctas"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_machinery_fk" FOREIGN KEY ("machinery_id") REFERENCES "public"."machinery"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_info_lead_gen_platform_urls" ADD CONSTRAINT "business_info_lead_gen_platform_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_info"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_info" ADD CONSTRAINT "business_info_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "business_info" ADD CONSTRAINT "business_info_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navbar_nav_items_children" ADD CONSTRAINT "navbar_nav_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navbar_nav_items_children_locales" ADD CONSTRAINT "navbar_nav_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_nav_items_children"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navbar_nav_items" ADD CONSTRAINT "navbar_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navbar_nav_items_locales" ADD CONSTRAINT "navbar_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "navbar" ADD CONSTRAINT "navbar_main_cta_id_ctas_id_fk" FOREIGN KEY ("main_cta_id") REFERENCES "public"."ctas"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_hero_features" ADD CONSTRAINT "home_page_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_hero_features_locales" ADD CONSTRAINT "home_page_hero_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hero_features"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_about_benefits" ADD CONSTRAINT "home_page_about_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_about_benefits_locales" ADD CONSTRAINT "home_page_about_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_about_benefits"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_service_area_locations" ADD CONSTRAINT "home_page_service_area_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_service_area_locations_locales" ADD CONSTRAINT "home_page_service_area_locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_service_area_locations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_contact_working_hours" ADD CONSTRAINT "home_page_contact_working_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_cta_id_ctas_id_fk" FOREIGN KEY ("about_cta_id") REFERENCES "public"."ctas"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page" ADD CONSTRAINT "home_page_testimonials_cta_id_ctas_id_fk" FOREIGN KEY ("testimonials_cta_id") REFERENCES "public"."ctas"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page" ADD CONSTRAINT "home_page_service_area_map_image_id_media_id_fk" FOREIGN KEY ("service_area_map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page" ADD CONSTRAINT "home_page_faq_default_open_item_id_faq_items_id_fk" FOREIGN KEY ("faq_default_open_item_id") REFERENCES "public"."faq_items"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_ctas_fk" FOREIGN KEY ("ctas_id") REFERENCES "public"."ctas"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_machinery_fk" FOREIGN KEY ("machinery_id") REFERENCES "public"."machinery"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_faq_items_fk" FOREIGN KEY ("faq_items_id") REFERENCES "public"."faq_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX IF NOT EXISTS "projects_images_order_idx" ON "projects_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "projects_images_parent_id_idx" ON "projects_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "projects_images_image_idx" ON "projects_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "projects_tenant_idx" ON "projects" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_features_locale_idx" ON "services_features" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "services_tenant_idx" ON "services" USING btree ("tenant_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "services_service_id_idx" ON "services" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "testimonials_tenant_idx" ON "testimonials" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "faq_items_tenant_idx" ON "faq_items" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "faq_items_updated_at_idx" ON "faq_items" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "faq_items_created_at_idx" ON "faq_items" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "faq_items_locales_locale_parent_id_unique" ON "faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "ctas_tenant_idx" ON "ctas" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "ctas_updated_at_idx" ON "ctas" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "ctas_created_at_idx" ON "ctas" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "ctas_locales_locale_parent_id_unique" ON "ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "inquiries_tenant_idx" ON "inquiries" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "inquiries_service_idx" ON "inquiries" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "machinery_specifications_spec_details_order_idx" ON "machinery_specifications_spec_details" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "machinery_specifications_spec_details_parent_id_idx" ON "machinery_specifications_spec_details" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "machinery_specifications_order_idx" ON "machinery_specifications" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "machinery_specifications_parent_id_idx" ON "machinery_specifications" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "machinery_tenant_idx" ON "machinery" USING btree ("tenant_id");
  CREATE INDEX IF NOT EXISTS "machinery_image_idx" ON "machinery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "machinery_updated_at_idx" ON "machinery" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "machinery_created_at_idx" ON "machinery" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_faq_items_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_items_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ctas_id_idx" ON "payload_locked_documents_rels" USING btree ("ctas_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_machinery_id_idx" ON "payload_locked_documents_rels" USING btree ("machinery_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "business_info_lead_gen_platform_urls_order_idx" ON "business_info_lead_gen_platform_urls" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "business_info_lead_gen_platform_urls_parent_id_idx" ON "business_info_lead_gen_platform_urls" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "business_info_logo_idx" ON "business_info" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "business_info_logo_light_idx" ON "business_info" USING btree ("logo_light_id");
  CREATE INDEX IF NOT EXISTS "navbar_nav_items_children_order_idx" ON "navbar_nav_items_children" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navbar_nav_items_children_parent_id_idx" ON "navbar_nav_items_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "navbar_nav_items_children_locales_locale_parent_id_unique" ON "navbar_nav_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "navbar_nav_items_order_idx" ON "navbar_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "navbar_nav_items_parent_id_idx" ON "navbar_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "navbar_nav_items_locales_locale_parent_id_unique" ON "navbar_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "navbar_main_cta_idx" ON "navbar" USING btree ("main_cta_id");
  CREATE INDEX IF NOT EXISTS "home_page_hero_features_order_idx" ON "home_page_hero_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_hero_features_parent_id_idx" ON "home_page_hero_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "home_page_hero_features_locales_locale_parent_id_unique" ON "home_page_hero_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_benefits_order_idx" ON "home_page_about_benefits" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_about_benefits_parent_id_idx" ON "home_page_about_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "home_page_about_benefits_locales_locale_parent_id_unique" ON "home_page_about_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_service_area_locations_order_idx" ON "home_page_service_area_locations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_service_area_locations_parent_id_idx" ON "home_page_service_area_locations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "home_page_service_area_locations_locales_locale_parent_id_unique" ON "home_page_service_area_locations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_contact_working_hours_order_idx" ON "home_page_contact_working_hours" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_page_contact_working_hours_parent_id_idx" ON "home_page_contact_working_hours" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_image_idx" ON "home_page" USING btree ("about_image_id");
  CREATE INDEX IF NOT EXISTS "home_page_about_cta_idx" ON "home_page" USING btree ("about_cta_id");
  CREATE INDEX IF NOT EXISTS "home_page_testimonials_cta_idx" ON "home_page" USING btree ("testimonials_cta_id");
  CREATE INDEX IF NOT EXISTS "home_page_service_area_map_image_idx" ON "home_page" USING btree ("service_area_map_image_id");
  CREATE INDEX IF NOT EXISTS "home_page_faq_default_open_item_idx" ON "home_page" USING btree ("faq_default_open_item_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "home_page_rels_ctas_id_idx" ON "home_page_rels" USING btree ("ctas_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_services_id_idx" ON "home_page_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_machinery_id_idx" ON "home_page_rels" USING btree ("machinery_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_projects_id_idx" ON "home_page_rels" USING btree ("projects_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_testimonials_id_idx" ON "home_page_rels" USING btree ("testimonials_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_media_id_idx" ON "home_page_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "home_page_rels_faq_items_id_idx" ON "home_page_rels" USING btree ("faq_items_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tenants" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "projects_images" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "faq_items" CASCADE;
  DROP TABLE "faq_items_locales" CASCADE;
  DROP TABLE "ctas" CASCADE;
  DROP TABLE "ctas_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "machinery_specifications_spec_details" CASCADE;
  DROP TABLE "machinery_specifications" CASCADE;
  DROP TABLE "machinery" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "business_info_lead_gen_platform_urls" CASCADE;
  DROP TABLE "business_info" CASCADE;
  DROP TABLE "navbar_nav_items_children" CASCADE;
  DROP TABLE "navbar_nav_items_children_locales" CASCADE;
  DROP TABLE "navbar_nav_items" CASCADE;
  DROP TABLE "navbar_nav_items_locales" CASCADE;
  DROP TABLE "navbar" CASCADE;
  DROP TABLE "home_page_hero_features" CASCADE;
  DROP TABLE "home_page_hero_features_locales" CASCADE;
  DROP TABLE "home_page_about_benefits" CASCADE;
  DROP TABLE "home_page_about_benefits_locales" CASCADE;
  DROP TABLE "home_page_service_area_locations" CASCADE;
  DROP TABLE "home_page_service_area_locations_locales" CASCADE;
  DROP TABLE "home_page_contact_working_hours" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_ctas_cta_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_business_info_lead_gen_platform_urls_platform_name";
  DROP TYPE "public"."enum_navbar_nav_items_children_icon";`)
}
