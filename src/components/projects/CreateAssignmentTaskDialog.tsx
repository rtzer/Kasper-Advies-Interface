import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createTaskWebhook } from '@/lib/api/n8nProxy';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Task types from Baserow
const TASK_TYPES = [
  'Terugbellen',
  'E-mail sturen',
  'Document opvragen',
  'Aangifte maken',
  'Review doen',
  'Afspraak plannen',
  'Factuur sturen',
  'Overleg intern',
  'Overig',
] as const;

// Status values from Baserow
const STATUSES = [
  'Open',
  'In uitvoering',
  'Wacht op ander',
  'Afgerond',
] as const;

// Priority values
const PRIORITIES = [
  'Urgent',
  'Hoog',
  'Normaal',
  'Laag',
] as const;

interface CreateAssignmentTaskDialogProps {
  assignmentId: number;
  assignmentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateAssignmentTaskDialog({
  assignmentId,
  assignmentName,
  open,
  onOpenChange,
  onSuccess,
}: CreateAssignmentTaskDialogProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const locale = i18n.language === 'nl' ? nl : enUS;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [taskType, setTaskType] = useState<string>('');
  const [status, setStatus] = useState<string>('Open');
  const [priority, setPriority] = useState<string>('Normaal');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const resetForm = () => {
    setDescription('');
    setDetails('');
    setTaskType('');
    setStatus('Open');
    setPriority('Normaal');
    setDeadline(undefined);
  };

  const handleSubmit = async () => {
    if (!description.trim() || !taskType) {
      toast.error(t('tasks.createDialog.fillRequired'));
      return;
    }

    if (!user) {
      toast.error(t('common.notAuthenticated'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createTaskWebhook({
        assignment_id: assignmentId,
        user_id: Number(user.id),
        description,
        details,
        task_type: taskType,
        status,
        priority,
        deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
      });

      if (response.success && response.data?.success) {
        toast.success(t('tasks.createDialog.success'));
        resetForm();
        onOpenChange(false);
        // Refetch all queries that contain these keys to refresh the workflow data
        await queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === 'baserow-assignments' || key === 'baserow-tasks' || key === 'baserow-subtasks';
          }
        });
        onSuccess?.();
      } else {
        toast.error(response.error || t('tasks.createDialog.error'));
      }
    } catch (error) {
      toast.error(t('tasks.createDialog.error'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('tasks.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('tasks.createDialog.description', { assignment: assignmentName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('tasks.createDialog.descriptionLabel')} *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('tasks.createDialog.descriptionPlaceholder')}
            />
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <Label>{t('tasks.createDialog.taskType')} *</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.createDialog.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status & Priority row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label>{t('tasks.createDialog.status')}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>{t('tasks.createDialog.priority')}</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>{t('tasks.createDialog.deadline')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !deadline && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'dd MMM yyyy', { locale }) : t('common.selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  locale={locale}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details">{t('tasks.createDialog.details')}</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t('tasks.createDialog.detailsPlaceholder')}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim() || !taskType}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {isSubmitting ? t('tasks.createDialog.creating') : t('tasks.createDialog.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
