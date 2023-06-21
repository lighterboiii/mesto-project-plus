import { model, Schema } from 'mongoose';
import validator from 'validator';
import { IUser } from '../types/types';
import urlRegExp from '../constants/regexp';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(value: any) {
        return urlRegExp.test(value);
      },
      message: 'Некорректный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Некорректный email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
});

export default model<IUser>('user', userSchema);
