"use client";
import { useEffect, useRef, useState } from "react";
import { Brain, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { getMessages, sendChat } from "@/API/chat.api";
import { IMessage } from "@/types/types";
import { toast } from "sonner";

type Message = {
  text: string;
  isUser: boolean;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm your AI Therapist. How are you feeling today?",
      isUser: false,
    },
  ]);

  useEffect(() => {
    (async () => {
      const { response, success } = await getMessages();
      if (success) {
        const formatMessages = response.map((message: any) => ({
          text: message.content,
          isUser: message.role === "user",
        }));
        setMessages(formatMessages);
      } else {
        toast.error("Something went wrong");
      }
    })();
  }, []);

  const [input, setInput] = useState("");

  const lastMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, isUser: true }]);
      const { response, success } = await sendChat(input);
      setInput("");
      if (success) {
        setMessages((prev) => [
          ...prev,
          { text: response?.[1].content, isUser: false },
        ]);
      }
    }
  };
  function handleClick() {}
  return (
    <div className="relative flex flex-col chat-height bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 md:max-w-[70%] max-w-[90%] ${
                message.isUser ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  message.isUser ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                {message.isUser ? (
                  <User className="w-6 h-6 text-white" />
                ) : (
                  <Brain className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.isUser ? "bg-blue-100" : "bg-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={lastMessageRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 right-0 left-0 p-4 bg-white border-t"
      >
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send onClick={handleClick} />
          </Button>
        </div>
      </form>
    </div>
  );
}
