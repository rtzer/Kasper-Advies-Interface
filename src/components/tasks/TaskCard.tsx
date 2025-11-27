import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChecklistProgress } from './ChecklistProgress';
import { TaskDeadlineBadge } from './TaskDeadlineBadge';
import { AlertCircle, AlertTriangle, MessageSquare, User, Link2, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Taak } from '@/types';
import { OpdrachtTypeBadge } from '@/components/assignments/OpdrachtTypeBadge';
import { forwardRef } from 'react';

interface TaskCardProps {
  task: Taak;
  isDragging?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, isDragging, isSelected, onClick }, ref) => {
    const getPriorityIndicator = () => {
      switch (task.priority) {
        case 'Urgent':
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-0.5 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <AlertCircle className="w-4 h-4" />
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Urgent</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        case 'Hoog':
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-0.5 text-orange-500">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Hoog</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        case 'Normaal':
          return null;
        case 'Laag':
          return (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
              Laag
            </Badge>
          );
        default:
          return null;
      }
    };

    const completedItems = task.checklist_items?.filter(i => i.completed).length || 0;
    const totalItems = task.checklist_items?.length || 0;
    const commentsCount = task.comments?.length || 0;

    return (
      <Card
        ref={ref}
        onClick={onClick}
        className={cn(
          'p-3 cursor-pointer transition-all',
          isDragging && 'shadow-lg rotate-2 opacity-90',
          isSelected && 'ring-2 ring-ka-green',
          task.status === 'Geblokkeerd' && 'border-red-200 bg-red-50/50 dark:bg-red-900/10'
        )}
      >
        <div className="space-y-2">
          {/* Priority indicator */}
          <div className="flex items-center justify-between">
            {getPriorityIndicator()}
            {task.needs_approval && task.approval_status === 'pending' && (
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                Review
              </Badge>
            )}
          </div>

          {/* Task title */}
          <h4 className="font-medium text-sm text-foreground line-clamp-2">
            {task.taak_omschrijving}
          </h4>

          {/* Client */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span className="truncate">{task.klant_naam}</span>
          </div>

          {/* Assignment type if linked */}
          {task.opdracht_naam && (
            <div className="flex items-center gap-1">
              <Link2 className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">{task.opdracht_naam}</span>
            </div>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            {task.deadline && <TaskDeadlineBadge deadline={task.deadline} />}
            
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-ka-navy text-white">
                {task.toegewezen_aan?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Checklist & Comments */}
          {(totalItems > 0 || commentsCount > 0) && (
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              {totalItems > 0 && (
                <ChecklistProgress completed={completedItems} total={totalItems} />
              )}
              {commentsCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  <span>{commentsCount}</span>
                </div>
              )}
            </div>
          )}

          {/* Blocked reason */}
          {task.status === 'Geblokkeerd' && task.blocked_reason && (
            <div className="flex items-start gap-1 pt-2 border-t border-red-200">
              <Ban className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 line-clamp-2">{task.blocked_reason}</p>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

TaskCard.displayName = 'TaskCard';
