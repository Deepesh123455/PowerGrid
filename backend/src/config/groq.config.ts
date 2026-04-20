import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Groq client
export const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
