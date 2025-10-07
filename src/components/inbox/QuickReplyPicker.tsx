import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap } from "lucide-react";

interface QuickReply {
  id: string;
  title: string;
  content: string;
}

interface QuickReplyPickerProps {
  onSelect: (content: string) => void;
}

const quickReplies: QuickReply[] = [
  {
    id: "1",
    title: "Begroeting",
    content: "Hallo! Hoe kan ik u vandaag helpen?",
  },
  {
    id: "2",
    title: "Bedankt voor contact",
    content: "Bedankt voor uw bericht. Ik help u graag verder.",
  },
  {
    id: "3",
    title: "Even geduld",
    content: "Momentje geduld alstublieft, ik zoek dit voor u uit.",
  },
  {
    id: "4",
    title: "Meer informatie nodig",
    content: "Kunt u mij wat meer informatie geven over uw vraag?",
  },
  {
    id: "5",
    title: "Probleem opgelost",
    content: "Ik ben blij dat ik u kon helpen. Is er nog iets anders waarmee ik u kan helpen?",
  },
  {
    id: "6",
    title: "Afsluiting",
    content: "Bedankt voor uw contact. Neem gerust opnieuw contact op als u nog vragen heeft!",
  },
];

export const QuickReplyPicker = ({ onSelect }: QuickReplyPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Zap className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm">Snelle antwoorden</h4>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onSelect(reply.content)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm mb-1">{reply.title}</div>
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
