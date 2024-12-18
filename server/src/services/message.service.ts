import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model";
import { throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { IMessage, MessageHistory } from "../types/type";
import { Content } from "@google/generative-ai";

export const getMessages = async (
  userId: string,
): Promise<MessageHistory[]> => {
  try {
    const messages = await Message.find({ user: userId }).populate(
      "user",
      "name email phone"
    );

    return messages.map(message => ({role: message.role, content: message.content})) ?? []
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createMessage = async (
    userId: string,
    content: string,
    role: string,
): Promise<MessageHistory | null> => {
    try {
        const message = await Message.create({
            content,
            role,
            user: userId,
        });
        
        return {
          content: message.content,
          role: message.role,
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};
