import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Reply, ReplyAll, Forward, MoreVertical, Paperclip, Star } from "lucide-react";

interface EmailMessage {
  id: string;
  from: string;
  fromAvatar?: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  hasAttachment?: boolean;
}

interface EmailThreadViewProps {
  subject: string;
  messages: EmailMessage[];
}

export const EmailThreadView = ({ subject, messages }: EmailThreadViewProps) => {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Email Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{subject}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                {messages.length} {messages.length === 1 ? "bericht" : "berichten"}
              </Badge>
              <span>•</span>
              <span>{messages[messages.length - 1]?.timestamp}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Thread */}
      <div className="flex-1 overflow-y-auto p-6">
        <Accordion type="multiple" defaultValue={[messages[messages.length - 1]?.id]} className="space-y-4">
          {messages.map((email, index) => (
            <AccordionItem 
              key={email.id} 
              value={email.id}
              className="border rounded-lg bg-card"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={email.fromAvatar} alt={email.from} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {email.from.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{email.from}</span>
                      <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      naar {email.to}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Separator className="mb-4" />
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {email.body}
                  </p>
                </div>
                {email.hasAttachment && (
                  <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Document.pdf</span>
                    <span className="text-xs text-muted-foreground ml-auto">245 KB</span>
                  </div>
                )}
                {index === messages.length - 1 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowReply(!showReply)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Beantwoorden
                    </Button>
                    <Button variant="outline" size="sm">
                      <ReplyAll className="h-4 w-4 mr-2" />
                      Allen beantwoorden
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward className="h-4 w-4 mr-2" />
                      Doorsturen
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Reply Form */}
        {showReply && (
          <div className="mt-6 p-6 border rounded-lg bg-card">
            <h3 className="font-semibold mb-4">Antwoord opstellen</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reply-to">Aan</Label>
                <Input 
                  id="reply-to" 
                  value={messages[messages.length - 1]?.from}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reply-subject">Onderwerp</Label>
                <Input 
                  id="reply-subject" 
                  value={`RE: ${subject}`}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reply-body">Bericht</Label>
                <Textarea
                  id="reply-body"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Typ uw antwoord hier..."
                  className="mt-1 min-h-32"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Bijlage toevoegen
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowReply(false)}>
                    Annuleren
                  </Button>
                  <Button className="bg-inbox-unread hover:bg-inbox-unread/90">
                    <Reply className="h-4 w-4 mr-2" />
                    Versturen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
