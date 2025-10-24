import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreateClientDialog } from '@/components/clients/CreateClientDialog';
import { useKlanten } from '@/lib/api/klanten';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Plus, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, isLoading } = useKlanten();
  const klanten = data?.results || [];

  const filteredKlanten = useMemo(() => {
    return klanten.filter((klant) => {
      const matchesSearch = 
        klant.naam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        klant.klant_nummer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        klant.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || klant.status === statusFilter;
      const matchesType = typeFilter === 'all' || klant.type_klant === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [klanten, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: klanten.length,
      actief: klanten.filter(k => k.status === 'Actief').length,
      inactief: klanten.filter(k => k.status === 'Inactief').length,
      zzp: klanten.filter(k => k.type_klant === 'ZZP').length,
      mkb: klanten.filter(k => k.type_klant === 'MKB').length,
    };
  }, [klanten]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-ka-green" />
            Klanten
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Beheer al uw klantrelaties op één plek
          </p>
        </div>
        <Button className="bg-ka-green hover:bg-ka-green/90" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe Klant
        </Button>
      </div>

      <CreateClientDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Totaal</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Actief</div>
          <div className="text-2xl font-bold text-green-600">{stats.actief}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Inactief</div>
          <div className="text-2xl font-bold text-gray-600">{stats.inactief}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">ZZP</div>
          <div className="text-2xl font-bold text-blue-600">{stats.zzp}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">MKB</div>
          <div className="text-2xl font-bold text-purple-600">{stats.mkb}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Zoek op naam, nummer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="Actief">Actief</SelectItem>
              <SelectItem value="Inactief">Inactief</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle types</SelectItem>
              <SelectItem value="ZZP">ZZP</SelectItem>
              <SelectItem value="MKB">MKB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Clients List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </>
        ) : filteredKlanten.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Geen klanten gevonden
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Probeer een andere zoekterm of filter
            </p>
          </Card>
        ) : (
          filteredKlanten.map((klant) => (
            <Link key={klant.id} to={`/clients/${klant.id}`}>
              <Card className="p-4 hover:shadow-lg transition-all hover:border-ka-green cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ka-green to-ka-navy flex items-center justify-center text-white font-semibold">
                        {klant.type_klant === 'MKB' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {klant.naam}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {klant.klant_nummer}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      {klant.email && (
                        <a 
                          href={`mailto:${klant.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-ka-green transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{klant.email}</span>
                        </a>
                      )}
                      {klant.telefoonnummer && (
                        <a 
                          href={`tel:${klant.telefoonnummer}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-ka-green transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{klant.telefoonnummer}</span>
                        </a>
                      )}
                      {klant.plaats && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{klant.plaats}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge 
                        variant={klant.status === 'Actief' ? 'default' : 'secondary'}
                        className={klant.status === 'Actief' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                      >
                        {klant.status}
                      </Badge>
                      <Badge variant="outline">
                        {klant.type_klant}
                      </Badge>
                    </div>
                    {klant.tags && klant.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-end">
                        {klant.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Results count */}
      {!isLoading && filteredKlanten.length > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {filteredKlanten.length} van {klanten.length} klanten
        </div>
      )}
    </div>
  );
}
