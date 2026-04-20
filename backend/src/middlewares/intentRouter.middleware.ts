import { Request, Response, NextFunction } from 'express';
import { groqClient } from '../config/groq.config.js';
import catchAsync from '../utils/catchAsync.js';

export const intentRouterMiddleware = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Use Groq to classify intent
        const chatCompletion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
                        "Categorize the user's message into exactly one of these intents: 'ENERGY_QUERY', 'GREETING', or 'OUT_OF_SCOPE'. Everything unrelated to electricity, utility bills, or home energy MUST be 'OUT_OF_SCOPE'. Output ONLY valid JSON: { \"intent\": \"YOUR_CLASSIFICATION\" }",
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' },
            temperature: 0.0,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '';
        const { intent } = JSON.parse(responseText);

        if (intent === 'OUT_OF_SCOPE') {
            return res.status(200).json({
                reply: 'I am the Energy Concierge. I can only assist with inquiries related to electricity, utility billing, and energy efficiency.',
            });
        }

        // Attach intent to request for possible use in controller
        (req as any).intent = intent;
        next();
    }
);
