import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link2, FileText, CheckSquare, Briefcase } from 'lucide-react';
import { Interactie } from '@/types';

interface InteractieKoppelingenSectionProps {
  interactie: Interactie;
}

export default function InteractieKoppelingenSection({ interactie }: InteractieKoppelingenSectionProps) {
  const { gekoppelde_items } = interactie;

  if (!gekoppelde_items || gekoppelde_items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Link2 className="w-4 h-4 text-ka-navy dark:text-ka-green" />
        <h4 className="text-sm font-semibold text-ka-navy dark:text-white">
          Gekoppelde onderwerpen
        </h4>
        <Badge variant="secondary" className="text-xs">
          {gekoppelde_items.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {gekoppelde_items.map((item, index) => (
          <Card key={index} className="p-4 bg-ka-gray-50 dark:bg-gray-800">
            <div className="space-y-2">
              {/* Onderwerp titel */}
              <div className="flex items-start justify-between">
                <h5 className="font-medium text-ka-navy dark:text-white">
                  {item.onderwerp}
                </h5>
              </div>

              {/* Gekoppelde items */}
              <div className="flex flex-wrap gap-2 text-xs">
                {item.project_id && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Briefcase className="w-3 h-3" />
                    <span>Project: {item.project_id}</span>
                  </Badge>
                )}
                
                {item.opdracht_id && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Opdracht: {item.opdracht_id}</span>
                  </Badge>
                )}
                
                {item.taak_ids && item.taak_ids.length > 0 && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <CheckSquare className="w-3 h-3" />
                    <span>{item.taak_ids.length} {item.taak_ids.length === 1 ? 'taak' : 'taken'}</span>
                  </Badge>
                )}
              </div>

              {/* Notities */}
              {item.notities && (
                <>
                  <Separator className="my-2" />
                  <p className="text-sm text-ka-gray-600 dark:text-gray-400 italic">
                    {item.notities}
                  </p>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          💡 Dit contactmoment ging over <strong>{gekoppelde_items.length} verschillende onderwerpen</strong>. 
          Elk onderwerp kan aan andere projecten en taken gekoppeld zijn.
        </p>
      </div>
    </div>
  );
}
