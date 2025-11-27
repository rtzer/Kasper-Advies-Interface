import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SpecialisatieTagsProps {
  specialisaties: string[];
  maxVisible?: number;
  className?: string;
}

export function SpecialisatieTags({ 
  specialisaties, 
  maxVisible = 3,
  className 
}: SpecialisatieTagsProps) {
  if (!specialisaties || specialisaties.length === 0) return null;
  
  const visible = specialisaties.slice(0, maxVisible);
  const hidden = specialisaties.slice(maxVisible);
  
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visible.map(spec => (
        <Badge 
          key={spec} 
          variant="secondary" 
          className="text-xs font-normal"
        >
          {spec}
        </Badge>
      ))}
      {hidden.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="text-xs font-normal cursor-help"
              >
                +{hidden.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hidden.join(', ')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
