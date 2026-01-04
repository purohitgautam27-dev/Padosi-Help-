
import { GoogleGenAI, Type } from "@google/genai";
import { RequestCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRequest = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this neighbor help request: "${text}". Categorize it into one of: Emergency, Medicine, Tools, Grocery, Senior Care, or General. Also determine priority and key tags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING, 
              enum: Object.values(RequestCategory),
              description: 'The best fitting category for the request'
            },
            priority: { 
              type: Type.STRING, 
              enum: ['High', 'Medium', 'Low'],
              description: 'Urgency level'
            },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Keywords extracted'
            },
          },
          required: ['category', 'priority', 'tags']
        }
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      category: RequestCategory.GENERAL,
      priority: 'Medium',
      tags: []
    };
  }
};

export const generateNeighborResponse = async (
  neighborName: string, 
  requestTitle: string, 
  userMessage: string,
  chatHistory: { text: string; isMe: boolean }[]
) => {
  try {
    const historyString = chatHistory.map(h => `${h.isMe ? 'Helper' : neighborName}: ${h.text}`).join('\n');
    const prompt = `
      System: You are ${neighborName}, a resident in a local neighborhood. 
      Context: You posted a help request: "${requestTitle}". 
      Situation: A kind neighbor is offering to help you.
      
      Neighbor's latest message: "${userMessage}"
      
      Previous Chat Flow:
      ${historyString}
      
      Task: Reply to the neighbor in a natural, grateful, and conversational way.
      Tone: Local, friendly, and slightly relieved.
      Language: Use Hinglish (Hindi + English mix) like "Arre shukriya padosi!", "Haan main gate par hi milunga", "Aap kab tak aa payenge?".
      Length: Very short (max 12-18 words).
      No formal signatures. Just the message.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || "Thank you! Please help me soon.";
  } catch (error) {
    console.error("Simulation Error:", error);
    return "Theek hai, thank you. Main wait kar raha hoon.";
  }
};
