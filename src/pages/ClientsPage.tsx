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
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { isMobile } = useDeviceChecks();
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
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Header - Optimized for 360px */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className={`${responsiveHeading.h2} flex items-center gap-2`}>
            <Users className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-ka-green flex-shrink-0" />
            <span className="truncate">Klanten</span>
          </h1>
          <p className={`${responsiveBody.small} mt-0.5 xs:mt-1 truncate`}>
            Beheer al uw klantrelaties op één plek
          </p>
        </div>
        <Button 
          className="bg-ka-green hover:bg-ka-green/90 w-full xs:w-auto h-10 xs:h-11 text-sm xs:text-base flex-shrink-0" 
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5 xs:mr-2" />
          {isMobile ? 'Nieuw' : 'Nieuwe Klant'}
        </Button>
      </div>

      <CreateClientDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* Stats Cards - Optimized for 360px */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium mb-0.5">Totaal</div>
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-ka-navy dark:text-white">{stats.total}</div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium mb-0.5">Actief</div>
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-ka-green dark:text-ka-green-light">{stats.actief}</div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium mb-0.5">Inactief</div>
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-ka-gray-500 dark:text-gray-400">{stats.inactief}</div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium mb-0.5">ZZP</div>
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-ka-navy dark:text-ka-navy-light">{stats.zzp}</div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium mb-0.5">MKB</div>
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-ka-navy dark:text-ka-navy-light">{stats.mkb}</div>
        </Card>
      </div>

      {/* Filters - Fully stacked on 360px */}
      <Card className="px-3 xs:px-4 py-3 xs:py-4 border-ka-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-2 xs:gap-2.5 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 xs:left-3 top-1/2 transform -translate-y-1/2 text-ka-gray-400 w-3.5 h-3.5 xs:w-4 xs:h-4" />
            <Input
              placeholder={isMobile ? "Zoeken..." : "Zoek op naam, nummer, email..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 xs:pl-10 h-9 xs:h-10 text-xs xs:text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] lg:w-[180px] h-9 xs:h-10 text-xs xs:text-sm">
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
            <SelectTrigger className="w-full sm:w-[140px] lg:w-[180px] h-9 xs:h-10 text-xs xs:text-sm">
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

      {/* Clients List - Optimized for 360px */}
      <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="px-3 xs:px-4 py-3 xs:py-4 border-ka-gray-200 dark:border-gray-700">
                <Skeleton className="h-16 xs:h-20 w-full" />
              </Card>
            ))}
          </>
        ) : filteredKlanten.length === 0 ? (
          <Card className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 text-center border-ka-gray-200 dark:border-gray-700">
            <Users className="w-10 h-10 xs:w-12 xs:h-12 text-ka-gray-400 mx-auto mb-2 xs:mb-3" />
            <h3 className={`${responsiveHeading.h4} mb-1`}>
              Geen klanten gevonden
            </h3>
            <p className={responsiveBody.small}>
              Probeer een andere zoekterm of filter
            </p>
          </Card>
        ) : (
          filteredKlanten.map((klant) => (
            <Link key={klant.id} to={`/clients/${klant.id}`}>
              <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 hover:shadow-lg transition-all hover:border-ka-green cursor-pointer border-ka-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                  {/* Avatar - Smaller on mobile */}
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-ka-green to-ka-navy flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {klant.type_klant === 'MKB' ? (
                      <Building2 className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <User className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Name & Number */}
                    <div className="flex items-start justify-between gap-2 mb-1 xs:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-ka-navy dark:text-white truncate">
                          {klant.naam}
                        </h3>
                        <p className="text-[10px] xs:text-xs sm:text-sm text-ka-gray-500 dark:text-gray-400 font-mono">
                          {klant.klant_nummer}
                        </p>
                      </div>
                      
                      {/* Badges - Smaller on mobile */}
                      <div className="flex flex-col xs:flex-row items-end xs:items-center gap-1 flex-shrink-0">
                        <Badge 
                          className={`text-[9px] xs:text-[10px] px-1.5 py-0 xs:py-0.5 ${
                            klant.status === 'Actief' 
                              ? 'bg-ka-green text-white' 
                              : 'bg-ka-gray-300 text-ka-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {klant.status}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] xs:text-[10px] px-1.5 py-0 xs:py-0.5">
                          {klant.type_klant}
                        </Badge>
                      </div>
                    </div>

                    {/* Contact Info - Stack on mobile */}
                    <div className="flex flex-col xs:grid xs:grid-cols-2 lg:grid-cols-3 gap-1 xs:gap-2 sm:gap-3">
                      {klant.email && (
                        <a 
                          href={`mailto:${klant.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs sm:text-sm text-ka-gray-600 dark:text-gray-400 hover:text-ka-green transition-colors truncate"
                        >
                          <Mail className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{klant.email}</span>
                        </a>
                      )}
                      {klant.telefoonnummer && (
                        <a 
                          href={`tel:${klant.telefoonnummer}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs sm:text-sm text-ka-gray-600 dark:text-gray-400 hover:text-ka-green transition-colors"
                        >
                          <Phone className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{klant.telefoonnummer}</span>
                        </a>
                      )}
                      {klant.plaats && (
                        <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs sm:text-sm text-ka-gray-600 dark:text-gray-400 truncate">
                          <MapPin className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{klant.plaats}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags - Only show on larger screens or limit on mobile */}
                    {klant.tags && klant.tags.length > 0 && (
                      <div className="hidden xs:flex gap-1 flex-wrap mt-2">
                        {klant.tags.slice(0, isMobile ? 2 : 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[9px] xs:text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {isMobile && klant.tags.length > 2 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            +{klant.tags.length - 2}
                          </Badge>
                        )}
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
        <div className="text-center text-xs xs:text-sm text-ka-gray-500 dark:text-gray-400 py-2">
          {filteredKlanten.length} van {klanten.length} klanten
        </div>
      )}
    </div>
  );
}
