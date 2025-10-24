import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useKlanten } from '@/lib/api/klanten';
import { useInteracties } from '@/lib/api/interacties';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { Link } from 'react-router-dom';

interface SearchResult {
  type: 'Klant' | 'Interactie' | 'Opdracht';
  id: string;
  name: string;
  description: string;
  url: string;
}

export default function GlobalSearch() {
  const { t } = useTranslation(['common']);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { data: klanten } = useKlanten();
  const { data: interacties } = useInteracties();
  const { data: opdrachten } = useOpdrachten();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery, klanten, interacties, opdrachten]);
  
  const performSearch = (searchQuery: string) => {
    setIsSearching(true);
    const searchResults: SearchResult[] = [];
    const lowerQuery = searchQuery.toLowerCase();
    
    try {
      // Search klanten
      klanten?.results.forEach((klant) => {
        if (
          klant.naam.toLowerCase().includes(lowerQuery) ||
          klant.klant_nummer.toLowerCase().includes(lowerQuery) ||
          klant.plaats?.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            type: 'Klant',
            id: klant.klant_nummer,
            name: klant.naam,
            description: `${klant.klant_nummer} • ${klant.plaats || 'Geen plaats'}`,
            url: `/clients/${klant.klant_nummer}`
          });
        }
      });
      
      // Search interacties
      interacties?.results.slice(0, 5).forEach((int) => {
        if (
          int.onderwerp.toLowerCase().includes(lowerQuery) ||
          int.samenvatting?.toLowerCase().includes(lowerQuery) ||
          int.klant_naam.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            type: 'Interactie',
            id: int.id,
            name: int.onderwerp,
            description: `${int.klant_naam} • ${int.kanaal}`,
            url: `/clients/${int.klant_id}`
          });
        }
      });
      
      // Search opdrachten
      opdrachten?.results.slice(0, 5).forEach((opr) => {
        if (
          opr.opdracht_naam.toLowerCase().includes(lowerQuery) ||
          opr.klant_naam.toLowerCase().includes(lowerQuery)
        ) {
          searchResults.push({
            type: 'Opdracht',
            id: opr.id,
            name: opr.opdracht_naam,
            description: `${opr.klant_naam} • ${opr.status}`,
            url: `/clients/${opr.klant_id}`
          });
        }
      });
      
      setResults(searchResults.slice(0, 10));
      setShowResults(searchResults.length > 0);
    } finally {
      setIsSearching(false);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };
  
  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ka-gray-500 dark:text-gray-400 group-hover:text-ka-green transition-colors" />
        <Input
          type="text"
          placeholder={t('common:actions.search') + ' klanten, opdrachten, taken...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-10 pr-10 bg-ka-gray-50 dark:bg-gray-700 border-ka-gray-200 dark:border-gray-600 focus:ring-ka-green focus:border-ka-green"
          title="Globale zoekopdracht - zoek door alle klanten, opdrachten en taken"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ka-gray-500 dark:text-gray-400 hover:text-ka-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-ka-gray-500 dark:text-gray-400" />
        )}
      </div>
      
      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-2">
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={result.url}
                onClick={() => setShowResults(false)}
                className="block w-full p-3 hover:bg-ka-gray-50 dark:hover:bg-gray-700 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-ka-navy dark:text-white">{result.name}</h4>
                    <p className="text-xs text-ka-gray-600 dark:text-gray-400 mt-1">{result.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs ml-3">
                    {result.type}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
      
      {showResults && results.length === 0 && !isSearching && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 z-50 bg-white dark:bg-gray-800 shadow-lg">
          <p className="text-sm text-ka-gray-500 dark:text-gray-400 text-center">
            Geen resultaten gevonden voor "{query}"
          </p>
        </Card>
      )}
    </div>
  );
}
