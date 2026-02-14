import { NextFunction, Request, Response } from "express";

const ExceptionHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let respData= {
    status: error.status ?? 503,
    success: false,
    msg: error.msg ?? error.message ?? "Internal Server Error",
    error_data: error.error_data ?? error.data
  }
  res.status(error.status ?? 503).json(respData);
}

export default ExceptionHandler;