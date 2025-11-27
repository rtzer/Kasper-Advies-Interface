import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRole, User } from '@/types';
import { useCreateUser } from '@/lib/api/users';
import { specialisatieOptions } from '@/lib/mockUsers';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronLeft, ChevronRight, Mail, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  voornaam: string;
  achternaam: string;
  email: string;
  phone: string;
  mobile: string;
  role: 'Admin' | 'Employee';
  department: User['department'];
  specialisatie: string[];
}

const initialFormData: FormData = {
  voornaam: '',
  achternaam: '',
  email: '',
  phone: '',
  mobile: '',
  role: 'Employee',
  department: 'Administration',
  specialisatie: [],
};

export function CreateUserDialog({ open, onClose }: CreateUserDialogProps) {
  const { t } = useTranslation();
  const createUser = useCreateUser();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  const handleClose = () => {
    setStep(1);
    setFormData(initialFormData);
    onClose();
  };
  
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleSubmit = async () => {
    try {
      await createUser.mutateAsync(formData);
      toast.success(t('team.userCreated'));
      handleClose();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };
  
  const toggleSpecialisatie = (spec: string) => {
    const current = formData.specialisatie;
    const updated = current.includes(spec)
      ? current.filter(s => s !== spec)
      : [...current, spec];
    setFormData(prev => ({ ...prev, specialisatie: updated }));
  };
  
  const isStep1Valid = formData.voornaam && formData.achternaam && formData.email;
  const isStep2Valid = formData.role && formData.department;
  
  const steps = [
    { num: 1, label: t('team.stepBasics') },
    { num: 2, label: t('team.stepRole') },
    { num: 3, label: t('team.stepConfirm') },
  ];
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('team.createNewMember')}</DialogTitle>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step >= s.num 
                  ? 'bg-ka-green text-white' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={cn(
                'ml-2 text-sm hidden sm:inline',
                step >= s.num ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={cn(
                  'w-8 h-0.5 mx-2',
                  step > s.num ? 'bg-ka-green' : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>
        
        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('team.firstName')} *</Label>
                <Input 
                  value={formData.voornaam} 
                  onChange={e => setFormData(prev => ({ ...prev, voornaam: e.target.value }))}
                  placeholder="Jan"
                />
              </div>
              <div>
                <Label>{t('team.lastName')} *</Label>
                <Input 
                  value={formData.achternaam} 
                  onChange={e => setFormData(prev => ({ ...prev, achternaam: e.target.value }))}
                  placeholder="Jansen"
                />
              </div>
            </div>
            
            <div>
              <Label>{t('team.email')} *</Label>
              <Input 
                type="email"
                value={formData.email} 
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="jan@kaspersadvies.nl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('team.phone')}</Label>
                <Input 
                  value={formData.phone} 
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+31 599 123 456"
                />
              </div>
              <div>
                <Label>{t('team.mobile')}</Label>
                <Input 
                  value={formData.mobile} 
                  onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Role and department */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>{t('team.role')} *</Label>
              <Select 
                value={formData.role} 
                onValueChange={v => setFormData(prev => ({ ...prev, role: v as 'Admin' | 'Employee' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Employee">{t('team.employee')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>{t('team.department')} *</Label>
              <Select 
                value={formData.department} 
                onValueChange={v => setFormData(prev => ({ ...prev, department: v as User['department'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Management">{t('team.management')}</SelectItem>
                  <SelectItem value="Administration">{t('team.administration')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>{t('team.specialization')}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialisatieOptions.map(spec => (
                  <Badge
                    key={spec}
                    variant={formData.specialisatie.includes(spec) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      formData.specialisatie.includes(spec) && 'bg-ka-green hover:bg-ka-green/90'
                    )}
                    onClick={() => toggleSpecialisatie(spec)}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{formData.voornaam} {formData.achternaam}</div>
                  <div className="text-sm text-muted-foreground">{formData.role} - {formData.department}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{formData.email}</span>
              </div>
              
              {formData.specialisatie.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {formData.specialisatie.map(spec => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
              <Mail className="w-4 h-4 inline-block mr-2" />
              {t('team.invitationWillBeSent', { email: formData.email })}
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('team.previous')}
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="bg-ka-green hover:bg-ka-green/90"
            >
              {t('team.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={createUser.isPending}
              className="bg-ka-green hover:bg-ka-green/90"
            >
              {t('team.invite')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
