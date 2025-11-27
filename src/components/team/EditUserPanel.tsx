import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserRole } from '@/types';
import { useUpdateUser, useUserPermissions } from '@/lib/api/users';
import { specialisatieOptions } from '@/lib/mockUsers';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditUserPanelProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function EditUserPanel({ user, open, onClose }: EditUserPanelProps) {
  const { t } = useTranslation();
  const updateUser = useUpdateUser();
  const { canEditBSNAccess, isOwner } = useUserPermissions();
  
  const [formData, setFormData] = useState<Partial<User>>({});
  const [showBSNWarning, setShowBSNWarning] = useState(false);
  const [pendingBSNValue, setPendingBSNValue] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        voornaam: user.voornaam,
        achternaam: user.achternaam,
        email: user.email,
        phone: user.phone,
        mobile: user.mobile,
        department: user.department,
        specialisatie: user.specialisatie || [],
        hourly_rate: user.hourly_rate,
        role: user.role,
        can_access_bsn: user.can_access_bsn,
        can_manage_users: user.can_manage_users,
        can_delete_records: user.can_delete_records,
        is_active: user.is_active,
        language: user.language,
        theme: user.theme,
      });
    }
  }, [user]);
  
  if (!user) return null;
  
  const handleSave = async () => {
    try {
      await updateUser.mutateAsync({ id: user.id, data: formData });
      toast.success(t('team.userUpdated'));
      onClose();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };
  
  const handleBSNToggle = (value: boolean) => {
    if (canEditBSNAccess) {
      setPendingBSNValue(value);
      setShowBSNWarning(true);
    }
  };
  
  const confirmBSNChange = () => {
    setFormData(prev => ({ ...prev, can_access_bsn: pendingBSNValue }));
    setShowBSNWarning(false);
  };
  
  const toggleSpecialisatie = (spec: string) => {
    const current = formData.specialisatie || [];
    const updated = current.includes(spec)
      ? current.filter(s => s !== spec)
      : [...current, spec];
    setFormData(prev => ({ ...prev, specialisatie: updated }));
  };
  
  const initials = `${user.voornaam.charAt(0)}${user.achternaam.charAt(0)}`;
  const isOwnerUser = user.role === 'Owner';
  
  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[450px] sm:max-w-[450px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-ka-green/10 text-ka-green">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{user.name}</div>
                <div className="text-sm font-normal text-muted-foreground">{user.user_id}</div>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">{t('team.tabProfile')}</TabsTrigger>
              <TabsTrigger value="access">{t('team.tabAccess')}</TabsTrigger>
              <TabsTrigger value="preferences">{t('team.tabPreferences')}</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('team.firstName')}</Label>
                  <Input 
                    value={formData.voornaam || ''} 
                    onChange={e => setFormData(prev => ({ ...prev, voornaam: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t('team.lastName')}</Label>
                  <Input 
                    value={formData.achternaam || ''} 
                    onChange={e => setFormData(prev => ({ ...prev, achternaam: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>{t('team.email')}</Label>
                <Input 
                  value={formData.email || ''} 
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isOwner}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('team.phone')}</Label>
                  <Input 
                    value={formData.phone || ''} 
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t('team.mobile')}</Label>
                  <Input 
                    value={formData.mobile || ''} 
                    onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>{t('team.department')}</Label>
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
                      variant={formData.specialisatie?.includes(spec) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        formData.specialisatie?.includes(spec) && 'bg-ka-green hover:bg-ka-green/90'
                      )}
                      onClick={() => toggleSpecialisatie(spec)}
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>{t('team.hourlyRate')}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input 
                    type="number"
                    value={formData.hourly_rate || ''} 
                    onChange={e => setFormData(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
                    className="pl-8"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Access Tab */}
            <TabsContent value="access" className="space-y-4 mt-4">
              <div>
                <Label>{t('team.role')}</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={v => setFormData(prev => ({ ...prev, role: v as UserRole }))}
                  disabled={isOwnerUser}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isOwnerUser && <SelectItem value="Owner">Owner</SelectItem>}
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Employee">{t('team.employee')}</SelectItem>
                  </SelectContent>
                </Select>
                {isOwnerUser && (
                  <p className="text-xs text-muted-foreground mt-1">{t('team.ownerRoleNote')}</p>
                )}
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('team.bsnAccess')}</Label>
                    <p className="text-xs text-muted-foreground">{t('team.bsnAccessDescription')}</p>
                  </div>
                  <Switch 
                    checked={formData.can_access_bsn} 
                    onCheckedChange={handleBSNToggle}
                    disabled={!canEditBSNAccess}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('team.canManageUsers')}</Label>
                    <p className="text-xs text-muted-foreground">{t('team.canManageUsersDescription')}</p>
                  </div>
                  <Switch 
                    checked={formData.can_manage_users} 
                    onCheckedChange={v => setFormData(prev => ({ ...prev, can_manage_users: v }))}
                    disabled={!isOwner || isOwnerUser}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('team.canDeleteRecords')}</Label>
                    <p className="text-xs text-muted-foreground">{t('team.canDeleteRecordsDescription')}</p>
                  </div>
                  <Switch 
                    checked={formData.can_delete_records} 
                    onCheckedChange={v => setFormData(prev => ({ ...prev, can_delete_records: v }))}
                    disabled={!isOwner}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label>{t('team.activeStatus')}</Label>
                    <p className="text-xs text-muted-foreground">{t('team.activeStatusDescription')}</p>
                  </div>
                  <Switch 
                    checked={formData.is_active} 
                    onCheckedChange={v => setFormData(prev => ({ ...prev, is_active: v }))}
                    disabled={isOwnerUser}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div>
                <Label>{t('team.language')}</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={v => setFormData(prev => ({ ...prev, language: v as 'nl' | 'en' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nl">Nederlands</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>{t('team.theme')}</Label>
                <Select 
                  value={formData.theme} 
                  onValueChange={v => setFormData(prev => ({ ...prev, theme: v as User['theme'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('team.themeLight')}</SelectItem>
                    <SelectItem value="dark">{t('team.themeDark')}</SelectItem>
                    <SelectItem value="system">{t('team.themeSystem')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateUser.isPending}
              className="bg-ka-green hover:bg-ka-green/90"
            >
              {t('common.save')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* BSN Warning Dialog */}
      <AlertDialog open={showBSNWarning} onOpenChange={setShowBSNWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {t('team.bsnWarningTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('team.bsnWarningDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBSNChange}>
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
