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
  const { t } = useTranslation();

  const quickReplies = [
    {
      id: "1",
      titleKey: "inbox.quickReplies.greeting.title",
      contentKey: "inbox.quickReplies.greeting.content",
    },
    {
      id: "2",
      titleKey: "inbox.quickReplies.thanksContact.title",
      contentKey: "inbox.quickReplies.thanksContact.content",
    },
    {
      id: "3",
      titleKey: "inbox.quickReplies.patience.title",
      contentKey: "inbox.quickReplies.patience.content",
    },
    {
      id: "4",
      titleKey: "inbox.quickReplies.moreInfo.title",
      contentKey: "inbox.quickReplies.moreInfo.content",
    },
    {
      id: "5",
      titleKey: "inbox.quickReplies.problemSolved.title",
      contentKey: "inbox.quickReplies.problemSolved.content",
    },
    {
      id: "6",
      titleKey: "inbox.quickReplies.closing.title",
      contentKey: "inbox.quickReplies.closing.content",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Zap className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm">{t('inbox.quickReplies.title', 'Snelle antwoorden')}</h4>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onSelect(t(reply.contentKey))}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm mb-1">{t(reply.titleKey)}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {t(reply.contentKey)}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
