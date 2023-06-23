import { Joi, celebrate } from 'celebrate';
import customMethod from './custom-method';

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().hex().custom(customMethod.isUrlMethod),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom(customMethod.isUrlMethod),
    email: Joi.string().required().custom(customMethod.isEmailMethod),
    password: Joi.string().min(8).required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .custom(customMethod.isEmailMethod),
    password: Joi.string().required().min(8),
  }),
});

export default {
  getUserByIdValidation,
  updateUserInfoValidation,
  updateAvatarValidation,
  createUserValidation,
  loginValidation,
};
