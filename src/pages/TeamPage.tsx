import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useUsers, useUserStats, useUserPermissions } from '@/lib/api/users';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { EditUserPanel } from '@/components/team/EditUserPanel';
import { CreateUserDialog } from '@/components/team/CreateUserDialog';
import { Users, UserPlus, Briefcase, TrendingUp } from 'lucide-react';

export default function TeamPage() {
  const { t } = useTranslation();
  const { data: users = [], isLoading } = useUsers();
  const { data: stats } = useUserStats();
  const { canManageUsers, isAdmin } = useUserPermissions();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Access control - redirect if not admin
  if (!isAdmin && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditPanelOpen(true);
  };
  
  const handleCloseEdit = () => {
    setEditPanelOpen(false);
    setSelectedUser(null);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('team.title')}</h1>
          <p className="text-muted-foreground">{t('team.subtitle')}</p>
        </div>
        
        {canManageUsers && (
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t('team.newMember')}
          </Button>
        )}
      </div>
      
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-ka-navy/10 text-ka-navy dark:bg-ka-navy/20 dark:text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">{t('team.activeMembers')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                  <div className="text-sm text-muted-foreground">{t('team.totalClients')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-ka-green/10 text-ka-green">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.avgClientsPerUser}</div>
                  <div className="text-sm text-muted-foreground">{t('team.avgClients')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">{t('team.totalMembers')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Team grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-3" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-5 w-20 mb-4" />
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <TeamMemberCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              canEdit={canManageUsers}
            />
          ))}
        </div>
      )}
      
      {/* Edit panel */}
      <EditUserPanel
        user={selectedUser}
        open={editPanelOpen}
        onClose={handleCloseEdit}
      />
      
      {/* Create dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </div>
  );
}
