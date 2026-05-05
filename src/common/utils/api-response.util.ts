import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  message: string;
  info?: any;
  data?: T;
  statusCode: number;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  info?: any
): Response => {
  const body: ApiResponse<T> = { 
    message,
    ...(info && { info }),
    data,
    statusCode 
  };
  return res.status(statusCode).json(body);
};
