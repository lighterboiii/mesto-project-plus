import express, { Request, Response } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import { UserRequest } from "types/types";

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.use((req: UserRequest, res: Response, next) => {
  req.user = {
    _id: '648d9ffb77f8d4f235ca03da' // временный мидлвар для авторизации
  };

  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Всем привет, я джокер Виктор Дудка");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});