/**
 * ChannelBadge Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Displays channel indicators following brand guide:
 * - WhatsApp: Green (#25D366)
 * - All Others: Navy (#1E3A5F)
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { getChannelStyles, getChannelIcon, Channel } from "@/lib/utils/channelConfig";

export interface ChannelBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  channel: Channel;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  default: "px-2.5 py-0.5 text-xs gap-1.5",
  lg: "px-3 py-1 text-sm gap-2",
};

const iconSizeClasses = {
  sm: "h-3 w-3",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function ChannelBadge({
  channel,
  showLabel = true,
  size = "default",
  className,
  ...props
}: ChannelBadgeProps) {
  const styles = getChannelStyles(channel);
  const Icon = getChannelIcon(channel);
  const channelLabels: Record<Channel, string> = {
    whatsapp: "WhatsApp",
    email: "E-mail",
    phone: "Telefoon",
    video: "Video",
    sms: "SMS",
    social: "Social",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    zoom: "Zoom",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border",
        styles.bg,
        styles.text,
        styles.border,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <Icon className={cn(iconSizeClasses[size], "flex-shrink-0")} />
      {showLabel && <span>{channelLabels[channel]}</span>}
    </div>
  );
}

