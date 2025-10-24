import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Conversation, Message } from '@/types';
import { mockConversations, mockMessages } from '@/lib/mockData';

// Mock API calls - will be replaced with real Baserow API later
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useConversations(filters?: { status?: string; channel?: string }) {
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: async () => {
      await delay(300); // Simulate API delay
      
      let filtered = [...mockConversations];
      
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      
      if (filters?.channel) {
        filtered = filtered.filter(c => c.primary_channel === filters.channel);
      }
      
      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      await delay(200);
      return mockConversations.find(c => c.id === conversationId) || null;
    },
    enabled: !!conversationId,
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: async () => {
      await delay(300);
      return {
        results: mockMessages[conversationId] || [],
        count: (mockMessages[conversationId] || []).length,
      };
    },
    enabled: !!conversationId,
  });
}

export function useUnreadConversations() {
  return useQuery({
    queryKey: ['conversations', 'unread'],
    queryFn: async () => {
      await delay(200);
      const unread = mockConversations.filter(c => c.is_unread);
      return {
        results: unread,
        count: unread.length,
      };
    },
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      await delay(500);
      
      const newMessage: Message = {
        id: `m${Date.now()}`,
        conversation_id: data.conversationId,
        content: data.content,
        timestamp: new Date().toISOString(),
        channel: 'WhatsApp',
        direction: 'outbound',
        from: {
          id: 'team1',
          naam: 'Harm-Jan Kaspers',
          type: 'team_member',
        },
        to: {
          id: '1',
          naam: 'Client',
          type: 'client',
        },
        channel_metadata: {
          channel: 'WhatsApp',
          whatsapp_message_id: `wa_${Date.now()}`,
          status: 'sent',
        },
        is_thread_start: false,
        delivery_status: 'sent',
        attachments: [],
        contains_question: false,
        action_required: false,
        marked_important: false,
      };
      
      return newMessage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversations', variables.conversationId, 'messages'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: Partial<Conversation> 
    }) => {
      await delay(300);
      return { ...mockConversations.find(c => c.id === id)!, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useAssignConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      assignedTo 
    }: { 
      conversationId: string; 
      assignedTo: string;
    }) => {
      await delay(300);
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.toegewezen_aan = assignedTo;
      }
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useUpdateConversationTags() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      tags 
    }: { 
      conversationId: string; 
      tags: string[];
    }) => {
      await delay(300);
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.tags = tags;
      }
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useUpdateConversationPriority() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      priority 
    }: { 
      conversationId: string; 
      priority: 'urgent' | 'high' | 'normal' | 'low';
    }) => {
      await delay(300);
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.priority = priority;
      }
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      klant_id, 
      klant_naam,
      primary_channel,
      onderwerp,
      initial_message 
    }: { 
      klant_id: string;
      klant_naam: string;
      primary_channel: string;
      onderwerp: string;
      initial_message?: string;
    }) => {
      await delay(500);
      
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        conversation_nummer: `CONV-2024-${String(mockConversations.length + 1).padStart(4, '0')}`,
        status: 'open',
        klant_id,
        klant_naam,
        primary_channel: primary_channel as any,
        all_channels: [primary_channel as any],
        onderwerp,
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
        toegewezen_aan: 'Harm-Jan Kaspers',
        team_members: ['Harm-Jan Kaspers'],
        opvolging_nodig: false,
        priority: 'normal',
        is_unread: false,
        message_count: initial_message ? 1 : 0,
        sentiment: 'neutral',
      };
      
      mockConversations.unshift(newConversation);
      
      // Create initial message if provided
      if (initial_message) {
        const newMessage: Message = {
          id: `m${Date.now()}`,
          conversation_id: newConversation.id,
          content: initial_message,
          timestamp: new Date().toISOString(),
          channel: primary_channel as any,
          direction: 'outbound',
          from: {
            id: 'team1',
            naam: 'Harm-Jan Kaspers',
            type: 'team_member',
          },
          to: {
            id: klant_id,
            naam: klant_naam,
            type: 'client',
          },
          channel_metadata: {
            channel: primary_channel as any,
            whatsapp_message_id: `wa_${Date.now()}`,
            status: 'sent',
          },
          is_thread_start: true,
          delivery_status: 'sent',
          attachments: [],
          contains_question: false,
          action_required: false,
          marked_important: false,
        };
        
        if (!mockMessages[newConversation.id]) {
          mockMessages[newConversation.id] = [];
        }
        mockMessages[newConversation.id].push(newMessage);
      }
      
      return newConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
