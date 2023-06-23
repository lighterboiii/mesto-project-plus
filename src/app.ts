import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { errors } from 'celebrate';
import userRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import errorsMiddleware from './middlewares/errors';
import { requestLogger, errorLogger } from './middlewares/loggers';
import userValidation from './validation/user-validation';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.post('/signin', userValidation.loginValidation, login);
app.post('/signup', userValidation.createUserValidation, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorsMiddleware);
app.listen(PORT);
