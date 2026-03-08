"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIAnalysisResult {
  score: number;
  insights: Array<{
    id: string;
    label: string;
    detail: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

export async function analyzePackagingWithAIAction(formData: FormData): Promise<AIAnalysisResult> {
  if (!API_KEY) throw new Error("Gemini API Key is missing");
  const file = formData.get("file") as File;
  const targetCountry = formData.get("targetCountry") as string;
  
  if (!file) throw new Error("No file uploaded");

  const buffer = await file.arrayBuffer();
  const base64Data = Buffer.from(buffer).toString("base64");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Analisis foto kemasan produk UMKM ini untuk tujuan ekspor ke ${targetCountry}.
    Berikan penilaian dalam format JSON yang valid tanpa format markdown (pure text).
    Struktur JSON: { "score": number, "insights": [ { "id": string, "label": string, "detail": string, "status": "success" | "warning" | "error" } ] }.
    
    Poin penilaian:
    1. Keberadaan daftar komposisi (Ingredients).
    2. Adanya informasi nilai gizi (Nutrition Facts).
    3. Penggunaan bahasa (Inggris atau bahasa lokal ${targetCountry}).
    4. Kualitas visual dan branding.
    
    Gunakan Bahasa Indonesia untuk field 'label' dan 'detail'.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: file.type } },
    ]);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}
