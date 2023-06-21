import { Request, Response, NextFunction } from 'express';
import { TError } from '../types/types';

// eslint-disable-next-line no-unused-vars
export default ((err: TError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});
