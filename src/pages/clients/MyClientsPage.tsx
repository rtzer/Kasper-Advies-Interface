import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useKlanten } from '@/lib/api/klanten';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyClientsPage() {
  const { t } = useTranslation('translation');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const { data, isLoading } = useKlanten();
  const klanten = data?.results || [];

  // Filter only clients assigned to current user via link_to_user
  const myKlanten = useMemo(() => {
    if (!user?.id) return [];

    return klanten.filter((klant) => {
      // Check if current user is in the assigned_user_ids array
      const isMyClient = klant.assigned_user_ids?.includes(user.id);
      const matchesSearch =
        klant.naam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        klant.klant_nummer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        klant.email?.toLowerCase().includes(searchQuery.toLowerCase());

      return isMyClient && matchesSearch;
    });
  }, [klanten, searchQuery, user]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8 text-ka-green" />
            {t('clients.myClients')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('clients.myClientsSubtitle')}
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('clients.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </>
        ) : myKlanten.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">
              {t('clients.noResults')}
            </h3>
            <p className="text-muted-foreground">
              {t('clients.noClientsAssigned')}
            </p>
          </Card>
        ) : (
          myKlanten.map((klant) => (
            <Link key={klant.id} to={`/app/clients/${klant.id}`}>
              <Card className="p-4 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold">
                        {klant.type_klant === 'MKB' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {klant.naam}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {klant.klant_nummer}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      {klant.email && (
                        <a 
                          href={`mailto:${klant.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-ka-green transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{klant.email}</span>
                        </a>
                      )}
                      {klant.telefoonnummer && (
                        <a 
                          href={`tel:${klant.telefoonnummer}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-ka-green transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{klant.telefoonnummer}</span>
                        </a>
                      )}
                      {klant.plaats && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{klant.plaats}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={klant.status === 'Actief' ? 'default' : 'secondary'}>
                      {klant.status}
                    </Badge>
                    <Badge variant="outline">
                      {klant.type_klant}
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {!isLoading && myKlanten.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {t('clients.clientCount', { count: myKlanten.length })}
        </div>
      )}
    </div>
  );
}
