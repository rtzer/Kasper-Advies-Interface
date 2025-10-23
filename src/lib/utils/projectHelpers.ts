import { format, formatDistanceToNow, differenceInDays, isPast } from 'date-fns';
import { nl } from 'date-fns/locale';

export function formatDeadline(deadline: string): string {
  const deadlineDate = new Date(deadline);
  const daysUntil = differenceInDays(deadlineDate, new Date());
  
  if (daysUntil < 0) {
    return `${Math.abs(daysUntil)} dagen te laat`;
  } else if (daysUntil === 0) {
    return 'Vandaag';
  } else if (daysUntil === 1) {
    return 'Morgen';
  } else if (daysUntil <= 7) {
    return `Nog ${daysUntil} dagen`;
  } else {
    return format(deadlineDate, 'dd MMM yyyy', { locale: nl });
  }
}

export function getDeadlineColor(deadline: string): string {
  const daysUntil = differenceInDays(new Date(deadline), new Date());
  
  if (daysUntil < 0) return 'text-red-600';
  if (daysUntil <= 3) return 'text-orange-600';
  if (daysUntil <= 7) return 'text-yellow-600';
  return 'text-ka-gray-600';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'niet-gestart': 'bg-gray-100 text-gray-800',
    'in-uitvoering': 'bg-blue-100 text-blue-800',
    'wacht-op-klant': 'bg-yellow-100 text-yellow-800',
    'geblokkeerd': 'bg-red-100 text-red-800',
    'afgerond': 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'niet-gestart': 'Niet gestart',
    'in-uitvoering': 'In uitvoering',
    'wacht-op-klant': 'Wacht op klant',
    'geblokkeerd': 'Geblokkeerd',
    'afgerond': 'Afgerond',
  };
  return labels[status] || status;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'BTW': 'bg-blue-100 text-blue-800',
    'Hypotheek': 'bg-green-100 text-green-800',
    'Jaarrekening': 'bg-purple-100 text-purple-800',
    'Advies': 'bg-orange-100 text-orange-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function calculateProgress(stages: any[]): number {
  if (!stages || stages.length === 0) return 0;
  
  const completedStages = stages.filter(s => s.completed).length;
  return Math.round((completedStages / stages.length) * 100);
}
