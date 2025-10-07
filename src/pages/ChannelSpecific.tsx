import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Mail,
  Phone,
  Video,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  Send,
  Paperclip,
  MoreVertical,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Channel = "whatsapp" | "email" | "phone" | "video";

const channelData = {
  whatsapp: {
    title: "WhatsApp Conversaties",
    icon: MessageSquare,
    color: "text-green-600",
    conversations: [
      {
        id: 1,
        name: "Rosemary Braun",
        phone: "+31 6 12345678",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
        lastMessage: "Hello, I received a damaged product...",
        time: "2m ago",
        unread: 2,
      },
      {
        id: 2,
        name: "Cameron",
        phone: "+31 6 87654321",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
        lastMessage: "Thanks for the help!",
        time: "1h ago",
        unread: 0,
      },
    ],
  },
  email: {
    title: "Email Threads",
    icon: Mail,
    color: "text-blue-600",
    conversations: [
      {
        id: 3,
        name: "Ronald",
        email: "ronald@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
        subject: "Question about invoice #12345",
        threads: 3,
        time: "15m ago",
        unread: 1,
      },
      {
        id: 4,
        name: "Esther",
        email: "esther@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
        subject: "Re: Order delivery status",
        threads: 5,
        time: "2h ago",
        unread: 0,
      },
    ],
  },
  phone: {
    title: "Telefoon Gesprekken",
    icon: Phone,
    color: "text-purple-600",
    conversations: [
      {
        id: 5,
        name: "Greg",
        phone: "+31 6 11223344",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Greg",
        duration: "12:34",
        type: "incoming",
        time: "3h ago",
        status: "completed",
      },
      {
        id: 6,
        name: "Jerry",
        phone: "+31 6 99887766",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jerry",
        duration: "5:21",
        type: "outgoing",
        time: "5h ago",
        status: "completed",
      },
    ],
  },
  video: {
    title: "Video Conferenties",
    icon: Video,
    color: "text-red-600",
    conversations: [
      {
        id: 7,
        name: "Kristin",
        email: "kristin@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kristin",
        duration: "45:12",
        platform: "Zoom",
        time: "Yesterday",
        status: "completed",
      },
      {
        id: 8,
        name: "Courtney",
        email: "courtney@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Courtney",
        duration: "23:45",
        platform: "Teams",
        time: "2 days ago",
        status: "completed",
      },
    ],
  },
};

const ChannelSpecific = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>("whatsapp");
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const currentData = channelData[activeChannel];
  const Icon = currentData.icon;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-sidebar">
        <div className="p-4">
          <Link to="/">
            <Button variant="ghost" className="mb-4 w-full justify-start">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Terug naar Home
            </Button>
          </Link>
          <Separator className="my-4" />
          <h2 className="mb-4 px-2 text-lg font-semibold">Kanalen</h2>
          <div className="space-y-1">
            <Button
              variant={activeChannel === "whatsapp" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveChannel("whatsapp")}
            >
              <MessageSquare className="mr-2 h-4 w-4 text-green-600" />
              WhatsApp
              <Badge className="ml-auto" variant="secondary">
                2
              </Badge>
            </Button>
            <Button
              variant={activeChannel === "email" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveChannel("email")}
            >
              <Mail className="mr-2 h-4 w-4 text-blue-600" />
              Email
              <Badge className="ml-auto" variant="secondary">
                1
              </Badge>
            </Button>
            <Button
              variant={activeChannel === "phone" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveChannel("phone")}
            >
              <Phone className="mr-2 h-4 w-4 text-purple-600" />
              Telefoon
            </Button>
            <Button
              variant={activeChannel === "video" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveChannel("video")}
            >
              <Video className="mr-2 h-4 w-4 text-red-600" />
              Video
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Conversation List for Selected Channel */}
        <div className="w-80 border-r bg-card">
          <div className="border-b p-4">
            <div className="mb-3 flex items-center gap-3">
              <Icon className={`h-5 w-5 ${currentData.color}`} />
              <h2 className="text-lg font-semibold">{currentData.title}</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Zoeken..." className="pl-9" />
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="mr-2 h-3 w-3" />
                Filter
              </Button>
              <Button size="sm" className="flex-1">
                <Plus className="mr-2 h-3 w-3" />
                Nieuw
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="p-2">
              {activeChannel === "whatsapp" &&
                currentData.conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{conv.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conv.phone}</p>
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

              {activeChannel === "email" &&
                currentData.conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{conv.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conv.email}</p>
                        <p className="truncate text-sm font-medium">{conv.subject}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {conv.threads} threads
                          </Badge>
                          {conv.unread > 0 && (
                            <Badge className="text-xs">{conv.unread} nieuw</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

              {activeChannel === "phone" &&
                currentData.conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{conv.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conv.phone}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant={conv.type === "incoming" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {conv.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{conv.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

              {activeChannel === "video" &&
                currentData.conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-accent ${
                      selectedConversation?.id === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{conv.name}</span>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conv.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {conv.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{conv.duration}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Detail View */}
        <div className="flex flex-1 items-center justify-center bg-muted/20">
          {selectedConversation ? (
            <div className="w-full max-w-4xl p-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedConversation.name}</CardTitle>
                        <CardDescription>
                          {selectedConversation.phone ||
                            selectedConversation.email ||
                            "Contact details"}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeChannel === "whatsapp" && (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm">{selectedConversation.lastMessage}</p>
                        <span className="mt-2 block text-xs text-muted-foreground">
                          {selectedConversation.time}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Input placeholder="Type een bericht..." className="flex-1" />
                        <Button>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeChannel === "email" && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold">Onderwerp</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.subject}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-semibold">Email Thread</h4>
                          <Badge variant="secondary">{selectedConversation.threads} emails</Badge>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">
                            Email thread details worden hier weergegeven...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeChannel === "phone" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Type</h4>
                          <Badge variant={selectedConversation.type === "incoming" ? "default" : "secondary"}>
                            {selectedConversation.type}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Duur</h4>
                          <p className="text-sm">{selectedConversation.duration}</p>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Status</h4>
                          <Badge variant="outline">{selectedConversation.status}</Badge>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Tijd</h4>
                          <p className="text-sm text-muted-foreground">{selectedConversation.time}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="mb-2 font-semibold">Notities</h4>
                        <textarea
                          className="w-full rounded-lg border bg-background p-3 text-sm"
                          rows={4}
                          placeholder="Voeg notities toe over dit gesprek..."
                        />
                      </div>
                    </div>
                  )}

                  {activeChannel === "video" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Platform</h4>
                          <Badge>{selectedConversation.platform}</Badge>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Duur</h4>
                          <p className="text-sm">{selectedConversation.duration}</p>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Status</h4>
                          <Badge variant="outline">{selectedConversation.status}</Badge>
                        </div>
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">Datum</h4>
                          <p className="text-sm text-muted-foreground">{selectedConversation.time}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="mb-2 font-semibold">Opname</h4>
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Opname
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center">
              <Icon className={`mx-auto h-16 w-16 ${currentData.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">Selecteer een conversatie</h3>
              <p className="text-muted-foreground">
                Kies een {currentData.title.toLowerCase()} om de details te bekijken
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelSpecific;