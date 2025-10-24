import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Interactie } from '@/types';
import { Mail, Phone, MessageSquare, Video, Calendar, User, Tag, ArrowRight, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractieDetailModalProps {
  interactie: Interactie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getChannelIcon = (kanaal: string) => {
  switch (kanaal) {
    case 'E-mail':
      return <Mail className="w-4 h-4" />;
    case 'Telefoon':
      return <Phone className="w-4 h-4" />;
    case 'WhatsApp':
      return <MessageSquare className="w-4 h-4" />;
    case 'Zoom':
      return <Video className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Hoog':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Normaal':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Laag':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Positief':
      return 'bg-green-100 text-green-800';
    case 'Negatief':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function InteractieDetailModal({ interactie, open, onOpenChange }: InteractieDetailModalProps) {
  const navigate = useNavigate();

  if (!interactie) return null;

  const handleGoToInbox = () => {
    if (interactie.conversatie_id) {
      navigate(`/inbox?conversation=${interactie.conversatie_id}&open=true`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {interactie.onderwerp}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getChannelIcon(interactie.kanaal)}
              {interactie.kanaal}
            </Badge>
            
            {interactie.priority && (
              <Badge variant="outline" className={getPriorityColor(interactie.priority)}>
                {interactie.priority}
              </Badge>
            )}

            <Badge variant="outline" className={getSentimentColor(interactie.sentiment)}>
              {interactie.sentiment}
            </Badge>

            <Badge variant="outline">
              {interactie.type}
            </Badge>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{interactie.datum} om {interactie.tijd}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{interactie.medewerker}</span>
            </div>

            {interactie.duur && (
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <Phone className="w-4 h-4" />
                <span>Gespreksduur: {interactie.duur} minuten</span>
              </div>
            )}
          </div>

          {/* Samenvatting */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">Samenvatting</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {interactie.samenvatting}
            </p>
          </div>

          {/* Tags */}
          {interactie.tags && interactie.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {interactie.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Opvolging */}
          {interactie.opvolging_nodig && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-foreground mb-1">Opvolging vereist</h4>
              {interactie.opvolging_datum && (
                <p className="text-sm text-muted-foreground">
                  Opvolgingsdatum: {interactie.opvolging_datum}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {interactie.conversatie_id && (
              <Button onClick={handleGoToInbox} className="flex-1">
                <Inbox className="w-4 h-4 mr-2" />
                Ga naar inbox
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Sluiten
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
