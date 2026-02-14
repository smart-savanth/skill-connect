"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExceptionHandler = (error, req, res, next) => {
    let respData = {
        status: error.status ?? 503,
        success: false,
        msg: error.msg ?? error.message ?? "Internal Server Error",
        error_data: error.error_data ?? error.data
    };
    res.status(error.status ?? 503).json(respData);
};
exports.default = ExceptionHandler;
