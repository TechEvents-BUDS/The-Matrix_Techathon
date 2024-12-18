import { Document, PaginateModel, Schema, Types } from "mongoose";
import { ROLES } from "../utils/constants";

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface IUser extends Document {
  email: string;
  password: string;
  phone?: string;
  address?: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  hasNotifications: boolean;
  isEmailVerified: boolean;
  onboarded: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
}

export interface IMessage extends Document {
  content: string;
  role: "user" | "system";
  user: Types.ObjectId;
}

export interface IQuestion extends Document {
  question: string;
  answer: string;
  user: Types.ObjectId;
}

export interface IDocument extends Document {
  user: Types.ObjectId;
  content: string;
}

export interface MessageHistory {
    role: string
    content: string;
}
