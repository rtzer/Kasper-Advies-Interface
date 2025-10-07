import { useState, useMemo } from "react";
import { ConversationListItem } from "@/components/inbox/ConversationListItem";
import { ChatView } from "@/components/inbox/ChatView";
import { CustomerInfoPanel } from "@/components/inbox/CustomerInfoPanel";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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

const customer = {
  name: "Rosemary Braun",
  email: "rosemary.braun@example.com",
  phone: "+31 6 12345678",
  company: "Tech Solutions BV",
  location: "Amsterdam, NL",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  tags: ["VIP", "Premium"],
  firstContact: "Jan 15, 2024",
  lastContact: "Just now",
  totalConversations: 23,
};

export default function WhatsAppChannel() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Conversation List */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken in gesprekken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              {...conversation}
              isActive={conversation.id === selectedConversationId}
              onClick={() => setSelectedConversationId(conversation.id)}
            />
          ))}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1">
        {selectedConversation && (
          <ChatView
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatarUrl}
            channel={selectedConversation.channel}
            messages={messages}
            isOnline={true}
          />
        )}
      </div>

      {/* Customer Info */}
      <div className="w-80 border-l bg-card overflow-y-auto">
        <CustomerInfoPanel customer={customer} />
      </div>
    </div>
  );
}
