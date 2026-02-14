"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profiles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.profiles = (0, pg_core_1.pgTable)("community_profiles", {
    guid: (0, pg_core_1.uuid)("guid").primaryKey(),
    // Core details
    full_name: (0, pg_core_1.text)("full_name").notNull(),
    short_intro: (0, pg_core_1.text)("short_intro").notNull(), // max 2 lines handled at validation level
    community_help: (0, pg_core_1.text)("community_help").notNull(),
    domain: (0, pg_core_1.text)("domain"),
    // Optional links
    instagram_url: (0, pg_core_1.text)("instagram_url"),
    linkedin_url: (0, pg_core_1.text)("linkedin_url"),
    website_url: (0, pg_core_1.text)("website_url"),
    // Optional contact
    phone_number: (0, pg_core_1.text)("phone_number").notNull(),
    // Image
    profile_image_url: (0, pg_core_1.text)("profile_image_url"),
    // Timestamps
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    deleted_at: (0, pg_core_1.timestamp)("deleted_at"),
});
