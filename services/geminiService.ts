
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty, RHEL_MODULES } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (count: number = 10): Promise<Question[]> => {
  const prompt = `
    Generate a professional technical interview quiz for a RHEL 10 Administrator.
    Total questions: ${count}.
    
    STRICT REQUIREMENT: Use ONLY the following modules and additional topics provided in the training requirements document:
    ${RHEL_MODULES.join('\n')}
    
    CRITICAL CONSTRAINTS:
    1. EXCLUDE Module 16.
    2. Format as a real-world scenario.
    3. NEW INTERACTIVE FEATURE: For each of the 4 options, provide a "optionSimulation" string. 
       This string should look like realistic terminal output (logs, shell messages, or errors) that would occur if that command/action was executed in RHEL 10.
    4. For incorrect options, the simulation should show a realistic error or a "no change" result.
    5. For correct options, the simulation should show a successful execution log.

    JSON Schema MUST follow:
    {
      "id": "uuid",
      "module": "string",
      "topic": "string",
      "scenario": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "optionSimulations": ["string", "string", "string", "string"],
      "correctAnswer": number,
      "explanation": "string",
      "difficulty": "Junior" | "Intermediate" | "Senior"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            module: { type: Type.STRING },
            topic: { type: Type.STRING },
            scenario: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            optionSimulations: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: Object.values(Difficulty) }
          },
          required: ["id", "module", "topic", "scenario", "question", "options", "optionSimulations", "correctAnswer", "explanation", "difficulty"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("Failed to generate interactive quiz.");
  }
};
