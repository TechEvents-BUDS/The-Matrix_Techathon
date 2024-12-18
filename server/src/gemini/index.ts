import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "./prompts";

let gemini: GenerativeModel | null = null

const getGemini = () => {
    try{
        if(gemini)
        {
            return gemini;
        }
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY ?? "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt });
        gemini = model;
        return gemini;
    } catch(e) {
        throw new Error("Error in getting Gemini model");   
    }
}

export default getGemini;
