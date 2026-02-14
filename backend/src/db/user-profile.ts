import { pgTable,    text,      timestamp,     uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("community_profiles", {
    guid: uuid("guid").primaryKey(),
    // Core details
    full_name: text("full_name").notNull(),
    short_intro: text("short_intro").notNull(), // max 2 lines handled at validation level
    community_help: text("community_help").notNull(),
    domain : text("domain"),
    // Optional links
    instagram_url: text("instagram_url"),
    linkedin_url: text("linkedin_url"),
    website_url: text("website_url"),
    // Optional contact
    phone_number: text("phone_number").notNull(),
    // Image
    profile_image_url: text("profile_image_url"),
    // Timestamps
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    deleted_at: timestamp("deleted_at"),
});

export type newProfiles = typeof profiles.$inferInsert
export type profiles = typeof profiles.$inferSelect
export type profileTable =  typeof profiles

