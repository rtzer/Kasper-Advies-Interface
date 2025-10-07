import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Building, Calendar, Tag, ExternalLink } from "lucide-react";

interface CustomerInfoPanelProps {
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    location?: string;
    avatar?: string;
    tags?: string[];
    firstContact?: string;
    lastContact?: string;
    totalConversations?: number;
  };
}

export const CustomerInfoPanel = ({ customer }: CustomerInfoPanelProps) => {
  return (
    <div className="h-full bg-card border-l border-border overflow-y-auto">
      {/* Customer Header */}
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {customer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-1">{customer.name}</h2>
          <Badge variant="secondary" className="mb-3">
            Actieve klant
          </Badge>
          <Link to="/customer/1">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-3 w-3 mr-2" />
              Volledige Profiel
            </Button>
          </Link>
        </div>
      </div>

      {/* Contact Information */}
      <Card className="m-4 border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Contact Informatie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a href={`mailto:${customer.email}`} className="text-primary hover:underline truncate">
              {customer.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
              {customer.phone}
            </a>
          </div>
          {customer.company && (
            <div className="flex items-center gap-3 text-sm">
              <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{customer.company}</span>
            </div>
          )}
          {customer.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{customer.location}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-2 mx-4" />

      {/* Tags */}
      {customer.tags && customer.tags.length > 0 && (
        <Card className="m-4 border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-2 mx-4" />

      {/* Activity Stats */}
      <Card className="m-4 border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Activiteit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {customer.firstContact && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eerste contact
              </span>
              <span className="font-medium">{customer.firstContact}</span>
            </div>
          )}
          {customer.lastContact && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Laatste contact</span>
              <span className="font-medium">{customer.lastContact}</span>
            </div>
          )}
          {customer.totalConversations && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Totaal gesprekken</span>
              <span className="font-medium">{customer.totalConversations}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
