import Card from '../models/cards';
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
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

export const likeCard = async (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true });
    if (!updatedCard) {
      return res.status(404).send('Карточка не найдена');
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const dislikeCard = async (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId, { $pull: { likes: owner as unknown as ObjectId } }, { new: true });
    if (!updatedCard) {
      return res.status(404).send('Карточка не найдена');
    }
    res.status(200).send(updatedCard);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};