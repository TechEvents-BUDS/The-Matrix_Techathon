import { Content } from "@google/generative-ai"
import getGemini from "../gemini"
import { Message } from "../models/message.model"
import { GetDocumentFunctionSchema } from "../gemini/tools";
import { getDocuments, createDocument } from "./document.service";
import { MessageHistory } from "../types/type";
import { initialChatPrompt } from "../gemini/prompts";

export const getChat = async (userId: string, input: string, history: MessageHistory[]) => {
    const gemini = getGemini()

    if (history.length === 0) {
        history.push({
            role: "user",
            content: initialChatPrompt
        })
    }

    const newMessage = {
        role: "user",
        content: input,
    }

    const messages: Content[] = [...history, newMessage].map((message) => ({
        role: message.role,
        parts: [{ text: message.content }]
    }))
    const chat = gemini.startChat({
        history: messages, tools: [
            { functionDeclarations: [GetDocumentFunctionSchema] }
        ]
    })

    const { response } = await chat.sendMessage(input)
    if (response.candidates && response.candidates[0].content.parts[0].functionCall) {
        const { functionCall } = response.candidates[0].content.parts[0]

        console.log(functionCall)
        console.log(functionCall.name)
        if (functionCall.name === "getDocuments") {
            const documents = await getDocuments(userId)
            return chat.sendMessage("<documents>" + documents.map((doc) => doc.content).join(", ") + "</documents>")
        }
        if (functionCall.name === "createDocument") {
            const { args } = functionCall
            await createDocument(userId, (args as any)[0] as string)
        }
    }

    const [userMessage, aiMessage] = await Promise.all([
        Message.create({ ...newMessage, user: userId }),
        Message.create({ role: "model", content: response.text(), user: userId })
    ])

    return [userMessage, aiMessage];
}