import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserRequest } from './types/types';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import { HTTP_STATUS_NOT_FOUND } from './constants/status-codes';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: UserRequest, res: Response, next) => {
  req.user = {
    _id: '648d9ffb77f8d4f235ca03da', // временный мидлвар для авторизации
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use((req: Request, res: Response) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порте ${PORT}`);
});
