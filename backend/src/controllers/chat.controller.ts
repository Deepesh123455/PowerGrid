import { Request, Response } from 'express';
import { groqClient } from '../config/groq.config.js';
import catchAsync from '../utils/catchAsync.js';

export const handleChat = catchAsync(async (req: Request, res: Response) => {
  const { message } = req.body;

  const chatCompletion = await groqClient.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an expert Energy Concierge. Provide actionable, practical advice to reduce electricity bills and manage home energy consumption. Do not output markdown code blocks unless writing actual code. Be concise and professional.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
  });

  const reply = chatCompletion.choices[0]?.message?.content || '';

  res.status(200).json({
    reply,
  });
});
