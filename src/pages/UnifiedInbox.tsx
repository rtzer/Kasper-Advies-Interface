import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Inbox, Users, Phone, Video, Mail, MessageSquare, Search, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ConversationListItem } from "@/components/inbox/ConversationListItem";
import { ChatView } from "@/components/inbox/ChatView";
import { EmailThreadView } from "@/components/inbox/EmailThreadView";
import { CustomerInfoPanel } from "@/components/inbox/CustomerInfoPanel";
import { ConversationFilters } from "@/components/inbox/ConversationFilters";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";
type ChannelFilterType = ChannelType | "all";
type StatusType = "active" | "pending" | "resolved" | "all";

// Mock data
const conversations = [
  {
    id: "1",
    name: "Rosemary Braun",
    lastMessage: "Hello, I received a damaged product...",
    timestamp: "2m",
    channel: "whatsapp" as ChannelType,
    unreadCount: 2,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  },
  {
    id: "2",
    name: "Ronald Richards",
    lastMessage: "Hi, I accidentally deleted some important files...",
    timestamp: "15m",
    channel: "email" as ChannelType,
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
  },
  {
    id: "3",
    name: "Cameron Williamson",
    lastMessage: "Hey there, I received an email from your team...",
    timestamp: "1u",
    channel: "sms" as ChannelType,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
  },
  {
    id: "4",
    name: "Esther Howard",
    lastMessage: "No problem, I've prescribed 25mg tablets...",
    timestamp: "2u",
    channel: "phone" as ChannelType,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
  },
];

const chatMessages = [
  {
    id: "1",
    text: "Hello, I'm locked out of my account and need help disabling 2FA",
    time: "9:41",
    isOwn: false,
    senderName: "Rosemary Braun",
  },
  {
    id: "2",
    text: "To proceed with disabling 2FA, could you please provide two forms of ID verification?",
    time: "9:42",
    isOwn: true,
    status: "read" as const,
  },
  {
    id: "3",
    text: "Here are my documents",
    time: "9:43",
    isOwn: false,
    senderName: "Rosemary Braun",
    hasAttachment: true,
  },
  {
    id: "4",
    text: "Thanks for providing the details. I'll proceed with verifying your information now.",
    time: "9:45",
    isOwn: true,
    status: "read" as const,
  },
];

const emailMessages = [
  {
    id: "1",
    from: "Ronald Richards",
    fromAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
    to: "support@acme.com",
    subject: "Account Recovery Request",
    body: "Hi team,\n\nI accidentally deleted some important files from my account and need help recovering them.\n\nBest regards,\nRonald",
    timestamp: "15 min geleden",
  },
  {
    id: "2",
    from: "Support Team",
    to: "ronald@example.com",
    subject: "RE: Account Recovery Request",
    body: "Hi Ronald,\n\nWe can help you recover your files. Please provide the approximate date and file names.\n\nBest regards,\nSupport Team",
    timestamp: "10 min geleden",
  },
];

const UnifiedInbox = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<ChannelFilterType[]>(["all"]);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || conversations[0];

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Search filter
      const matchesSearch = 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Channel filter
      const matchesChannel = 
        selectedChannels.includes("all") || 
        selectedChannels.includes(conv.channel);
      
      // Status filter (mock - in real app this would come from data)
      const matchesStatus = selectedStatus === "all" || 
        (selectedStatus === "active" && conv.unreadCount > 0) ||
        (selectedStatus === "resolved" && conv.unreadCount === 0);
      
      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [searchQuery, selectedChannels, selectedStatus]);

  const activeFiltersCount = 
    (selectedChannels.includes("all") ? 0 : selectedChannels.length) +
    (selectedStatus === "all" ? 0 : 1);

  return (
    <div className="flex h-screen bg-background animate-fade-in">
      {/* Sidebar */}
      <div className="w-16 border-r bg-sidebar">
        <div className="flex flex-col items-center py-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mb-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Separator className="my-2" />
          <Button variant="ghost" size="icon" className="bg-sidebar-accent">
            <Inbox className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="mt-2">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="mt-2">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="mt-2">
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="w-96 border-r bg-card flex flex-col">
        <div className="border-b p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Alle Gesprekken</h2>
            <div className="flex gap-1">
              <ConversationFilters
                selectedChannels={selectedChannels}
                selectedStatus={selectedStatus}
                onChannelChange={setSelectedChannels}
                onStatusChange={setSelectedStatus}
                activeFiltersCount={activeFiltersCount}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Zoek gesprekken..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <Link key={conv.id} to={`/unified-inbox/conversation/${conv.id}`}>
                <ConversationListItem
                  {...conv}
                  isActive={selectedConversationId === conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                />
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">Geen gesprekken gevonden</h3>
              <p className="text-sm text-muted-foreground">
                Probeer uw zoekterm of filters aan te passen
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat/Email View */}
      <div className="flex flex-1">
        {selectedConversation.channel === "email" ? (
          <EmailThreadView
            subject="Account Recovery Request"
            messages={emailMessages}
          />
        ) : (
          <ChatView
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatarUrl}
            channel={selectedConversation.channel}
            messages={chatMessages}
            isOnline={selectedConversation.id === "1"}
          />
        )}
      </div>

      {/* Right Sidebar - Customer Info */}
      <CustomerInfoPanel
        customer={{
          name: selectedConversation.name,
          email: `${selectedConversation.name.toLowerCase().replace(' ', '.')}@example.com`,
          phone: "+31 6 12345678",
          avatar: selectedConversation.avatarUrl,
          company: "Acme Corp",
          location: "London, UK",
          tags: ["chat", "whatsapp", "2FA", "issue"],
          firstContact: "2024-10-01",
          lastContact: "2024-10-30",
          totalConversations: 12,
        }}
      />
    </div>
  );
};

export default UnifiedInbox;