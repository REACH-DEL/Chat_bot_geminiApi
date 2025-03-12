import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.NEXT_PUBLIC_GEMINI_MODEL
    });

    const { message } = req.body;
    const result = await model.generateContent(message);
    const response = await result.response;
    
    res.status(200).json({ content: response.text() });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ content: 'Sorry, there was an error processing your request.' });
  }
}