import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): Response => {
  const body: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  errors?: unknown,
): Response => {
  const body: ApiResponse = { success: false, message, errors };
  return res.status(statusCode).json(body);
};
