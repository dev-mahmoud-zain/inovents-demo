export class AppError extends Error {
  public readonly statusCode: number;
  public readonly info?: any;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, info?: any) {
    super(message);
    this.statusCode = statusCode;
    this.info = info;
    this.isOperational = true; // Identifies known application errors

    Error.captureStackTrace(this, this.constructor);
  }
}
