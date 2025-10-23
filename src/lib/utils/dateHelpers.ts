import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';

export function formatRelativeTime(date: string, language: 'nl' | 'en' = 'nl'): string {
  const locale = language === 'nl' ? nl : enUS;
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm', { locale });
  }
  
  if (isYesterday(dateObj)) {
    return language === 'nl' ? 'Gisteren' : 'Yesterday';
  }
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true,
    locale 
  });
}

export function formatDate(date: string, language: 'nl' | 'en' = 'nl'): string {
  const locale = language === 'nl' ? nl : enUS;
  return format(new Date(date), 'PPP', { locale });
}

export function formatDateTime(date: string, language: 'nl' | 'en' = 'nl'): string {
  const locale = language === 'nl' ? nl : enUS;
  return format(new Date(date), 'PPp', { locale });
}

export function formatTime(date: string): string {
  return format(new Date(date), 'HH:mm');
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

export function daysUntilDeadline(deadline: string): number {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatShortDate(date: string, language: 'nl' | 'en' = 'nl'): string {
  const locale = language === 'nl' ? nl : enUS;
  return format(new Date(date), 'dd MMM', { locale });
}
