
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const professionalizeDescription = async (description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme esta descrição técnica informal de uma assistência técnica em um parágrafo profissional e detalhado para um orçamento formal: "${description}". Seja direto, use termos técnicos adequados e mantenha a clareza para o cliente.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text?.trim() || description;
  } catch (error) {
    console.error("Gemini Error:", error);
    return description;
  }
};
