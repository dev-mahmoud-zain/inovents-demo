import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/utils/app-error';
import { ZodError } from 'zod';
import { ApiResponse } from '../common/utils/api-response.util';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error.';
  let info: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    info = err.info;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error.';
    info = err.issues.map((issue: any) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else {
    // Log unexpected errors
    console.error('Unhandled error:', err);
    message = err.message || message;
  }

  const response: ApiResponse = {
    message,
    ...(info && { info }),
    data: null,
    statusCode,
  };

  res.status(statusCode).json(response);
};
