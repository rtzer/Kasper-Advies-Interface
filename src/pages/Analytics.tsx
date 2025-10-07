import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, MessageSquare, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Analytics() {
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
              <h1 className="text-2xl font-bold">Analytics & Rapportage</h1>
              <p className="text-muted-foreground">Inzicht in je communicatie performance</p>
            </div>
          </div>
          
          <Select defaultValue="7days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Vandaag</SelectItem>
              <SelectItem value="7days">Laatste 7 dagen</SelectItem>
              <SelectItem value="30days">Laatste 30 dagen</SelectItem>
              <SelectItem value="90days">Laatste 90 dagen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Totaal Gesprekken</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+12%</span> vs vorige periode
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gem. Reactietijd</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2m 34s</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">-8%</span> vs vorige periode
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Actieve Klanten</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+5%</span> vs vorige periode
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tevredenheid</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+0.2</span> vs vorige periode
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="channels" className="w-full">
          <TabsList>
            <TabsTrigger value="channels">Per Kanaal</TabsTrigger>
            <TabsTrigger value="team">Per Team Lid</TabsTrigger>
            <TabsTrigger value="time">Tijdsverloop</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gesprekken per Kanaal</CardTitle>
                <CardDescription>Verdeling van conversaties over kanalen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: "WhatsApp", count: 523, percentage: 42, color: "bg-green-500" },
                    { channel: "Email", count: 345, percentage: 28, color: "bg-blue-500" },
                    { channel: "Facebook", count: 234, percentage: 19, color: "bg-indigo-500" },
                    { channel: "Instagram", count: 132, percentage: 11, color: "bg-pink-500" },
                  ].map((item) => (
                    <div key={item.channel} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.channel}</span>
                        <span className="text-muted-foreground">{item.count} gesprekken</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Overzicht van team activiteit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Jan van Dijk", conversations: 234, avgTime: "2m 10s", satisfaction: 4.9 },
                    { name: "Lisa Peters", conversations: 198, avgTime: "2m 45s", satisfaction: 4.7 },
                    { name: "Tom de Vries", conversations: 176, avgTime: "3m 20s", satisfaction: 4.6 },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.conversations} gesprekken</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.avgTime}</p>
                        <p className="text-xs text-muted-foreground">⭐ {member.satisfaction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Gesprekken Over Tijd</CardTitle>
                <CardDescription>Grafiek van activiteit over tijd</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  [Grafiek component komt hier - kan worden geïmplementeerd met recharts]
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
