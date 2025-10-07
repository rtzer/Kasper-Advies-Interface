import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Users,
  Phone,
  Video,
  Mail,
  MessageSquare,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  ChevronLeft,
  Globe,
  Clock,
  Tag,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const conversations = [
  {
    id: 1,
    name: "Rosemary Braun",
    email: "rosemaryb@acme.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
    lastMessage: "Hello, I received a damaged product...",
    channel: "whatsapp",
    time: "2m ago",
    unread: 2,
    status: "active",
  },
  {
    id: 2,
    name: "Ronald",
    email: "ronald@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
    lastMessage: "Hi, I accidentally deleted some imp...",
    channel: "email",
    time: "15m ago",
    unread: 1,
    status: "pending",
  },
  {
    id: 3,
    name: "Cameron",
    email: "cameron@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
    lastMessage: "Hey there, I received an email from...",
    channel: "chat",
    time: "1h ago",
    unread: 0,
    status: "resolved",
  },
  {
    id: 4,
    name: "Esther",
    email: "esther@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
    lastMessage: "No problem, I've prescribed 25m...",
    channel: "phone",
    time: "2h ago",
    unread: 0,
    status: "active",
  },
];

const messages = [
  {
    id: 1,
    sender: "customer",
    text: "Hello, I'm locked out of my account and need help disabling 2FA",
    time: "9:41am",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  },
  {
    id: 2,
    sender: "agent",
    text: "To proceed with disabling 2FA, could you please provide two forms of ID verification, like a government-issued ID and a recent transaction detail?",
    time: "9:42am",
    status: "read",
  },
  {
    id: 3,
    sender: "customer",
    text: "shawn-id.zip",
    time: "9:43am",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
    attachment: true,
  },
  {
    id: 4,
    sender: "agent",
    text: "Thanks for providing the details. I'll proceed with verifying your information now and will update you shortly on the 2FA status.",
    time: "9:45am",
    status: "sent",
    channel: "whatsapp",
  },
];

const UnifiedInbox = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <MessageSquare className="h-3 w-3" />;
      case "email":
        return <Mail className="h-3 w-3" />;
      case "phone":
        return <Phone className="h-3 w-3" />;
      case "video":
        return <Video className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
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
      <div className="w-80 border-r bg-card">
        <div className="border-b p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">All Conversations</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                  selectedConversation.id === conv.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conv.avatar} />
                    <AvatarFallback>{conv.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{conv.name}</span>
                        <Badge
                          variant="secondary"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          {getChannelIcon(conv.channel)}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {selectedConversation.channel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedConversation.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Pending
              </Button>
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 ${message.sender === "agent" ? "flex-row-reverse" : ""}`}>
                  {message.sender === "customer" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="max-w-md">
                    {message.attachment ? (
                      <div className="rounded-lg border bg-card p-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded bg-muted p-2">
                            <Paperclip className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{message.text}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "agent"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-2 px-1">
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                      {message.status && message.sender === "agent" && (
                        <span className="text-xs text-muted-foreground">· {message.status}</span>
                      )}
                      {message.channel && (
                        <Badge variant="outline" className="h-4 text-xs">
                          via {message.channel}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t bg-card p-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input placeholder="Type your message..." className="flex-1" />
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Customer Info */}
      <div className="w-80 border-l bg-card">
        <ScrollArea className="h-screen">
          <div className="p-4">
            <div className="mb-6 text-center">
              <Avatar className="mx-auto h-20 w-20 mb-3">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{selectedConversation.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedConversation.email}</p>
              <Button className="mt-3 w-full" variant="outline">
                View Profile
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Conversation Routing</h4>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Lola</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Main Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>London, UK</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>9:41am (UTC)</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Segments</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">chat</Badge>
                  <Badge variant="secondary">whatsapp</Badge>
                  <Badge variant="secondary">2FA</Badge>
                  <Badge variant="destructive">issue</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Visitor Data</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ticket_category</span>
                    <span className="font-medium">support</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">account_status</span>
                    <span className="font-medium">locked</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">last_login</span>
                    <span className="font-medium">2024-10-30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">membership</span>
                    <span className="font-medium">premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UnifiedInbox;