import express, { Request, Response } from "express";

const { PORT = 3000 } = process.env;
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Всем привет, я джокер Виктор Дудка");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});