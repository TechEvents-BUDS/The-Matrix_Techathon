import { Content } from "@google/generative-ai"
import getGemini from "../gemini"
import {Message} from "../models/message.model"
import { GetDocumentFunctionSchema } from "../gemini/tools";
import { getDocuments, createDocument } from "./document.service";
import { MessageHistory } from "../types/type";
import { initialChatPrompt } from "../gemini/prompts";

export const getChat = async(userId: string, input: string, history: MessageHistory[]) => {
    const gemini = getGemini()
    
    if(history.length === 0) {
        history.push({
            role: "user",
            content: initialChatPrompt
        })
    }

    const newMessage = {
        role: "user",
        content: input
    }

    const messages: Content[] = [...history, newMessage].map((message) => ({
        role: message.role,
        parts: [{text: message.content}]
    }))
    const chat = gemini.startChat({history: messages, tools: [
        {functionDeclarations: [GetDocumentFunctionSchema]}
    ]})

    const {response} = await chat.sendMessage(input)

    if(response.candidates && response.candidates[0].content.parts[0].functionCall){
        const {functionCall} = response.candidates[0].content.parts[0]
        if(functionCall.name === "getDocuments"){
            const documents = await getDocuments(userId)
            return chat.sendMessage("Retrieved documents: " + documents.map((doc) => doc.content).join(", "))
        }
        if(functionCall.name === "createDocument"){
            const {args} = functionCall
            await createDocument(userId, (args as any)[0] as string)
            return chat.sendMessage("Document created")
        }
    }

    Promise.all([
        Message.create(newMessage),
        Message.create({role: "system", content: response.text()})
    ])

    return response;
}