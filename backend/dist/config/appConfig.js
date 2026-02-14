"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
require("dotenv/config");
exports.appConfig = {
    port: process.env.PORT || 6081,
    pg: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        db_con: process.env.DB_CON
    }
};
