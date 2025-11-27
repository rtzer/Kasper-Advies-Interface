import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface QuickCreateTaskProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export function QuickCreateTask({ onSubmit, onCancel }: QuickCreateTaskProps) {
  const { t } = useTranslation(['common']);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      onSubmit(title.trim());
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Card className="p-2">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => !title.trim() && onCancel()}
        placeholder={t('tasks.quickCreatePlaceholder')}
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground mt-1 px-1">
        Enter {t('tasks.toCreate')} · Esc {t('tasks.toCancel')}
      </p>
    </Card>
  );
}
