import { apiClient } from '../../../lib/axios';
import type { ChatResponse } from '../types/chat.types';

export const chatApi = {
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await apiClient.post<ChatResponse>('/chat', {
        message,
      });
      return response.data.reply;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to send message to Energy Concierge'
      );
    }
  },
};
