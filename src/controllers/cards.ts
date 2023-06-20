import Card from '../models/cards';
import { Request, Response } from 'express';
import { UserRequest } from 'types/types';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const createCard = async (req: UserRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(200).send(card);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  try {
    const deletedCard = await Card.findByIdAndRemove(cardId);
    if (!deletedCard) {
      return res.status(404).send('Карточка не найдена');
    }
    res.status(200).send(deletedCard);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};