import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Loader, X, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useKlanten } from '@/lib/api/klanten';
import { useInteracties } from '@/lib/api/interacties';
import { useOpdrachten } from '@/lib/api/opdrachten';

interface SearchResult {
  type: 'Klant' | 'Interactie' | 'Opdracht';
  id: string;
  name: string;
  description: string;
  url: string;
  icon: any;
}

interface InlineSearchProps {
  onOpenCommandPalette: () => void;
}

export default function InlineSearch({ onOpenCommandPalette }: InlineSearchProps) {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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
            id: klant.id,
            name: klant.naam,
            description: `${klant.klant_nummer} • ${klant.plaats || 'Geen plaats'}`,
            url: `/clients/${klant.id}`,
            icon: null,
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
            url: `/clients/${int.klant_id}`,
            icon: null,
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
            url: `/assignments/${opr.id}`,
            icon: null,
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

  const handleResultClick = (url: string) => {
    navigate(url);
    clearSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Open command palette with Cmd+K while in search
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onOpenCommandPalette();
      clearSearch();
    }
  };
  
  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t('common:actions.search') + ' klanten, opdrachten...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-24 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-ka-green focus:border-ka-green"
        />
        
        {/* Command Palette Hint */}
        <button
          onClick={onOpenCommandPalette}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Open command palette (Cmd+K)"
        >
          <Command className="w-3 h-3" />
          <span>K</span>
        </button>

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 md:right-16 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && (
          <Loader className="absolute right-2 md:right-16 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400 dark:text-gray-500" />
        )}
      </div>
      
      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result.url)}
                className="block w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{result.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{result.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs ml-3 flex-shrink-0">
                    {result.type}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
          
          {/* Command Palette CTA */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={onOpenCommandPalette}
              className="w-full p-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Command className="w-3 h-3" />
              <span>Open command palette voor meer opties (Cmd+K)</span>
            </button>
          </div>
        </Card>
      )}
      
      {showResults && results.length === 0 && !isSearching && query.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Geen resultaten gevonden voor "{query}"
          </p>
          <button
            onClick={onOpenCommandPalette}
            className="w-full mt-2 p-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Command className="w-3 h-3" />
            <span>Probeer command palette (Cmd+K)</span>
          </button>
        </Card>
      )}
    </div>
  );
}
