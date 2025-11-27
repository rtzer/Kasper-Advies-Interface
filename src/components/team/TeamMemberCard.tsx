import { useTranslation } from 'react-i18next';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RoleBadge } from './RoleBadge';
import { BSNAccessBadge } from './BSNAccessBadge';
import { SpecialisatieTags } from './SpecialisatieTags';
import { Mail, Phone, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMemberCardProps {
  user: User;
  onEdit: (user: User) => void;
  canEdit: boolean;
}

export function TeamMemberCard({ user, onEdit, canEdit }: TeamMemberCardProps) {
  const { t } = useTranslation();
  
  const initials = `${user.voornaam.charAt(0)}${user.achternaam.charAt(0)}`;
  
  const borderClass = user.role === 'Owner' 
    ? 'border-t-2 border-t-ka-green' 
    : user.role === 'Admin' 
      ? 'border-t-2 border-t-blue-500' 
      : '';
  
  return (
    <Card className={cn('hover:shadow-md transition-shadow', borderClass)}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <Avatar className="h-16 w-16 mb-3">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="text-lg bg-ka-green/10 text-ka-green font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          {/* Name and role */}
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <RoleBadge role={user.role} className="mt-1" />
          
          {/* Contact info */}
          <div className="mt-4 space-y-1 text-sm text-muted-foreground w-full">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.mobile && (
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{user.mobile}</span>
              </div>
            )}
          </div>
          
          {/* Department and specialization */}
          <div className="mt-4 text-sm w-full">
            <div className="text-muted-foreground">
              {t('team.department')}: {user.department === 'Management' ? t('team.management') : t('team.administration')}
            </div>
            {user.specialisatie && user.specialisatie.length > 0 && (
              <div className="mt-2">
                <span className="text-muted-foreground text-xs">{t('team.specialization')}:</span>
                <SpecialisatieTags 
                  specialisaties={user.specialisatie} 
                  className="justify-center mt-1" 
                />
              </div>
            )}
          </div>
          
          {/* BSN Access badge */}
          {user.can_access_bsn && (
            <div className="mt-4">
              <BSNAccessBadge />
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-4 pt-4 border-t w-full flex items-center justify-between">
            {canEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(user)}
              >
                <Pencil className="w-4 h-4 mr-1" />
                {t('common.edit')}
              </Button>
            )}
            <div className={cn('flex items-center gap-2 text-sm', !canEdit && 'ml-auto')}>
              <div className={cn(
                'w-2 h-2 rounded-full',
                user.is_active ? 'bg-ka-green' : 'bg-gray-400'
              )} />
              <span className="text-muted-foreground">
                {user.is_active ? t('team.active') : t('team.inactive')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
