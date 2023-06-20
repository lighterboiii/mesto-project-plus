import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS_UNAUTHORIZED } from '../constants/status-codes';
import { IAuthRequest } from '../types/types';

export default (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
