import { useState } from 'react';
import { useTaken } from '@/lib/api/taken';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamTasksPage() {
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const { data, isLoading } = useTaken();
  
  const taken = data?.results || [];
  
  // Get unique team members
  const teamMembers = Array.from(new Set(taken.map(t => t.toegewezen_aan)));
  
  const filteredTaken = selectedMember === 'all' 
    ? taken 
    : taken.filter(t => t.toegewezen_aan === selectedMember);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Afgerond': return 'bg-green-500';
      case 'In uitvoering': return 'bg-blue-500';
      case 'Geblokkeerd': return 'bg-red-500';
      case 'Te doen': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600';
      case 'Hoog': return 'text-orange-600';
      case 'Normaal': return 'text-blue-600';
      case 'Laag': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Team Taken
          </h1>
          <p className="text-muted-foreground mt-1">
            Overzicht van alle taken van het team
          </p>
        </div>
      </div>

      <Card className="p-4">
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Selecteer teamlid" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle teamleden</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member} value={member}>
                {member}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </>
        ) : filteredTaken.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">
              Geen taken gevonden
            </h3>
          </Card>
        ) : (
          filteredTaken.map((taak) => (
            <Link key={taak.id} to={`/tasks/${taak.id}`}>
              <Card className="p-4 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(taak.toegewezen_aan)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {taak.taak_omschrijving}
                        </h3>
                        {taak.priority && (
                          <span className={`text-xs font-medium ${getPriorityColor(taak.priority)}`}>
                            {taak.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {taak.klant_naam}
                        {taak.opdracht_naam && ` • ${taak.opdracht_naam}`}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{taak.toegewezen_aan}</span>
                        {taak.deadline && (
                          <span>
                            Deadline: {new Date(taak.deadline).toLocaleDateString('nl-NL')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(taak.status)}>
                    {taak.status}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {!isLoading && filteredTaken.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {filteredTaken.length} {filteredTaken.length === 1 ? 'taak' : 'taken'}
        </div>
      )}
    </div>
  );
}
