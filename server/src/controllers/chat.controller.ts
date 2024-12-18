import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model";
import { throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getChat } from "../services/chat.service"
import { getMessages } from "../services/message.service";

export const chat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const { content } = req.body;

    // get prreviosu messages
    const messages = await getMessages(req.user.id);

    const chat = await getChat(req.user.id, content, messages);

    return res.status(200).json({
      success: true,
      message: "",
      data: chat,
    });

  } catch (error) {
    console.log(error);
    return next(error);
  }
}
