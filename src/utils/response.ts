import { Response } from "express";

export enum HttpStatus {
  OK = 200,
  CREATE = 201,
  BADREQUEST = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpResponse {
  Ok(res: Response, message: string, data?: any): Response {
    return res.status(HttpStatus.OK).json({
      success: true,
      status: HttpStatus.OK,
      message: message,
      data: data,
    });
  }

  Create(res: Response, message: string, data?: any): Response {
    return res.status(HttpStatus.CREATE).json({
      success: true,
      status: HttpStatus.CREATE,
      message: message,
      data: data,
    });
  }

  BadRequest(res: Response, message: string, data?: any): Response {
    return res.status(HttpStatus.BADREQUEST).json({
      success: true,
      status: HttpStatus.BADREQUEST,
      message: message,
      error: data,
    });
  }

  NotFound(res: Response, data?: any): Response {
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      statusMsg: "Not Found",
      error: data,
    });
  }

  Unauthorized(res: Response, data?: any): Response {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      statusMsg: "Unauthorized",
      error: data,
    });
  }

  Forbidden(res: Response, data?: any): Response {
    return res.status(HttpStatus.FORBIDDEN).json({
      status: HttpStatus.FORBIDDEN,
      statusMsg: "Forbidden",
      error: data,
    });
  }

  Error(res: Response, message: string, data?: any): Response {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: message,
      error: data,
    });
  }
}