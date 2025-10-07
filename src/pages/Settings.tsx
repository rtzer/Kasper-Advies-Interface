import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Users, Settings as SettingsIcon, Shield, Database, Palette, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/unified-inbox">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Instellingen</h1>
            <p className="text-muted-foreground">Beheer je account en voorkeuren</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Algemeen
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificaties
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Beveiliging
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Database className="h-4 w-4 mr-2" />
              Integraties
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profiel Informatie</CardTitle>
                <CardDescription>Update je persoonlijke informatie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
                    <Input id="name" defaultValue="Jan van Dijk" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="jan@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Bedrijf</Label>
                  <Input id="company" defaultValue="Tech Solutions BV" />
                </div>
                <Button>Opslaan</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voorkeuren</CardTitle>
                <CardDescription>Pas je werk omgeving aan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Taal</Label>
                    <p className="text-sm text-muted-foreground">Kies je voorkeurstaal</p>
                  </div>
                  <Select defaultValue="nl">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nl">Nederlands</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tijdzone</Label>
                    <p className="text-sm text-muted-foreground">Stel je lokale tijdzone in</p>
                  </div>
                  <Select defaultValue="amsterdam">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amsterdam">Amsterdam</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="paris">Paris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Palette className="h-5 w-5 inline mr-2" />
                  Uiterlijk
                </CardTitle>
                <CardDescription>Pas het thema aan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Schakel tussen licht en donker thema</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notificaties</CardTitle>
                <CardDescription>Beheer welke emails je ontvangt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nieuwe berichten</Label>
                    <p className="text-sm text-muted-foreground">Ontvang een email bij nieuwe berichten</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Wekelijkse samenvatting</Label>
                    <p className="text-sm text-muted-foreground">Ontvang een wekelijks overzicht</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing updates</Label>
                    <p className="text-sm text-muted-foreground">Ontvang product updates en tips</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notificaties</CardTitle>
                <CardDescription>Browser notificaties instellen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Desktop notificaties</Label>
                    <p className="text-sm text-muted-foreground">Ontvang desktop meldingen</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Geluiden</Label>
                    <p className="text-sm text-muted-foreground">Speel een geluid af bij nieuwe berichten</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Leden</CardTitle>
                    <CardDescription>Beheer je team en permissies</CardDescription>
                  </div>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Uitnodigen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Jan van Dijk", email: "jan@example.com", role: "Admin" },
                    { name: "Lisa Peters", email: "lisa@example.com", role: "Agent" },
                    { name: "Tom de Vries", email: "tom@example.com", role: "Agent" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon">
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Key className="h-5 w-5 inline mr-2" />
                  Wachtwoord
                </CardTitle>
                <CardDescription>Update je wachtwoord</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Huidig Wachtwoord</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Nieuw Wachtwoord</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Bevestig Wachtwoord</Label>
                  <Input id="confirm" type="password" />
                </div>
                <Button>Wachtwoord Wijzigen</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Twee-Factor Authenticatie</CardTitle>
                <CardDescription>Extra beveiliging voor je account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>2FA Inschakelen</Label>
                    <p className="text-sm text-muted-foreground">Gebruik een authenticatie app</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kanaal Integraties</CardTitle>
                <CardDescription>Verbind je communicatie kanalen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "WhatsApp Business", status: "Verbonden", icon: "💬" },
                  { name: "Email (IMAP)", status: "Verbonden", icon: "📧" },
                  { name: "Facebook Messenger", status: "Niet verbonden", icon: "📘" },
                  { name: "Instagram Direct", status: "Niet verbonden", icon: "📷" },
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">{integration.status}</p>
                      </div>
                    </div>
                    <Button variant={integration.status === "Verbonden" ? "outline" : "default"}>
                      {integration.status === "Verbonden" ? "Beheren" : "Verbinden"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
