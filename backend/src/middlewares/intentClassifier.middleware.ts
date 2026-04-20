import { Request, Response, NextFunction } from 'express';
import { genAI } from '../config/gemini.js';
import catchAsync from '../utils/catchAsync.js';

export const intentClassifierMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `
    Classify the following user message into one of these categories:
    - ENERGY_QUERY: Related to electricity, appliances, power, energy bills, or efficiency.
    - GREETING: Basic greetings like hello, hi, etc.
    - OUT_OF_SCOPE: Anything else unrelated to energy or simple greetings.

    Message: "${message}"

    Respond with a JSON object in this format:
    {
      "intent": "ENERGY_QUERY" | "GREETING" | "OUT_OF_SCOPE"
    }
  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const { intent } = JSON.parse(responseText);

  if (intent === 'OUT_OF_SCOPE') {
    return res.status(200).json({
      reply: 'I am an Energy Concierge. I can only assist with inquiries related to electricity, utility billing, and energy efficiency.',
    });
  }

  // Attach intent to request for possible use in controller
  (req as any).intent = intent;
  next();
});
