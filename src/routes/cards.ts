import { Router } from "express";
import { deleteCard, createCard, getCards, dislikeCard, likeCard } from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.put('/:cardId/likes', dislikeCard);

export default cardsRouter;