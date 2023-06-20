import { Request } from 'express';
import { Schema } from 'mongoose';

export interface UserRequest extends Request {
  user?: {
    _id: string;
  }
}

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
