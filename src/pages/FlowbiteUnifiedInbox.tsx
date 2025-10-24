import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

const conversations = [
  {
    id: "1",
    name: "Rosemary Braun",
    lastMessage: "Hello, I received a damaged product...",
    timestamp: "2m ago",
    channel: "whatsapp" as ChannelType,
    unreadCount: 2,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
    clientId: "1",
  },
  {
    id: "2",
    name: "Ronald Richards",
    lastMessage: "Question about invoice #12345",
    timestamp: "15m ago",
    channel: "email" as ChannelType,
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
    clientId: "2",
  },
  {
    id: "3",
    name: "Cameron Williams",
    lastMessage: "Thanks for the quick response!",
    timestamp: "1h ago",
    channel: "whatsapp" as ChannelType,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
    clientId: "3",
  },
  {
    id: "4",
    name: "Esther Howard",
    lastMessage: "Order delivery status",
    timestamp: "2h ago",
    channel: "email" as ChannelType,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
    clientId: "4",
  },
];

const messages = [
  { id: "1", text: "Hello, I received a damaged product in my order #12345", time: "14:32", isOwn: false, senderName: "Rosemary Braun" },
  { id: "2", text: "I'm very sorry to hear that. Can you send me a photo of the damage?", time: "14:33", isOwn: true, status: "read" as const },
  { id: "3", text: "Sure, here it is", time: "14:35", isOwn: false, hasAttachment: true },
  { id: "4", text: "Thank you. We'll send you a replacement immediately.", time: "14:36", isOwn: true, status: "delivered" as const },
];

export default function FlowbiteUnifiedInbox() {
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
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation List */}
      <div className="w-96 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              Gesprekken
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              placeholder="Zoek gesprekken..."
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <Link key={conversation.id} to={`/unified-inbox/conversation/${conversation.id}`}>
                <FlowbiteConversationItem
                  {...conversation}
                  isActive={conversation.id === selectedConversationId}
                  onClick={() => setSelectedConversationId(conversation.id)}
                />
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="mb-1 text-sm font-medium text-foreground">
                Geen gesprekken gevonden
              </h3>
              <p className="text-sm text-muted-foreground">
                Probeer een andere zoekterm
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && (
          <FlowbiteChatView
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatarUrl}
            channel={selectedConversation.channel}
            messages={messages}
            isOnline={selectedConversation.id === "1"}
            clientId={selectedConversation.clientId}
          />
        )}
      </div>

      {/* Customer Info Panel */}
      <div className="w-80 bg-card border-l border-border overflow-y-auto">
        <div className="p-6">
          {/* Customer Header */}
          <div className="text-center mb-6">
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4"
              src={selectedConversation?.avatarUrl}
              alt={selectedConversation?.name}
            />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {selectedConversation?.name}
            </h3>
            <Badge variant="secondary" className="bg-[hsl(var(--status-online)/0.1)] text-[hsl(var(--status-online))] border-[hsl(var(--status-online)/0.2)]">
              <span className="w-2 h-2 mr-1.5 bg-[hsl(var(--status-online))] rounded-full"></span>
              Actieve klant
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Contact Informatie
            </h4>
            <dl className="text-sm text-foreground divide-y divide-border">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-muted-foreground">Email</dt>
                <dd className="font-semibold">rosemary.braun@example.com</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-muted-foreground">Telefoon</dt>
                <dd className="font-semibold">+31 6 12345678</dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-muted-foreground">Bedrijf</dt>
                <dd className="font-semibold">Tech Solutions BV</dd>
              </div>
            </dl>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Statistieken
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <dt className="mb-1 text-xs text-muted-foreground">Gesprekken</dt>
                <dd className="text-2xl font-bold text-foreground">23</dd>
              </div>
              <div className="col-span-1">
                <dt className="mb-1 text-xs text-muted-foreground">Orders</dt>
                <dd className="text-2xl font-bold text-foreground">12</dd>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">VIP</Badge>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">Premium</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
