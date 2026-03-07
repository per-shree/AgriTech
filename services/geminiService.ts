
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (fn: () => Promise<any>, retries = 3, backoff = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.message?.includes('Rate exceeded') || error.message?.includes('429') || error.message?.includes('Quota'))) {
      console.warn(`Rate limit exceeded. Retrying in ${backoff}ms...`);
      await delay(backoff);
      return fetchWithRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const analyzeCropImage = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await fetchWithRetry(() => ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Act as an expert agronomist. Analyze this crop image. Identify any visible diseases, pests, or nutrient deficiencies. Provide a structured response including: 1. Disease/Issue Name, 2. Severity (Low, Medium, High), 3. A detailed description, and 4. Actionable recommendations for treatment. Return the data in a clear, professional tone.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disease: { type: Type.STRING },
          severity: { type: Type.STRING },
          description: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          confidence: { type: Type.NUMBER }
        },
        required: ["disease", "severity", "description", "recommendations", "confidence"]
      }
    }
  }));

  return JSON.parse(response.text);
};
