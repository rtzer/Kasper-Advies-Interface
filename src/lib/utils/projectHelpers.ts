import { format, differenceInDays } from 'date-fns';
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

// Baserow status values
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Concept': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'Actief': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'On hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Afgerond': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Geannuleerd': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Returns translation key for status
export function getStatusTranslationKey(status: string): string {
  const keys: Record<string, string> = {
    'Concept': 'projects.status.concept',
    'Actief': 'projects.status.actief',
    'On hold': 'projects.status.onHold',
    'Afgerond': 'projects.status.afgerond',
    'Geannuleerd': 'projects.status.geannuleerd',
  };
  return keys[status] || status;
}

// Fallback label (use translation when possible)
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'Concept': 'Concept',
    'Actief': 'Actief',
    'On hold': 'On hold',
    'Afgerond': 'Afgerond',
    'Geannuleerd': 'Geannuleerd',
  };
  return labels[status] || status;
}

// Baserow project type values
export function getProjectTypeColor(projectType: string): string {
  const colors: Record<string, string> = {
    'Groeibegeleiding': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    'Procesoptimalisatie': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Digitalisering': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'VOF naar BV': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'Jaarrekening Pakket': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Bedrijfsoverdracht': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'Overig': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };
  return colors[projectType] || 'bg-gray-100 text-gray-800';
}

// Returns translation key for project type
export function getProjectTypeTranslationKey(projectType: string): string {
  const keys: Record<string, string> = {
    'Groeibegeleiding': 'projects.projectTypes.groeibegeleiding',
    'Procesoptimalisatie': 'projects.projectTypes.procesoptimalisatie',
    'Digitalisering': 'projects.projectTypes.digitalisering',
    'VOF naar BV': 'projects.projectTypes.vofNaarBv',
    'Jaarrekening Pakket': 'projects.projectTypes.jaarrekeningPakket',
    'Bedrijfsoverdracht': 'projects.projectTypes.bedrijfsoverdracht',
    'Overig': 'projects.projectTypes.overig',
  };
  return keys[projectType] || projectType;
}

// Legacy function for backwards compatibility
export function getCategoryColor(category: string): string {
  return getProjectTypeColor(category);
}

export function calculateProgress(stages: Array<{ completed: boolean }>): number {
  if (!stages || stages.length === 0) return 0;

  const completedStages = stages.filter(s => s.completed).length;
  return Math.round((completedStages / stages.length) * 100);
}
