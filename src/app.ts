import express, { Request, Response } from 'express';
// import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import { HTTP_STATUS_NOT_FOUND } from './constants/status-codes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();
// dotenv.config();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use((req: Request, res: Response) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порте ${PORT}`);
});
