import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Link2, Plus, Trash2, Ban, Send, ExternalLink } from 'lucide-react';
import { Taak, ChecklistItem, TaskComment } from '@/types';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TaskDetailPanelProps {
  task: Taak | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (task: Taak) => void;
}

export function TaskDetailPanel({ task, open, onClose, onUpdate }: TaskDetailPanelProps) {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newComment, setNewComment] = useState('');
  const [blockedReason, setBlockedReason] = useState(task?.blocked_reason || '');

  if (!task) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem: ChecklistItem = {
      id: `cl-${Date.now()}`,
      description: newChecklistItem,
      completed: false,
    };
    // In real app, call onUpdate with updated task
    setNewChecklistItem('');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: TaskComment = {
      id: `cmt-${Date.now()}`,
      author: 'Current User',
      content: newComment,
      created_at: new Date().toISOString(),
    };
    // In real app, call onUpdate with updated task
    setNewComment('');
  };

  const completedItems = task.checklist_items?.filter(i => i.completed).length || 0;
  const totalItems = task.checklist_items?.length || 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-left">{t('tasks.taskDetail')}</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-6">
            {/* Title */}
            <div className="space-y-2">
              <Label>{t('tasks.title')}</Label>
              <Input value={task.taak_omschrijving} readOnly />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>{t('tasks.description')}</Label>
              <Textarea value={task.notities || ''} readOnly rows={3} />
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('tasks.status')}</Label>
                <Select value={task.status} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Te doen">{t('tasks.statusTodo')}</SelectItem>
                    <SelectItem value="In uitvoering">{t('tasks.statusInProgress')}</SelectItem>
                    <SelectItem value="Geblokkeerd">{t('tasks.statusBlocked')}</SelectItem>
                    <SelectItem value="Gereed voor controle">{t('tasks.statusReview')}</SelectItem>
                    <SelectItem value="Afgerond">{t('tasks.statusDone')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t('tasks.priority')}</Label>
                <Select value={task.priority} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Hoog">{t('tasks.priorityHigh')}</SelectItem>
                    <SelectItem value="Normaal">{t('tasks.priorityNormal')}</SelectItem>
                    <SelectItem value="Laag">{t('tasks.priorityLow')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline & Assigned */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {t('tasks.deadline')}
                </Label>
                <Input 
                  type="date" 
                  value={task.deadline?.split('T')[0] || ''} 
                  readOnly 
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {t('tasks.assignedTo')}
                </Label>
                <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted/50">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs bg-ka-navy text-white">
                      {task.toegewezen_aan?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.toegewezen_aan}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Link2 className="w-4 h-4" />
                {t('tasks.links')}
              </Label>
              <div className="space-y-2">
                <Link to={`/clients/${task.klant_id}`} className="flex items-center gap-2 text-sm text-ka-green hover:underline">
                  <ExternalLink className="w-3 h-3" />
                  {task.klant_naam}
                </Link>
                {task.gerelateerde_opdracht_id && (
                  <Link to={`/assignments/${task.gerelateerde_opdracht_id}`} className="flex items-center gap-2 text-sm text-ka-green hover:underline">
                    <ExternalLink className="w-3 h-3" />
                    {task.opdracht_naam}
                  </Link>
                )}
              </div>
            </div>

            <Separator />

            {/* Blocked Section */}
            {task.status === 'Geblokkeerd' && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 text-red-600">
                    <Ban className="w-4 h-4" />
                    {t('tasks.blockedReason')}
                  </Label>
                  <Textarea 
                    value={blockedReason}
                    onChange={(e) => setBlockedReason(e.target.value)}
                    placeholder={t('tasks.blockedReasonPlaceholder')}
                    className="border-red-200"
                  />
                  <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                    {t('tasks.unblock')}
                  </Button>
                </div>
                <Separator />
              </>
            )}

            {/* Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t('tasks.checklist')}</Label>
                {totalItems > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {completedItems}/{totalItems} {t('tasks.completed')}
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {task.checklist_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox checked={item.completed} />
                    <span className={cn(
                      'text-sm flex-1',
                      item.completed && 'line-through text-muted-foreground'
                    )}>
                      {item.description}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder={t('tasks.addChecklistItem')}
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    className="h-8"
                  />
                  <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleAddChecklistItem}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comments */}
            <div className="space-y-3">
              <Label>{t('tasks.comments')}</Label>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarFallback className="text-xs bg-ka-navy text-white">
                        {comment.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), 'dd MMM HH:mm', { locale })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {(!task.comments || task.comments.length === 0) && (
                  <p className="text-sm text-muted-foreground">{t('tasks.noComments')}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Input 
                  placeholder={t('tasks.addComment')}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="icon" onClick={handleAddComment}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
