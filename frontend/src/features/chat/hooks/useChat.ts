import { useState, useCallback } from 'react';
import { chatApi } from '../api/chat.api';
import type { Message } from '../types/chat.types';

const generateId = (): string => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hello! I am your Energy Concierge. How can I help you lower your electricity bill today?',
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Optimistically add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const reply = await chatApi.sendMessage(text);

        // Add assistant reply
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
        setError(errorMessage);

        // Add error message to chat
        const errorResponseMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorResponseMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
