import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, MessageSquare, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockCustomer = {
  id: "1",
  name: "Rosemary Braun",
  email: "rosemary.braun@example.com",
  phone: "+31 6 12345678",
  company: "Tech Solutions BV",
  location: "Amsterdam, Netherlands",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  tags: ["VIP", "Premium", "Active"],
  status: "Active Customer",
  firstContact: "Jan 15, 2024",
  lastContact: "2 hours ago",
  totalConversations: 23,
  totalOrders: 12,
  lifetimeValue: "€4,250",
  preferredChannel: "WhatsApp",
};

const recentActivity = [
  { id: "1", type: "message", channel: "whatsapp", description: "Nieuwe conversatie gestart", date: "2 hours ago" },
  { id: "2", type: "order", channel: "email", description: "Order #12345 geplaatst", date: "1 day ago" },
  { id: "3", type: "message", channel: "email", description: "Support ticket #789 opgelost", date: "3 days ago" },
  { id: "4", type: "call", channel: "phone", description: "Telefoongesprek van 15 min", date: "1 week ago" },
];

const notes = [
  { id: "1", author: "Jan van Dijk", content: "VIP klant - altijd prioriteit geven", date: "Jan 20, 2024" },
  { id: "2", author: "Lisa Peters", content: "Geïnteresseerd in premium features", date: "Feb 5, 2024" },
];

export default function CustomerDetail() {
  const { id } = useParams();

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto animate-fade-in">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/unified-inbox">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Klant Details</h1>
              <p className="text-muted-foreground">Volledige informatie en activiteiten</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Bericht Sturen
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={mockCustomer.avatar} />
                      <AvatarFallback>{mockCustomer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{mockCustomer.name}</CardTitle>
                      <CardDescription>{mockCustomer.status}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {mockCustomer.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{mockCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefoon</p>
                      <p className="text-sm font-medium">{mockCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Bedrijf</p>
                      <p className="text-sm font-medium">{mockCustomer.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Locatie</p>
                      <p className="text-sm font-medium">{mockCustomer.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="activity" className="w-full">
              <TabsList>
                <TabsTrigger value="activity">Activiteit</TabsTrigger>
                <TabsTrigger value="conversations">Gesprekken</TabsTrigger>
                <TabsTrigger value="notes">Notities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recente Activiteit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            via {activity.channel} • {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conversations">
                <Card>
                  <CardHeader>
                    <CardTitle>Gesprekken Geschiedenis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Volledige gespreksgeschiedenis komt hier...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Klant Notities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm mb-2">{note.content}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{note.author}</span>
                          <span>{note.date}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistieken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Eerste Contact</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{mockCustomer.firstContact}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Laatste Contact</p>
                  <p className="text-sm font-medium">{mockCustomer.lastContact}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Totaal Gesprekken</p>
                  <p className="text-2xl font-bold">{mockCustomer.totalConversations}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Totaal Orders</p>
                  <p className="text-2xl font-bold">{mockCustomer.totalOrders}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                  <p className="text-2xl font-bold text-green-600">{mockCustomer.lifetimeValue}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voorkeuren</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Voorkeur Kanaal</p>
                  <Badge variant="outline" className="mt-1">{mockCustomer.preferredChannel}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
