
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
    1. EXCLUDE Module 16 (Analyze servers and get support).
    2. Module 5 MUST cover vim shortcuts.
    3. Module 7 MUST cover immutability bits and sticky bits.
    4. Include scenario-based questions for these specific troubleshooting tools: top, atop, iostat, sar, iotop, iftop, iperf, lsof, ethtool.
    5. Include questions about these critical files: resolv.conf, hosts, fstab, mnttab, and cron-related files.
    6. Include common troubleshooting tasks like grep/egrep usage, for loops in bash, and restarting services.
    
    Format each question as a real-world scenario where the admin must solve a problem based on these specific topics.
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
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option (0-3)" },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: Object.values(Difficulty) }
          },
          required: ["id", "module", "topic", "scenario", "question", "options", "correctAnswer", "explanation", "difficulty"]
        }
      }
    }
  });

  try {
    const text = response.text || '';
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse quiz response:", error);
    throw new Error("Failed to generate quiz questions based on specific topics.");
  }
};
