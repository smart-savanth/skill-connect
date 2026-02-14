import { appConfig } from "./src/config/appConfig";
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    out: "./migrations",
    schema: "./src/db/user-profile.ts",
    dialect: "postgresql",
    dbCredentials: {
        host: appConfig.pg.host,
        port: appConfig.pg.port,
        database: appConfig.pg.database,
        user: appConfig.pg.username,
        password: appConfig.pg.password ,
        ssl: {
            rejectUnauthorized: false
          }
        }
});