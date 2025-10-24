import { useOpdrachten } from '@/lib/api/opdrachten';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function AwaitingApprovalPage() {
  const { data, isLoading } = useOpdrachten();
  
  const opdrachten = data?.results || [];
  
  // Filter only assignments awaiting approval
  const awaitingApproval = opdrachten.filter(
    (opdracht) => opdracht.status === 'Gereed voor controle'
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="w-8 h-8 text-yellow-500" />
            Wacht op Goedkeuring
          </h1>
          <p className="text-muted-foreground mt-1">
            Opdrachten die wachten op jouw goedkeuring
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {awaitingApproval.length} opdrachten
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
        ) : awaitingApproval.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">
              Alles is goedgekeurd!
            </h3>
            <p className="text-muted-foreground">
              Er staan geen opdrachten meer te wachten op goedkeuring
            </p>
          </Card>
        ) : (
          awaitingApproval.map((opdracht) => (
            <Link key={opdracht.id} to={`/assignments/${opdracht.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-orange-500">
                        Gereed voor controle
                      </Badge>
                      {opdracht.priority === 'Urgent' && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {opdracht.opdracht_naam}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {opdracht.klant_naam}
                      {opdracht.project_naam && ` • ${opdracht.project_naam}`}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Verantwoordelijk: {opdracht.verantwoordelijk}</span>
                      {opdracht.deadline && (
                        <span>
                          Deadline: {new Date(opdracht.deadline).toLocaleDateString('nl-NL')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      // Navigate to detail page for approval
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
