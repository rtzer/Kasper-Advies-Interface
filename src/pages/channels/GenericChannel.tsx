import { MessageSquare } from "lucide-react";

interface GenericChannelProps {
  channelName: string;
  icon?: React.ComponentType<any>;
  color?: string;
}

export default function GenericChannel({ channelName, icon: Icon = MessageSquare, color = "text-primary" }: GenericChannelProps) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-muted/20 animate-fade-in">
      <div className="text-center space-y-4 animate-scale-in">
        <div className={`mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center ${color}`}>
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold">{channelName}</h2>
        <p className="text-muted-foreground max-w-md">
          De {channelName.toLowerCase()} interface komt binnenkort beschikbaar.
        </p>
      </div>
    </div>
  );
}
