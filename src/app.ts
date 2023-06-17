import express, { Request, Response } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Всем привет, я джокер Виктор Дудка");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});