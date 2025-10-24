import { Channel } from '@/types';

export const channelColors: Record<Channel, string> = {
  'WhatsApp': '#25D366',
  'E-mail': '#EA4335',
  'Telefoon': '#3B82F6',
  'Zoom': '#7C3AED',
  'SMS': '#F59E0B',
  'Facebook': '#1877F2',
  'Instagram': '#E4405F',
  'LinkedIn': '#0A66C2',
};

export const channelIcons: Record<Channel, string> = {
  'WhatsApp': '📱',
  'E-mail': '✉️',
  'Telefoon': '☎️',
  'Zoom': '🎥',
  'SMS': '💬',
  'Facebook': '📘',
  'Instagram': '📷',
  'LinkedIn': '💼',
};

export function getChannelColor(channel: Channel): string {
  return channelColors[channel] || '#64748B';
}

export function getChannelIcon(channel: Channel): string {
  return channelIcons[channel] || '💬';
}

export function getChannelBadgeClass(channel: Channel): string {
  const colors: Record<Channel, string> = {
    'WhatsApp': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'E-mail': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Telefoon': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Zoom': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'SMS': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Facebook': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'Instagram': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'LinkedIn': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };
  
  return colors[channel] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
}

// Map Channel names to ChannelIcon format
type ChannelIconType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

export function normalizeChannelForIcon(channel: string): ChannelIconType {
  const mapping: Record<string, ChannelIconType> = {
    'whatsapp': 'whatsapp',
    'e-mail': 'email',
    'email': 'email',
    'telefoon': 'phone',
    'phone': 'phone',
    'zoom': 'video',
    'video': 'video',
    'sms': 'sms',
    'facebook': 'facebook',
    'instagram': 'instagram',
    'linkedin': 'linkedin',
  };
  
  return mapping[channel.toLowerCase()] || 'email';
}
