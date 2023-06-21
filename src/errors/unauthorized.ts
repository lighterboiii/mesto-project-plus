import { Error } from 'mongoose';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.message = message;
  }
}

export default UnauthorizedError;
