import { useState } from 'react';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function ByTypePage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const { data, isLoading } = useOpdrachten();
  
  const opdrachten = data?.results || [];
  
  // Get unique types
  const types = Array.from(new Set(opdrachten.map(o => o.type_opdracht)));
  
  const filteredOpdrachten = selectedType === 'all' 
    ? opdrachten 
    : opdrachten.filter(o => o.type_opdracht === selectedType);

  const getTypeIcon = (type: string) => {
    return <FileText className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Afgerond': return 'bg-green-500';
      case 'Ingediend': return 'bg-green-600';
      case 'In behandeling': return 'bg-blue-500';
      case 'Gereed voor controle': return 'bg-orange-500';
      case 'Wacht op klant': return 'bg-yellow-500';
      case 'On hold': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderOpen className="w-8 h-8 text-primary" />
            Opdrachten per Type
          </h1>
          <p className="text-muted-foreground mt-1">
            Opdrachten georganiseerd op type
          </p>
        </div>
      </div>

      <Card className="p-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Selecteer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alle ({filteredOpdrachten.length})</TabsTrigger>
          <TabsTrigger value="active">
            Actief ({filteredOpdrachten.filter(o => !['Afgerond', 'Ingediend'].includes(o.status)).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Afgerond ({filteredOpdrachten.filter(o => ['Afgerond', 'Ingediend'].includes(o.status)).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </>
          ) : filteredOpdrachten.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">
                Geen opdrachten gevonden
              </h3>
            </Card>
          ) : (
            filteredOpdrachten.map((opdracht) => (
              <Link key={opdracht.id} to={`/assignments/${opdracht.id}`}>
                <Card className="p-4 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {getTypeIcon(opdracht.type_opdracht)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {opdracht.opdracht_naam}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {opdracht.klant_naam}
                          {opdracht.project_naam && ` • ${opdracht.project_naam}`}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {opdracht.type_opdracht}
                          </Badge>
                          {opdracht.deadline && (
                            <span className="text-xs text-muted-foreground">
                              Deadline: {new Date(opdracht.deadline).toLocaleDateString('nl-NL')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(opdracht.status)}>
                      {opdracht.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {filteredOpdrachten
            .filter(o => !['Afgerond', 'Ingediend'].includes(o.status))
            .map((opdracht) => (
              <Link key={opdracht.id} to={`/assignments/${opdracht.id}`}>
                <Card className="p-4 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {getTypeIcon(opdracht.type_opdracht)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {opdracht.opdracht_naam}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {opdracht.klant_naam}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(opdracht.status)}>
                      {opdracht.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {filteredOpdrachten
            .filter(o => ['Afgerond', 'Ingediend'].includes(o.status))
            .map((opdracht) => (
              <Link key={opdracht.id} to={`/assignments/${opdracht.id}`}>
                <Card className="p-4 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {getTypeIcon(opdracht.type_opdracht)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {opdracht.opdracht_naam}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {opdracht.klant_naam}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(opdracht.status)}>
                      {opdracht.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
