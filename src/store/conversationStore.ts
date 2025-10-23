import { create } from 'zustand';
import { Conversation } from '@/types';

interface ConversationState {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  
  filterChannel: string | null;
  setFilterChannel: (channel: string | null) => void;
  
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  
  filterChannel: null,
  setFilterChannel: (channel) => set({ filterChannel: channel }),
  
  filterStatus: null,
  setFilterStatus: (status) => set({ filterStatus: status }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
