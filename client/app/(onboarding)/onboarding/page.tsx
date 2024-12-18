"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { completeOnboarding, getgeneratedQuestions } from "@/API/question.api";
import { useAuth } from "@/store/AuthProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// const questions = [
//   "What are your career goals for the next 5 years?",
//   "Describe a challenging situation you've faced and how you overcame it.",
//   "What skills do you think are most important in your field?",
//   "How do you stay updated with industry trends?",
//   "What's the most interesting project you've worked on?",
//   "How do you handle stress and pressure at work?",
//   "What's your approach to problem-solving?",
//   "How do you prefer to receive feedback?",
// ];

const OnboardingPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );

  const fetchGeneratedQuestions = async () => {
    const { response, success } = await getgeneratedQuestions();
    if (success) {
      setQuestions(response);
      setAnswers(new Array(response.length).fill(""));
    } else {
      toast.error(response || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchGeneratedQuestions();
  }, []);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = questions.map((question, index) => ({
      question,
      answer: answers[index],
    }));

    const { response, success } = await completeOnboarding(data);
    if (success) {
      setUser(response);
      router.push("/");
    } else {
      toast.error(response || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <h1 className="text-3xl font-bold text-center my-10 capitalize">
        Lets get started, answer the few questions
      </h1>
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {questions.map((question, index) => (
              <div key={index} className="bg-white shadow-sm rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  {index + 1 + ")"} {question}
                </p>
                <Textarea
                  value={answers[index]}
                  required={true}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full resize-none"
                  rows={2}
                />
              </div>
            ))}
          </div>
          <div className="">
            <Button
              type="submit"
              size={"lg"}
              className="mx-auto max-w-[500px] w-full"
            >
              Submit Answers
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
