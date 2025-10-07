import { useState, useMemo, useEffect } from "react";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { Search, MessageSquare } from "lucide-react";

const conversations = [
  {
    id: "wa-1",
    name: "Rosemary Braun",
    lastMessage: "Hello, I received a damaged product...",
    timestamp: "2m ago",
    channel: "whatsapp" as const,
    unreadCount: 2,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  },
  {
    id: "wa-2",
    name: "Cameron Williams",
    lastMessage: "Thanks for the quick response!",
    timestamp: "15m ago",
    channel: "whatsapp" as const,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
  },
  {
    id: "wa-3",
    name: "Sarah Johnson",
    lastMessage: "When will my order arrive?",
    timestamp: "1h ago",
    channel: "whatsapp" as const,
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
];

const messages = [
  { id: "1", text: "Hello, I received a damaged product in my order #12345", time: "14:32", isOwn: false, senderName: "Rosemary Braun" },
  { id: "2", text: "I'm very sorry to hear that. Can you send me a photo of the damage?", time: "14:33", isOwn: true, status: "read" as const },
  { id: "3", text: "Sure, here it is", time: "14:35", isOwn: false, hasAttachment: true },
  { id: "4", text: "Thank you. We'll send you a replacement immediately.", time: "14:36", isOwn: true, status: "delivered" as const },
];

export default function FlowbiteWhatsAppChannel() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation List */}
      <div className="w-96 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            WhatsApp
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Zoek gesprekken..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <FlowbiteConversationItem
                key={conversation.id}
                {...conversation}
                isActive={conversation.id === selectedConversationId}
                onClick={() => setSelectedConversationId(conversation.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Geen gesprekken gevonden
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1">
        {selectedConversation && (
          <FlowbiteChatView
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatarUrl}
            channel={selectedConversation.channel}
            messages={messages}
            isOnline={true}
          />
        )}
      </div>

      {/* Customer Info - simplified */}
      <div className="w-80 bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto p-6">
        <div className="text-center mb-6">
          <img
            className="w-20 h-20 rounded-full mx-auto mb-3"
            src={selectedConversation?.avatarUrl}
            alt={selectedConversation?.name}
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedConversation?.name}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <dt className="mb-1 text-xs text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">
              {selectedConversation?.name.toLowerCase().replace(' ', '.')}@example.com
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-gray-500 dark:text-gray-400">Telefoon</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">+31 6 12345678</dd>
          </div>
        </div>
      </div>
    </div>
  );
}
