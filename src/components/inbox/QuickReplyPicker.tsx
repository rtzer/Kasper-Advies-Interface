import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap } from "lucide-react";

interface QuickReplyPickerProps {
  onSelect: (content: string) => void;
}

export const QuickReplyPicker = ({ onSelect }: QuickReplyPickerProps) => {
  const [open, setOpen] = useState(false);
  // Use the 'translation' namespace where inbox.quickReplies is defined
  const { t } = useTranslation('translation');

  const quickReplies = [
    {
      id: "1",
      title: t('inbox.quickReplies.greeting.title', 'Begroeting'),
      content: t('inbox.quickReplies.greeting.content', 'Hallo! Hoe kan ik u vandaag helpen?'),
    },
    {
      id: "2",
      title: t('inbox.quickReplies.thanksContact.title', 'Bedankt voor contact'),
      content: t('inbox.quickReplies.thanksContact.content', 'Bedankt voor uw bericht. Ik help u graag verder.'),
    },
    {
      id: "3",
      title: t('inbox.quickReplies.patience.title', 'Even geduld'),
      content: t('inbox.quickReplies.patience.content', 'Momentje geduld alstublieft, ik zoek dit voor u uit.'),
    },
    {
      id: "4",
      title: t('inbox.quickReplies.moreInfo.title', 'Meer informatie nodig'),
      content: t('inbox.quickReplies.moreInfo.content', 'Kunt u mij wat meer informatie geven over uw vraag?'),
    },
    {
      id: "5",
      title: t('inbox.quickReplies.problemSolved.title', 'Probleem opgelost'),
      content: t('inbox.quickReplies.problemSolved.content', 'Ik ben blij dat ik u kon helpen. Is er nog iets anders waarmee ik u kan helpen?'),
    },
    {
      id: "6",
      title: t('inbox.quickReplies.closing.title', 'Afsluiting'),
      content: t('inbox.quickReplies.closing.content', 'Bedankt voor uw contact. Neem gerust opnieuw contact op als u nog vragen heeft!'),
    },
  ];

  const handleSelect = (content: string) => {
    onSelect(content);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-[hsl(var(--muted))]"
          title={t('inbox.quickReplies.title', 'Snelle antwoorden')}
        >
          <Zap className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="top">
        <div className="p-3 border-b border-border">
          <h4 className="font-semibold text-sm">{t('inbox.quickReplies.title', 'Snelle antwoorden')}</h4>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2 space-y-1">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleSelect(reply.content)}
                className="w-full text-left p-3 rounded-lg hover:bg-[hsl(var(--muted)/0.5)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ka-green))]"
              >
                <div className="font-medium text-sm mb-1 text-foreground">{reply.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {reply.content}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
