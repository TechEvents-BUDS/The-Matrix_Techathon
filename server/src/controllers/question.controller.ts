import { NextFunction, Response } from "express";
import { Question } from "../models/question.model";
import { throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

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

export const createQuestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));
    const { onboardingData } = req.body;

    const promises = onboardingData.map((data: any) => {
      const { question, answer } = data;
      return Question.create({
        question,
        answer,
        user: req?.user?._id,
      });
    });

    await Promise.all(promises);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      onboarded: true,
    }, { new: true }).select("-password");

    return res.status(201).json({
      success: true,
      message: "question added successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
