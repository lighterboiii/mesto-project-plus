import { Router } from 'express';
import {
  deleteCard, createCard, getCards, dislikeCard, likeCard,
} from '../controllers/cards';
import cardValidation from '../validation/card-validation';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValidation.createCardValidation, createCard);
cardsRouter.delete('/:cardId', cardValidation.deleteCardValidation, deleteCard);
cardsRouter.put('/:cardId/likes', cardValidation.likeCardValidation, likeCard);
cardsRouter.delete('/:cardId/likes', cardValidation.dislikeCardValidation, dislikeCard);

export default cardsRouter;
