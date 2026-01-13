import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, MessageSquare, Edit, Trash2 } from "lucide-react";
import { useKlant } from "@/lib/api/klanten";
import { useInteractiesByKlant } from "@/lib/api/interacties";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { useQueryClient } from "@tanstack/react-query";

export default function FlowbiteCustomerDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: klant, isLoading } = useKlant(id || "1");
  const { data: interactiesData } = useInteractiesByKlant(id || "1");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['klanten', id] });
  };
  
  const recentActivity = (interactiesData?.results || []).slice(0, 5).map((int) => ({
    id: int.id,
    type: "message",
    channel: int.kanaal.toLowerCase(),
    description: int.onderwerp || 'Interactie',
    date: formatDistanceToNow(new Date(int.datum), { addSuffix: true, locale: nl }),
  }));
  
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  
  if (!klant) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Klant niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app/clients">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Klant Details</h1>
              <p className="text-gray-500 dark:text-gray-400">Volledige informatie en activiteiten</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Bewerken
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Bericht Sturen
            </button>
            <button className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${klant.naam}`}
                    alt={klant.naam}
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{klant.naam}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{klant.status} - {klant.type_klant}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {klant.tags && klant.tags.length > 0 ? (
                        klant.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Geen tags</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.email || 'Geen email'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefoon</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.telefoonnummer || 'Geen telefoon'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Klant nummer</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.klant_nummer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Locatie</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.plaats || 'Onbekend'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex gap-4 px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
                <button className="px-1 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Activiteit
                </button>
                <button className="px-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Gesprekken
                </button>
                <button className="px-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Notities
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Recente Activiteit</h3>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        via {activity.channel} • {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Statistieken</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.status}</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.type_klant}</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Interacties</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{interactiesData?.count || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Extra Informatie</h3>
              <div className="space-y-3">
                {klant.partner_naam && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Partner</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.partner_naam}</p>
                  </div>
                )}
                {klant.website && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Website</p>
                    <a href={klant.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {klant.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* External Accountant Section */}
            {klant.accountant_kantoor && (
              <div className="bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('clients.externalAccountantSection.title')}</h3>
                  <span className="px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    {t('clients.externalAccountantSection.collaboration')}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-900 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('clients.externalAccountantSection.accountingFirm')}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{klant.accountant_kantoor}</p>
                    {klant.externe_accountant && (
                      <>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t('clients.externalAccountantSection.contactPerson')}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{klant.externe_accountant}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {klant.accountant_email && (
                    <a
                      href={`mailto:${klant.accountant_email}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <Mail className="h-4 w-4" />
                      {klant.accountant_email}
                    </a>
                  )}
                  {klant.accountant_telefoonnummer && (
                    <a
                      href={`tel:${klant.accountant_telefoonnummer}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <Phone className="h-4 w-4" />
                      {klant.accountant_telefoonnummer}
                    </a>
                  )}
                </div>

                {klant.samenwerking_sinds && (
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t('clients.externalAccountantSection.collaborationSince')} {klant.samenwerking_sinds}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Client Dialog */}
      <CreateClientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        klant={klant}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
