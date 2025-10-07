import { useState, useMemo } from "react";
import { ConversationListItem } from "@/components/inbox/ConversationListItem";
import { EmailThreadView } from "@/components/inbox/EmailThreadView";
import { CustomerInfoPanel } from "@/components/inbox/CustomerInfoPanel";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const conversations = [
  {
    id: "email-1",
    name: "Ronald Richards",
    lastMessage: "Question about invoice #12345",
    timestamp: "15m ago",
    channel: "email" as const,
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
  },
  {
    id: "email-2",
    name: "Esther Howard",
    lastMessage: "Re: Order delivery status",
    timestamp: "2h ago",
    channel: "email" as const,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
  },
];

const emailMessages = [
  {
    id: "1",
    from: "Ronald Richards",
    to: "support@company.com",
    subject: "Question about invoice #12345",
    body: "Hi, I have a question about my recent invoice. The amount seems incorrect.",
    timestamp: "Today at 14:30",
  },
  {
    id: "2",
    from: "Support Team",
    to: "ronald@example.com",
    subject: "Re: Question about invoice #12345",
    body: "Thank you for reaching out. Let me look into this for you.",
    timestamp: "Today at 14:45",
  },
];

const customer = {
  name: "Ronald Richards",
  email: "ronald@example.com",
  phone: "+31 6 98765432",
  company: "Digital Marketing Inc",
  location: "Rotterdam, NL",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
  tags: ["Business", "Regular"],
  firstContact: "Dec 10, 2023",
  lastContact: "15 minutes ago",
  totalConversations: 8,
};

export default function EmailChannel() {
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
              placeholder="Zoeken in emails..."
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

      {/* Email Thread View */}
      <div className="flex-1">
        {selectedConversation && (
          <EmailThreadView
            subject={selectedConversation.lastMessage}
            messages={emailMessages}
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
