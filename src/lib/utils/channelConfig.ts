/**
 * Channel Configuration
 * Based on Kaspers Advies Brand Guide
 * 
 * Design Principle: Maximum 2 colors to reduce cognitive load
 * - WhatsApp: Green (#25D366) - Universally recognized
 * - All Others: Navy (#1E3A5F) - Neutral, consistent, reduces visual noise
 */

import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  MessageCircle, 
  Globe
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";

export type Channel = 
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'video'
  | 'sms'
  | 'social'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'zoom';

/**
 * Channel styles following brand guide specification
 * WhatsApp uses brand green, all others use ka-navy
 */
export const channelStyles: Record<Channel, {
  bg: string;
  text: string;
  border: string;
}> = {
  whatsapp: {
    bg: 'bg-[#25D366]/10',
    text: 'text-[#25D366]',
    border: 'border-[#25D366]/30',
  },
  // All other channels use ka-navy
  email: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  phone: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  video: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  sms: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  social: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  facebook: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  instagram: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  linkedin: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  zoom: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
};

/**
 * Get channel styles for a given channel
 */
export function getChannelStyles(channel: Channel) {
  return channelStyles[channel];
}


/**
 * Channel icons mapping
 * Uses Lucide React icons for standard channels
 * Uses react-icons/si (Simple Icons) for brand-specific social media platforms
 */
export const channelIcons: Record<Channel, LucideIcon> = {
  whatsapp: MessageSquare,    // WhatsApp messaging
  email: Mail,                // Email
  phone: Phone,               // Phone call
  video: Video,               // Video call
  sms: MessageCircle,         // SMS text message
  social: Globe,              // Generic social media
  facebook: SiFacebook as unknown as LucideIcon,         // Facebook (Simple Icons)
  instagram: SiInstagram as unknown as LucideIcon,       // Instagram (Simple Icons)
  linkedin: SiLinkedin as unknown as LucideIcon,         // LinkedIn (Simple Icons)
  zoom: Video,                 // Zoom video call
};

/**
 * Get channel icon component for a given channel
 */
export function getChannelIcon(channel: Channel): LucideIcon {
  return channelIcons[channel] || MessageCircle;
}

