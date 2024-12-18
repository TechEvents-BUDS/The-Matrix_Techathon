import getGemini from "../gemini"
import { introductoryPrompt } from "../gemini/prompts"

export const generateIntroductoryQuestions = async () => {
    const gemini = getGemini()

    const chat = gemini.startChat({history: [{
        role: "user",
        parts: [{text: introductoryPrompt}]
    }]})

    const {response} = await chat.sendMessage("generate 12 introductory questions")

    return JSON.parse(response.text())
}
