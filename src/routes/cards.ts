import { Router } from "express";
import { deleteCard, createCard, getCards } from "controllers/cards";

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);

export default cardsRouter;