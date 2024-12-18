import { NextFunction, Response } from "express";
import { Question } from "../models/question.model";
import { extractJSON, throwError } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";
import getGemini from "../gemini";
import { diagnosisFromAnswersPrompt } from "../gemini/prompts";
import { IUser } from "../types/type";
import { createDocument } from "../services/document.service";

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

export const generateQuestionsFromAI = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user) return next(throwError("Unauthorized Access", 401));

    const gemini = await getGemini()
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    const response = await gemini.startChat({
      generationConfig, history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a personal AI therapist. Your goal is to help diagnose and understand the mental health condition of the user by asking a series of 8-14 thoughtful and open-ended questions. These questions should be related to identifying symptoms of Depression, Anxiety Disorders, Obsessive-Compulsive Disorder (OCD), or Post-Traumatic Stress Disorder (PTSD)."
            }
          ]
        }
      ]
    }).sendMessage("Your response should be an array of strings, where each string is a question tailored to explore the user's mental and emotional state. The questions should encourage self-reflection and be empathetic while covering a range of experiences, emotions, and behaviors. \nFor example: Begin by asking about the user's current emotional state. \n\nExplore symptoms such as persistent sadness, worry, intrusive thoughts, or avoidance behaviors. Ask about coping mechanisms, physical symptoms, and any significant past experiences that may affect their mental health. \n\nYour output format must be a valid array of strings. Do not include any explanations, only the array of questions.")

    if (!response)
      return next(throwError("No questions found", 400));

    const questions = extractJSON(response.response.text())

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

    getDiagnosis(req.user)

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


export const getDiagnosis = async (
  user: IUser,
): Promise<any> => {
  try {
    const questions = await Question.find({ user: user._id }).populate(
      "user",
      "name email phone"
    );

    const formatQuestionAnswers = questions.map((question) => {
      return `
      question: ${question.question}\n
      answer: ${question.answer}\n
      `
    });

    const gemini = getGemini();

    const chat = gemini.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: diagnosisFromAnswersPrompt }]
        }
      ]
    });

    const { response } = await chat.sendMessage(`<data>${formatQuestionAnswers.join("\n")}</data> <prompt>generate diagnosis, give only JSON data, and nothing else, no text at all, jsut a json data, with an array of string</prompt>`);
    const diagnosis = extractJSON(response.text());
    await User.findByIdAndUpdate(user._id, {
      diagnosis,
    });

    createDocument(user.id, `diagnosis: ${JSON.parse(response.text())}`);
    
    return true;
  } catch (error) {
    console.log(error);
  }
}