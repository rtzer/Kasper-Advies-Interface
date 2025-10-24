import { useTaken } from '@/lib/api/taken';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function ToReviewPage() {
  const { data, isLoading } = useTaken();
  
  const taken = data?.results || [];
  
  // Filter tasks that need approval
  const toReview = taken.filter(
    (taak) => taak.approval_status === 'pending'
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-600';
      case 'Hoog': return 'bg-orange-600';
      case 'Normaal': return 'bg-blue-600';
      case 'Laag': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="w-8 h-8 text-yellow-500" />
            Te Beoordelen
          </h1>
          <p className="text-muted-foreground mt-1">
            Taken die wachten op jouw beoordeling
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {toReview.length} taken
        </Badge>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </>
        ) : toReview.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">
              Alles is beoordeeld!
            </h3>
            <p className="text-muted-foreground">
              Er staan geen taken meer te wachten op beoordeling
            </p>
          </Card>
        ) : (
          toReview.map((taak) => (
            <Link key={taak.id} to={`/tasks/${taak.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-yellow-500">
                        Wacht op goedkeuring
                      </Badge>
                      {taak.priority && (
                        <Badge className={getPriorityColor(taak.priority)}>
                          {taak.priority}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {taak.taak_omschrijving}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {taak.klant_naam}
                      {taak.opdracht_naam && ` • ${taak.opdracht_naam}`}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Door: {taak.toegewezen_aan}</span>
                      {taak.deadline && (
                        <span>
                          Deadline: {new Date(taak.deadline).toLocaleDateString('nl-NL')}
                        </span>
                      )}
                    </div>

                    {taak.blocked_reason && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Opmerking:</strong> {taak.blocked_reason}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      // Navigate to detail page for review
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Beoordelen
                  </Button>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
