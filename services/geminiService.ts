import { GoogleGenAI } from "@google/genai";
import { SongData } from "../types";

export const fetchSongChords = async (artist: string, title: string): Promise<SongData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Jesteś ekspertem muzycznym. Znajdź akordy i tekst do piosenki: "${title}" wykonawcy "${artist}".
    Użyj Google Search aby zweryfikować dane i znaleźć najdokładniejszą wersję.
    
    Wymagania techniczne:
    1. Twoja odpowiedź musi być WYŁĄCZNIE poprawnym obiektem JSON. 
    2. Nie dodawaj żadnego tekstu przed ani po JSONie.
    3. Nie używaj znaczników Markdown (np. \`\`\`json).
    
    Wymagania treści:
    1. Znajdź poprawną tonację oryginalną (Original Key).
    2. "content" musi być pełnym tekstem piosenki z akordami umieszczonymi w linii NAD odpowiadającym im tekstem (standardowy format akordów).
    
    Schemat JSON:
    {
      "title": "Tytuł piosenki",
      "artist": "Artysta",
      "originalKey": "Tonacja (np. C, Am, F#)",
      "content": "Pełny tekst piosenki z akordami nad liniami tekstu"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // responseMimeType: "application/json" i responseSchema są niekompatybilne z tools: [{ googleSearch: {} }]
        // Dlatego polegamy na instrukcjach w prompcie.
        tools: [{ googleSearch: {} }] 
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from Gemini");

    // Czyszczenie markdown jeśli model go doda (np. ```json ... ```)
    text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    
    // Wyciągnięcie JSONa jeśli model dodał jakiś tekst konwersacyjny
    const firstOpen = text.indexOf('{');
    const lastClose = text.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
