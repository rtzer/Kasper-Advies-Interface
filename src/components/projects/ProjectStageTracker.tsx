import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Stage {
  id: number;
  name: string;
  completed: boolean;
  completedDate?: string;
  startDate?: string;
  expectedCompletion?: string;
  checklist: ChecklistItem[];
}

interface ProjectStageTrackerProps {
  stages: Stage[];
  projectId: string;
  onStageUpdate?: () => void;
}

export default function ProjectStageTracker({
  stages,
  projectId,
  onStageUpdate,
}: ProjectStageTrackerProps) {
  const [localStages, setLocalStages] = useState(stages);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleChecklistToggle = async (stageId: number, itemId: string) => {
    // Optimistic update
    setLocalStages(prev => prev.map(stage => {
      if (stage.id === stageId) {
        return {
          ...stage,
          checklist: stage.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return stage;
    }));

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast.success('Checklist item bijgewerkt');
      onStageUpdate?.();
    } catch (error) {
      // Revert on error
      setLocalStages(stages);
      toast.error('Fout bij bijwerken checklist');
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const getStageStatus = (stage: Stage) => {
    const completedItems = stage.checklist.filter(i => i.completed).length;
    const totalItems = stage.checklist.length;
    
    if (stage.completed) return 'completed';
    if (completedItems > 0 && completedItems < totalItems) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="space-y-6">
      {localStages.map((stage, index) => {
        const status = getStageStatus(stage);
        const isActive = status === 'in-progress';
        
        return (
          <div
            key={stage.id}
            className={`
              flex items-start transition-all duration-300
              ${isActive ? 'bg-blue-50 -mx-6 px-6 py-4' : ''}
              ${status === 'not-started' ? 'opacity-60' : ''}
            `}
          >
            {status === 'completed' ? (
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
            ) : (
              <Circle 
                className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`} 
              />
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground">
                  {stage.id}. {stage.name}
                </h3>
                <Badge
                  className={
                    status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {status === 'completed'
                    ? 'Compleet'
                    : status === 'in-progress'
                    ? 'In uitvoering'
                    : 'Nog niet gestart'}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {stage.completed && stage.completedDate && `Afgerond op ${stage.completedDate}`}
                {isActive &&
                  stage.startDate &&
                  `Gestart op ${stage.startDate}${
                    stage.expectedCompletion ? ` • Verwacht klaar: ${stage.expectedCompletion}` : ''
                  }`}
                {status === 'not-started' &&
                  stage.startDate &&
                  `Start verwacht: ${stage.startDate}`}
              </p>

              <div className="space-y-2">
                {stage.checklist.map((item) => {
                  const isUpdating = updatingItems.has(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className={`
                        flex items-center text-sm transition-all duration-200
                        ${isUpdating ? 'opacity-50' : ''}
                      `}
                    >
                      {status === 'not-started' ? (
                        <Circle className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      ) : (
                        <Checkbox
                          id={`${stage.id}-${item.id}`}
                          checked={item.completed}
                          onCheckedChange={() => handleChecklistToggle(stage.id, item.id)}
                          disabled={isUpdating || status === 'completed'}
                          className="mr-2"
                        />
                      )}
                      <label
                        htmlFor={`${stage.id}-${item.id}`}
                        className={`
                          flex-1 cursor-pointer transition-colors
                          ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}
                        `}
                      >
                        {item.text}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
