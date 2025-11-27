import { Calendar, Receipt, Lightbulb, Users, Star, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface ProjectCategoryBadgeProps {
  category: string;
  projectCategory?: string;
  size?: 'sm' | 'default';
}

export default function ProjectCategoryBadge({ category, projectCategory, size = 'default' }: ProjectCategoryBadgeProps) {
  const { t } = useTranslation();
  
  const getCategoryConfig = (cat: string, projCat?: string) => {
    // Use project_category if available, otherwise derive from category
    const effectiveCategory = projCat || cat;
    
    switch (effectiveCategory.toLowerCase()) {
      case 'jaarwerk':
      case 'jaarrekening':
      case 'fiscale begeleiding':
        return {
          icon: Calendar,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          label: t('projects.categories.jaarwerk', 'Jaarwerk'),
        };
      case 'btw':
      case 'btw bulk':
        return {
          icon: Receipt,
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
          label: t('projects.categories.btw', 'BTW'),
        };
      case 'advies':
      case 'groeibegeleiding':
      case 'hypotheek':
        return {
          icon: Lightbulb,
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          label: t('projects.categories.advies', 'Advies'),
        };
      case 'loonadministratie':
        return {
          icon: Users,
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          label: t('projects.categories.loonadministratie', 'Loonadministratie'),
        };
      case 'bijzonder':
      case 'other':
        return {
          icon: Star,
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
          label: t('projects.categories.bijzonder', 'Bijzonder'),
        };
      default:
        return {
          icon: FileSpreadsheet,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
          label: category,
        };
    }
  };

  const config = getCategoryConfig(category, projectCategory);
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <Badge variant="outline" className={`${config.color} ${textSize} px-1.5 xs:px-2`}>
      <Icon className={`${iconSize} mr-1`} />
      {config.label}
    </Badge>
  );
}
