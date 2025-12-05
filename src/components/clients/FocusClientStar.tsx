import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FocusClientStarProps {
  isFocus: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FocusClientStar({ isFocus, onToggle, size = 'md', className = '' }: FocusClientStarProps) {
  const { t } = useTranslation('common');
  
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const buttonSizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const handleClick = () => {
    onToggle();
    toast.success(
      isFocus 
        ? t('clients.focus.removed') 
        : t('clients.focus.added')
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className={cn(
            buttonSizeMap[size],
            "transition-all duration-200",
            isFocus 
              ? "text-yellow-500 hover:text-yellow-600" 
              : "text-muted-foreground hover:text-yellow-500",
            className
          )}
        >
          <Star 
            className={cn(
              sizeMap[size],
              "transition-all duration-200",
              isFocus && "fill-yellow-500"
            )} 
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isFocus ? t('clients.focus.clickToRemove') : t('clients.focus.clickToAdd')}</p>
      </TooltipContent>
    </Tooltip>
  );
}
