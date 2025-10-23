import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, DollarSign, User, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { formatDate, daysUntilDeadline, isOverdue } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { Link } from 'react-router-dom';

export default function AssignmentsPage() {
  const { t } = useTranslation(['common']);
  const { currentUser } = useUserStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data: opdrachtenData, isLoading } = useOpdrachten();
  
  const opdrachten = opdrachtenData?.results || [];
  
  // Filter assignments
  const filteredOpdrachten = opdrachten.filter((opdracht) => {
    if (filterStatus === 'all') return true;
    return opdracht.status === filterStatus;
  });
  
  return (
    <div className="p-6 space-y-6 bg-ka-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ka-navy dark:text-white">Opdrachten</h1>
          <p className="text-sm text-ka-gray-600 dark:text-gray-400 mt-1">
            {filteredOpdrachten.length} {filteredOpdrachten.length === 1 ? 'opdracht' : 'opdrachten'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Alle statussen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="Nieuw">Nieuw</SelectItem>
              <SelectItem value="In behandeling">In behandeling</SelectItem>
              <SelectItem value="Afgerond">Afgerond</SelectItem>
              <SelectItem value="On hold">On hold</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-ka-green hover:bg-ka-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe opdracht
          </Button>
        </div>
      </div>
      
      {/* Assignments grid */}
      {isLoading ? (
        <div className="text-center py-12 text-ka-gray-500 dark:text-gray-400">
          Laden...
        </div>
      ) : filteredOpdrachten.length === 0 ? (
        <div className="text-center py-12 text-ka-gray-500 dark:text-gray-400">
          Geen opdrachten gevonden
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOpdrachten.map((opdracht) => {
            const daysLeft = opdracht.deadline ? daysUntilDeadline(opdracht.deadline) : null;
            const overdue = opdracht.deadline ? isOverdue(opdracht.deadline) : false;
            
            return (
              <Link key={opdracht.id} to={`/assignments/${opdracht.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ka-navy dark:text-white">
                        {opdracht.opdracht_naam}
                      </h3>
                      <Link 
                        to={`/clients/${opdracht.klant_id}`}
                        className="text-sm text-ka-gray-600 dark:text-gray-300 hover:underline mt-1 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {opdracht.klant_naam}
                      </Link>
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        {opdracht.deadline && (
                          <span className={`flex items-center ${
                            overdue ? 'text-ka-danger' : 'text-ka-gray-500 dark:text-gray-400'
                          }`}>
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(opdracht.deadline, currentUser?.language || 'nl')}
                          </span>
                        )}
                        <span className="flex items-center text-ka-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          {opdracht.verantwoordelijk}
                        </span>
                        {opdracht.gefactureerd_bedrag > 0 && (
                          <span className="flex items-center text-ka-green">
                            <DollarSign className="w-4 h-4 mr-1" />
                            €{opdracht.gefactureerd_bedrag.toLocaleString('nl-NL')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={
                        opdracht.status === 'Afgerond' ? 'bg-ka-green' :
                        opdracht.status === 'In behandeling' ? 'bg-ka-warning' :
                        opdracht.status === 'Gereed' ? 'bg-ka-green' :
                        opdracht.status === 'Wacht op klant' ? 'bg-ka-gray-500' :
                        'bg-ka-navy'
                      }>
                        {opdracht.status}
                      </Badge>
                      
                      {daysLeft !== null && daysLeft < 7 && !overdue && (
                        <Badge variant="destructive">
                          {daysLeft} {daysLeft === 1 ? 'dag' : 'dagen'}
                        </Badge>
                      )}
                      
                      {overdue && (
                        <Badge className="bg-ka-danger">
                          Verlopen
                        </Badge>
                      )}
                      
                      {opdracht.priority === 'Urgent' && (
                        <Badge className="bg-red-600">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
