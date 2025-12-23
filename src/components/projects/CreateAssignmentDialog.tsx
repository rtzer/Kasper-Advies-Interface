import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createAssignmentWebhook } from '@/lib/api/n8nProxy';
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

// Assignment types from Baserow
const ASSIGNMENT_TYPES = [
  'IB-aangifte',
  'Jaarrekening',
  'Toeslagen',
  'BTW-aangifte',
  'Procesoptimalisatie',
  'Groeibegeleiding',
  'Adviesgesprek',
  'Loonadministratie',
  'VPB-aangifte',
] as const;

// Status values from Baserow
const STATUSES = [
  'Nieuw',
  'In behandeling',
  'Wacht op klant',
  'In review',
  'Afgerond',
  'On hold',
  'Geannuleerd',
] as const;

// Priority values
const PRIORITIES = [
  'Normaal',
  'Hoog',
  'Laag',
] as const;

interface CreateAssignmentDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateAssignmentDialog({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: CreateAssignmentDialogProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const locale = i18n.language === 'nl' ? nl : enUS;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [assignmentType, setAssignmentType] = useState<string>('');
  const [status, setStatus] = useState<string>('Nieuw');
  const [priority, setPriority] = useState<string>('Normaal');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setDescription('');
    setAssignmentType('');
    setStatus('Nieuw');
    setPriority('Normaal');
    setStartDate(new Date());
    setDeadline(undefined);
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!description.trim() || !assignmentType) {
      toast.error(t('assignments.createDialog.fillRequired'));
      return;
    }

    if (!user) {
      toast.error(t('common.notAuthenticated'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createAssignmentWebhook({
        project_id: Number(projectId),
        user_id: Number(user.id),
        description,
        assignment_type: assignmentType,
        status,
        priority,
        start_date: format(startDate, 'yyyy-MM-dd'),
        deadline: deadline ? format(deadline, 'yyyy-MM-dd') : null,
        notes,
      });

      if (response.success && response.data?.success) {
        toast.success(t('assignments.createDialog.success'));
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
        toast.error(response.error || t('assignments.createDialog.error'));
      }
    } catch (error) {
      toast.error(t('assignments.createDialog.error'));
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
          <DialogTitle>{t('assignments.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('assignments.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('assignments.createDialog.descriptionLabel')} *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('assignments.createDialog.descriptionPlaceholder')}
            />
          </div>

          {/* Assignment Type */}
          <div className="space-y-2">
            <Label>{t('assignments.createDialog.assignmentType')} *</Label>
            <Select value={assignmentType} onValueChange={setAssignmentType}>
              <SelectTrigger>
                <SelectValue placeholder={t('assignments.createDialog.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNMENT_TYPES.map((type) => (
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
              <Label>{t('assignments.createDialog.status')}</Label>
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
              <Label>{t('assignments.createDialog.priority')}</Label>
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

          {/* Start Date & Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label>{t('assignments.createDialog.startDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'dd MMM yyyy', { locale }) : t('common.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    locale={locale}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label>{t('assignments.createDialog.deadline')}</Label>
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
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('assignments.createDialog.notes')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('assignments.createDialog.notesPlaceholder')}
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
            disabled={isSubmitting || !description.trim() || !assignmentType}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {isSubmitting ? t('assignments.createDialog.creating') : t('assignments.createDialog.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
