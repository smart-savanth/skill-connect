"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const appConfig_1 = require("../config/appConfig");
const pool = new pg_1.Pool({
    host: appConfig_1.appConfig.pg.host,
    port: appConfig_1.appConfig.pg.port,
    database: appConfig_1.appConfig.pg.database,
    user: appConfig_1.appConfig.pg.username,
    password: appConfig_1.appConfig.pg.password
});
exports.db = (0, node_postgres_1.drizzle)({ client: pool });
