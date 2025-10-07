import { MessageSquare, Mail, Phone, Video, MessageCircle, Facebook, Instagram, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

interface ChannelIconProps {
  channel: ChannelType;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  unreadCount?: number;
  className?: string;
}

export const ChannelIcon = ({ 
  channel, 
  size = "md", 
  showBadge = false, 
  unreadCount = 0,
  className 
}: ChannelIconProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const channelConfig = {
    whatsapp: { icon: MessageSquare, color: "text-channel-whatsapp", bgColor: "bg-channel-whatsapp/10" },
    email: { icon: Mail, color: "text-channel-email", bgColor: "bg-channel-email/10" },
    phone: { icon: Phone, color: "text-channel-phone", bgColor: "bg-channel-phone/10" },
    video: { icon: Video, color: "text-channel-video", bgColor: "bg-channel-video/10" },
    facebook: { icon: Facebook, color: "text-channel-social", bgColor: "bg-channel-social/10" },
    instagram: { icon: Instagram, color: "text-channel-social", bgColor: "bg-channel-social/10" },
    linkedin: { icon: Linkedin, color: "text-channel-email", bgColor: "bg-channel-email/10" },
    sms: { icon: MessageCircle, color: "text-channel-phone", bgColor: "bg-channel-phone/10" },
  };

  const config = channelConfig[channel];
  const Icon = config.icon;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <div className={cn(
        "rounded-lg p-1.5 flex items-center justify-center",
        config.bgColor
      )}>
        <Icon className={cn(sizeClasses[size], config.color)} />
      </div>
      {showBadge && unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs rounded-full"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  );
};
