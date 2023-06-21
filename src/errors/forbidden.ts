import { Error } from 'mongoose';

class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    this.message = message;
  }
}

export default ForbiddenError;
