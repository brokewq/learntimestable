
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getScaffold = async (fact: { a: number; b: number }): Promise<string> => {
  if (!API_KEY) {
    return `Let's break it down. You know that ${fact.a} x 10 is ${fact.a * 10}. Since 8 is 2 less than 10, you can subtract two ${fact.a}s from ${fact.a*10}. So, ${fact.a*10} - ${fact.a} - ${fact.a} = ${fact.a * fact.b}.`;
  }

  const prompt = `
    You are an expert math tutor for adults who are re-learning basic math.
    A user is struggling with the multiplication fact: ${fact.a} × ${fact.b}.
    Provide ONE simple, encouraging, and easy-to-remember strategy, breakdown, or memory trick to solve this specific fact.
    Do not just state the answer. Focus on the method.
    Keep your explanation concise (2-3 sentences).

    Example for 7x8: "A helpful trick for 7x8 is to remember the number sequence 5, 6, 7, 8. The answer is '56', which comes right after in the sequence: 56 = 7x8."
    Example for 6x7: "You can break it down. You might know 6x5 is 30. You just need to add two more 6s. So, 30 + 6 + 6 = 42."
    Example for 9x6: "Anything times 9 is just 10 times that number, minus the number. So 9x6 is the same as (10x6) - 6, which is 60 - 6 = 54."
    
    Now, provide a new strategy for: ${fact.a} × ${fact.b}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching scaffold from Gemini:", error);
    return `There was an error getting a hint. Let's try another way: ${fact.a} + ${fact.a} + ... (${fact.b} times) = ${fact.a * fact.b}`;
  }
};
   