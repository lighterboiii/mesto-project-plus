import { model, Schema } from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import validator from 'validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
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
  },
});

export default model<IUser>('user', userSchema);
