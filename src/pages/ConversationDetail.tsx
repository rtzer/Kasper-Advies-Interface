import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MoreVertical, Phone, Video, Mail, Archive, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChatView } from "@/components/inbox/ChatView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockConversation = {
  id: "1",
  name: "Rosemary Braun",
  email: "rosemary.braun@example.com",
  phone: "+31 6 12345678",
  company: "Tech Solutions BV",
  location: "Amsterdam, NL",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  tags: ["VIP", "Premium"],
  channel: "whatsapp" as const,
  status: "active",
};

const messages = [
  { id: "1", text: "Hello, I received a damaged product in my order #12345", time: "14:32", isOwn: false, senderName: "Rosemary Braun" },
  { id: "2", text: "I'm very sorry to hear that. Can you send me a photo of the damage?", time: "14:33", isOwn: true, status: "read" as const },
  { id: "3", text: "Sure, here it is", time: "14:35", isOwn: false, hasAttachment: true },
  { id: "4", text: "Thank you. We'll send you a replacement immediately.", time: "14:36", isOwn: true, status: "delivered" as const },
];

const conversationHistory = [
  { id: "1", date: "2024-01-15", channel: "email", subject: "Order inquiry", messages: 5 },
  { id: "2", date: "2024-02-03", channel: "whatsapp", subject: "Delivery question", messages: 8 },
  { id: "3", date: "2024-03-10", channel: "phone", subject: "Product support", messages: 3 },
];

export default function ConversationDetail() {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] animate-fade-in">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link to="/unified-inbox">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockConversation.avatar} />
              <AvatarFallback>{mockConversation.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{mockConversation.name}</h2>
              <p className="text-xs text-muted-foreground">{mockConversation.email}</p>
            </div>
            <Badge variant="outline" className="ml-2">{mockConversation.channel}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="conversation" className="w-full">
          <TabsList>
            <TabsTrigger value="conversation">Gesprek</TabsTrigger>
            <TabsTrigger value="info">Contact Info</TabsTrigger>
            <TabsTrigger value="history">Geschiedenis</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ChatView
          conversationName={mockConversation.name}
          conversationAvatar={mockConversation.avatar}
          channel={mockConversation.channel}
          messages={messages}
          isOnline={true}
        />
      </div>

      {/* Side Panel - Contact Details */}
      <div className="hidden xl:block w-80 border-l bg-card overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarImage src={mockConversation.avatar} />
              <AvatarFallback>{mockConversation.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{mockConversation.name}</h3>
            <p className="text-sm text-muted-foreground">{mockConversation.company}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {mockConversation.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold">Eerdere Gesprekken</h4>
            {conversationHistory.map((conv) => (
              <Card key={conv.id}>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">{conv.subject}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Datum: {conv.date}</p>
                    <p>Kanaal: {conv.channel}</p>
                    <p>Berichten: {conv.messages}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
