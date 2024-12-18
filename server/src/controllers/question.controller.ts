import { NextFunction, Response } from "express";
import { Question } from "../models/question.model";
import { throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getQuestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const questions = await Question.find({ user: req.user._id }).populate(
      "user",
      "name email phone"
    );

    if (!questions || questions.length === 0)
      return next(throwError("No questions found", 400));

    return res.status(201).json({
      success: true,
      message: "questions fetched successfully",
      data: questions,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const createQuestion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    const { question, answer } = req.body;
    const questionDoc = await Question.create({
      question,
      answer,
      user: req.user._id,
    });

    if (!questionDoc) return next(throwError("Failed to add message", 500));

    return res.status(201).json({
      success: true,
      message: "question added successfully",
      data: questionDoc,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
