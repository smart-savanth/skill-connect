import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { appConfig } from "../config/appConfig";



const pool = new Pool({
    host: appConfig.pg.host,
    port: appConfig.pg.port,
    database: appConfig.pg.database,
    user: appConfig.pg.username,
    password: appConfig.pg.password
});

export const db = drizzle({ client: pool });