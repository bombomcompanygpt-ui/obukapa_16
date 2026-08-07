import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    // ignore
  }
  return "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generatePerspectives = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Berikan dua perspektif yang berbeda (Pro dan Kontra) mengenai topik: "${topic}". 
      Format dalam JSON dengan kunci: "pro" (string), "contra" (string), dan "summary" (string). 
      Gunakan bahasa yang santai dan mudah dimengerti siswa SMA.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pro: { type: Type.STRING },
            contra: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["pro", "contra", "summary"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating perspectives:", error);
    return null;
  }
};

export const generateQuizQuestions = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buat 3 pertanyaan refleksi kritis (setuju/tidak setuju) tentang "${topic}" untuk siswa SMA. 
      Format dalam JSON array of objects dengan kunci: "question" (string), "explanation" (string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const generateSimulationFeed = async (interests: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buat 6 konten feed media sosial (simulasi) berdasarkan minat: ${interests.join(", ")}. 
      Buat konten yang sangat spesifik dan cenderung bias (filter bubble) sesuai minat tersebut. 
      Format dalam JSON array of objects dengan kunci: "title" (string), "source" (string), "type" (string). 
      Gunakan bahasa yang menarik untuk siswa SMA.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["title", "source", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating simulation feed:", error);
    return [];
  }
};

export const generateGameQuestions = async (gameType: 'bias' | 'perspective') => {
  try {
    const prompt = gameType === 'bias' 
      ? "Buat 4 pertanyaan untuk game 'Bias vs Fakta'. Berikan pernyataan yang menantang untuk siswa SMA. Format JSON array dengan kunci: 'text' (string), 'type' (string: 'Bias' atau 'Fakta')."
      : "Buat 3 skenario untuk game 'Role Play Perspektif'. Setiap skenario harus melatih empati. Format JSON array dengan kunci: 'scenario' (string), 'options' (array of objects with 'text' and 'correct' boolean).";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: gameType === 'bias' ? {
              text: { type: Type.STRING },
              type: { type: Type.STRING }
            } : {
              scenario: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    correct: { type: Type.BOOLEAN }
                  },
                  required: ["text", "correct"]
                }
              }
            },
            required: gameType === 'bias' ? ["text", "type"] : ["scenario", "options"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating game questions:", error);
    return [];
  }
};

export const getChatResponse = async (message: string, history: { role: string, parts: string }[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Anda adalah OutBubble AI Assistant. Tugas Anda adalah membantu siswa SMA memahami literasi digital, echo chamber, filter bubble, dan algoritma media sosial. 
        Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan topik-topik tersebut. 
        Jika pengguna bertanya hal lain, tolak dengan sopan dan arahkan kembali ke topik literasi digital atau jelaskan bagaimana pertanyaan mereka mungkin berkaitan dengan gelembung informasi. 
        Gunakan bahasa yang santai, ramah, dan mudah dimengerti remaja (bahasa gaul sopan diperbolehkan).`,
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Maaf, aku sedang tidak bisa berpikir. Coba lagi nanti ya!";
  } catch (error) {
    console.error("Error in chat:", error);
    return "Ups, ada masalah koneksi ke otak AI-ku. Coba lagi ya!";
  }
};
