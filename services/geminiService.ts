import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure strict backend proxying for keys.
// Here we use the environment variable as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to guide the persona
const SYSTEM_INSTRUCTION = `
You are "Nong Read", a friendly and helpful AI assistant for "Doh Sar Pay", a modern online bookstore in Thailand/Myanmar region.

Your responsibilities:
1. Recommend books based on user preferences (Fiction, Non-fiction, Manga, Business, etc.).
2. Assist with payment methods. We accept:
   - Thai Bank Transfer (PromptPay/QR) - Very popular.
   - TrueMoney Wallet.
   - Cash on Delivery (COD).
   - Credit/Debit Cards.
3. Answer questions about shipping (Standard 3-5 days, Express 1-2 days).
4. Be polite, concise, and use emojis occasionally to feel friendly.
5. If asked about prices, all prices are in Thai Baht (THB).

Tone: Cheerful, modern, helpful.
Language: You can speak English, Thai, or Burmese fluently depending on the user's input language.
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const chat = getChatSession();
  
  try {
    const resultStream = await chat.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      const responseChunk = chunk as GenerateContentResponse;
      if (responseChunk.text) {
        onChunk(responseChunk.text);
      }
    }
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    onChunk("\n[System]: Sorry, I'm having trouble connecting right now. Please try again later.");
  }
};