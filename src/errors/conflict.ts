import { Error } from 'mongoose';

class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
    this.message = message;
  }
}

export default ConflictError;
