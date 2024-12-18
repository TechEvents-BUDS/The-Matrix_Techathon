import { NextFunction, Request, Response } from "express";
import { Message } from "../models/message.model";
import { throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const messages = await Message.find({ user: req.user._id }).populate(
      "user",
      "name email phone"
    );

    if (!messages || messages.length === 0)
      return next(throwError("No messages found", 400));

    return res.status(201).json({
      success: true,
      message: "",
      data: messages,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const createMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    const { content, role } = req.body;
    const message = await Message.create({
      content,
      role,
      user: req.user._id,
    });

    if (!message) return next(throwError("Failed to add message", 500));

    return res.status(201).json({
      success: true,
      message: "",
      data: message,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
