"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_profile_1 = require("./db/user-profile");
const dbCon_1 = require("./db/dbCon");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const profilePictureUpload_1 = require("./profilePictureUpload");
const userRouter = express_1.default.Router();
userRouter.post("/saveProfile", async (req, res, next) => {
    try {
        let data = req.body;
        data.guid = (0, uuid_1.v4)();
        const profile = await dbCon_1.db.insert(user_profile_1.profiles).values(data).returning();
        if (!profile) {
            throw new Error("Error saving profile");
        }
        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Profile saved successfully",
            data: profile
        });
    }
    catch (error) {
        next(error);
    }
});
userRouter.post("/getAllProfile", async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10 } = req.body;
        const body = req.body;
        let whereConditions = [
            (0, drizzle_orm_1.isNull)(user_profile_1.profiles.deleted_at),
        ];
        if (body.searchString?.trim()) {
            whereConditions = [
                (0, drizzle_orm_1.isNull)(user_profile_1.profiles.deleted_at),
            ];
            // search across multiple fields INCLUDING domain
            if (body.searchString?.trim()) {
                const search = `%${body.searchString.trim()}%`;
                whereConditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(user_profile_1.profiles.full_name, search), (0, drizzle_orm_1.ilike)(user_profile_1.profiles.short_intro, search), (0, drizzle_orm_1.ilike)(user_profile_1.profiles.community_help, search), (0, drizzle_orm_1.ilike)(user_profile_1.profiles.domain, search) // 👈 added here
                ));
            }
        }
        const [records, Count] = await Promise.all([
            dbCon_1.db.select().from(user_profile_1.profiles).offset((page - 1) * pageSize).limit(pageSize).orderBy((0, drizzle_orm_1.desc)(user_profile_1.profiles.guid)).where((0, drizzle_orm_1.and)(...whereConditions)),
            dbCon_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(user_profile_1.profiles).where((0, drizzle_orm_1.and)(...whereConditions))
        ]);
        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Fetched all profiles Successfully ",
            data: records,
            Total: Count[0].count
        });
    }
    catch (error) {
        next(error);
    }
});
userRouter.get("/getProfile/:guid", async (req, res, next) => {
    try {
        const guid = req.params.guid;
        const profile = await dbCon_1.db.select().from(user_profile_1.profiles).where((0, drizzle_orm_1.eq)(user_profile_1.profiles.guid, guid));
        if (!profile) {
            throw new Error("Profile not found");
        }
        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Fetched profile Successfully ",
            data: profile
        });
    }
    catch (error) {
        next(error);
    }
});
userRouter.post("/:userId/upload-profile-picture", profilePictureUpload_1.uploadUserProfile.single("profile_picture"), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const imagePath = `/profilePictures/${req.file.filename}`;
        const user = dbCon_1.db.update(user_profile_1.profiles)
            .set({ profile_image_url: imagePath })
            .where((0, drizzle_orm_1.eq)(user_profile_1.profiles.guid, req.params.userId))
            .returning();
        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Profile picture updated successfully",
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = userRouter;
