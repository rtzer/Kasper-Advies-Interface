import { Link } from "react-router-dom";
import { MessageSquare, Mail, Phone, Video, Inbox } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Multi-Channel Communication Platform</h1>
          <p className="text-xl text-muted-foreground">
            Kies een prototype om te bekijken
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Unified Inbox Option */}
          <Card className="border-2 transition-all hover:border-primary">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                  <Inbox className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Versie 1: Unified Inbox</CardTitle>
              </div>
              <CardDescription className="text-base">
                Alle communicatiekanalen in één interface, zoals Crisp.chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>WhatsApp, Social Media</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email threads</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>Telefoon gesprekken</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span>Video conferenties</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Voordelen:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Overzichtelijk - alles in één scherm</li>
                  <li>✓ Snel schakelen tussen kanalen</li>
                  <li>✓ Eén inbox voor alle conversaties</li>
                </ul>
              </div>
              <Link to="/unified-inbox">
                <Button className="mt-6 w-full" size="lg">
                  Bekijk Unified Inbox
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Channel-Specific Option */}
          <Card className="border-2 transition-all hover:border-primary">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-secondary p-3 text-secondary-foreground">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Versie 2: Per Kanaal</CardTitle>
              </div>
              <CardDescription className="text-base">
                Aparte interface voor elk communicatiekanaal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>WhatsApp pagina</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email pagina</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>Telefoon pagina</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span>Video pagina</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Voordelen:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Dedicated interface per kanaal</li>
                  <li>✓ Optimaal gebruik van schermruimte</li>
                  <li>✓ Minder visuele ruis</li>
                </ul>
              </div>
              <Link to="/channel-specific">
                <Button className="mt-6 w-full" size="lg" variant="secondary">
                  Bekijk Channel-Specific
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
