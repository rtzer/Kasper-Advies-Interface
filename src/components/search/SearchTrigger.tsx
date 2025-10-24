import { Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface SearchTriggerProps {
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export function SearchTrigger({ onClick, variant = 'default' }: SearchTriggerProps) {
  const { t } = useTranslation(['common']);

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        className="border-gray-200 dark:border-gray-600"
        title="Search (Cmd+K or /)"
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full max-w-md px-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-600 transition-colors group"
      title="Open search palette"
    >
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        <span className="hidden sm:inline">
          {t('common:actions.search')} or type / for commands...
        </span>
        <span className="sm:hidden">
          {t('common:actions.search')}...
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
        <Command className="w-3 h-3" />
        <span>K</span>
      </div>
    </button>
  );
}
