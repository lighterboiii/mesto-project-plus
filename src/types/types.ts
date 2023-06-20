import { Request } from 'express';
import { Schema } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

export interface ICustomRequest extends Request {
  user?: {
    _id: string;
  }
}

export interface IAuthRequest extends Request {
  user?: string | JwtPayload;
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
