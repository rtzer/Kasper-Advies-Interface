import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Prospect, ProspectStatus } from '@/types';
import { useUpdateProspect } from '@/lib/api/prospects';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProspectTypeBadge } from './ProspectTypeBadge';
import { Calendar, Euro } from 'lucide-react';

interface ProspectsPipelineProps {
  prospects: Prospect[];
  onSelectProspect: (prospect: Prospect) => void;
}

const pipelineColumns: { status: ProspectStatus; colorClass: string; headerBg: string }[] = [
  { status: 'Nieuw', colorClass: 'border-t-blue-500', headerBg: 'bg-blue-500' },
  { status: 'Contact gehad', colorClass: 'border-t-cyan-500', headerBg: 'bg-cyan-500' },
  { status: 'Gekwalificeerd', colorClass: 'border-t-orange-500', headerBg: 'bg-orange-500' },
  { status: 'Offerte', colorClass: 'border-t-purple-500', headerBg: 'bg-purple-500' },
  { status: 'Gewonnen', colorClass: 'border-t-ka-green', headerBg: 'bg-ka-green' },
  { status: 'Verloren', colorClass: 'border-t-gray-400', headerBg: 'bg-gray-400' },
];

export function ProspectsPipeline({ prospects, onSelectProspect }: ProspectsPipelineProps) {
  const { t, i18n } = useTranslation();
  const updateProspect = useUpdateProspect();
  const locale = i18n.language === 'nl' ? nl : enUS;

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const prospectId = result.draggableId;
    const newStatus = result.destination.droppableId as ProspectStatus;

    // Don't allow dragging to closed statuses
    if (newStatus === 'Gewonnen' || newStatus === 'Verloren') {
      toast.error(t('prospects.cannotDragToClosedStatus'));
      return;
    }

    const prospect = prospects.find(p => p.id === prospectId);
    if (!prospect || prospect.status === newStatus) return;

    // Don't allow changing closed prospects
    if (prospect.status === 'Gewonnen' || prospect.status === 'Verloren') {
      toast.error(t('prospects.cannotChangeClosedProspect'));
      return;
    }

    try {
      await updateProspect.mutateAsync({
        id: prospectId,
        data: { 
          status: newStatus,
          laatste_contact_datum: new Date().toISOString().split('T')[0],
        },
      });
      toast.success(t('prospects.statusUpdated'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const getProspectsByStatus = (status: ProspectStatus) =>
    prospects.filter(p => p.status === status);

  const getColumnTotal = (status: ProspectStatus) =>
    prospects
      .filter(p => p.status === status)
      .reduce((sum, p) => sum + (p.verwachte_waarde || 0), 0);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineColumns.map(column => {
          const columnProspects = getProspectsByStatus(column.status);
          const columnTotal = getColumnTotal(column.status);
          const isClosed = column.status === 'Gewonnen' || column.status === 'Verloren';

          return (
            <div key={column.status} className="flex-shrink-0 w-72">
              {/* Column header */}
              <div className={`${column.headerBg} text-white rounded-t-lg px-3 py-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{column.status}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {columnProspects.length}
                  </Badge>
                </div>
                {columnTotal > 0 && (
                  <div className="text-sm text-white/80 mt-1">
                    €{columnTotal.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Droppable area */}
              <Droppable droppableId={column.status} isDropDisabled={isClosed}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[400px] rounded-b-lg border border-t-0 p-2 space-y-2
                      ${snapshot.isDraggingOver && !isClosed ? 'bg-muted/50' : 'bg-muted/20'}
                      ${column.colorClass} border-t-4
                    `}
                  >
                    {columnProspects.map((prospect, index) => (
                      <Draggable 
                        key={prospect.id} 
                        draggableId={prospect.id} 
                        index={index}
                        isDragDisabled={isClosed}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              cursor-pointer hover:shadow-md transition-shadow
                              ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                              ${isClosed ? 'opacity-60' : ''}
                            `}
                            onClick={() => onSelectProspect(prospect)}
                          >
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="font-medium text-sm truncate">
                                  {prospect.bedrijfsnaam || `${prospect.voornaam} ${prospect.achternaam}`}
                                </div>
                                <ProspectTypeBadge type={prospect.type_prospect} className="text-[10px] px-1.5" />
                              </div>

                              {prospect.interesse.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {prospect.interesse.slice(0, 2).map(i => (
                                    <Badge key={i} variant="outline" className="text-[10px] px-1">
                                      {i}
                                    </Badge>
                                  ))}
                                  {prospect.interesse.length > 2 && (
                                    <Badge variant="outline" className="text-[10px] px-1">
                                      +{prospect.interesse.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(prospect.volgende_actie_datum), 'dd MMM', { locale })}
                                </div>
                                {prospect.verwachte_waarde && (
                                  <div className="flex items-center gap-1">
                                    <Euro className="w-3 h-3" />
                                    {prospect.verwachte_waarde.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
