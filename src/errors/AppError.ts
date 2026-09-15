export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}