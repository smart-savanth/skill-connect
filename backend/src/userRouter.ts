import express, { Request, Response, NextFunction } from "express"
import { profiles } from "./db/user-profile"
import { db } from "./db/dbCon"
import { and, count, isNull, desc, eq, ilike, or } from "drizzle-orm"
import { v4 } from "uuid"
import { uploadUserProfile } from "./profilePictureUpload"
import { appConfig } from "./config/appConfig"



const userRouter = express.Router()

userRouter.post("/saveProfile", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data = req.body
        data.guid = v4()
        
        const profile = await db.insert(profiles).values(data).returning();
        if (!profile) {
            throw new Error("Error saving profile")
        }
        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Profile saved successfully",
            data: profile
        }
        )
    } catch (error) {
        next(error)
    }
})

userRouter.post("/getAllProfile", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, pageSize = 10 } = req.body;
        const body = req.body
        let whereConditions: any = [
            isNull(profiles.deleted_at),
        ];
        if (body.searchString?.trim()) {
            whereConditions = [
                isNull(profiles.deleted_at),
            ];
            // search across multiple fields INCLUDING domain
            if (body.searchString?.trim()) {
                const search = `%${body.searchString.trim()}%`;

                whereConditions.push(
                    or(
                        ilike(profiles.full_name, search),
                        ilike(profiles.short_intro, search),
                        ilike(profiles.community_help, search),
                        ilike(profiles.domain, search) // 👈 added here
                    )
                );
            }
        }
        const [records, Count] = await Promise.all([
            db.select().from(profiles).offset((page - 1) * pageSize).limit(pageSize).orderBy(desc(profiles.guid)).where(and(...whereConditions)),
            db.select({ count: count() }).from(profiles).where(and(...whereConditions))
        ]);

        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Fetched all profiles Successfully ",
            data: records,
            Total: Count[0].count
        })
    } catch (error) {
        next(error)
    }
})

userRouter.get("/getProfile/:guid", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const guid = req.params.guid as string 
        const profile = await db.select().from(profiles).where(eq(profiles.guid, guid))
        if (!profile) {
            throw new Error("Profile not found")
        }
        return res.status(200).json({
            status: 200,
            success: true,
            msg: "Fetched profile Successfully ",
            data: profile
        })
    } catch (error) {
        next(error)
    }
})

userRouter.post("/:userId/upload-profile-picture",
  uploadUserProfile.single("profile_picture"),
  async (req: Request, res: Response, next: NextFunction) => {
   try {
          if (!req.file) {
            throw new Error("No file uploaded");
          }

          const imagePath = `${appConfig.baseURL}/profilePictures/${req.file.filename}`;
          const user = db.update(profiles)
            .set({ profile_image_url: imagePath })
            .where(eq(profiles.guid, req.params.userId as string))
            .returning();

          return res.status(200).json({
            status: 200,
            success: true,
            msg: "Profile picture updated successfully",
            data: user
          })

        } catch (error: any) {
          next(error)
          
        }
      
      
  })


export default userRouter;