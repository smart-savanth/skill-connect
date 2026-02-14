CREATE TABLE "community_profiles" (
	"guid" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"short_intro" text NOT NULL,
	"community_help" text NOT NULL,
	"domain" text,
	"instagram_url" text,
	"linkedin_url" text,
	"website_url" text,
	"phone_number" text NOT NULL,
	"profile_image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
