import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MoreVertical, Phone, Video, Mail, Archive, Tag, Trash2, User, Clock } from "lucide-react";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { useConversation, useConversationMessages } from "@/lib/api/conversations";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeChannelForIcon } from "@/lib/utils/channelHelpers";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeviceChecks } from "@/hooks/useBreakpoint";
import { responsiveHeading, responsiveBody } from "@/lib/utils/typography";

type TabType = 'gesprek' | 'contact' | 'geschiedenis';

export default function FlowbiteConversationDetail() {
  const { id } = useParams();
  const { t } = useTranslation('common');
  const { data: conversation, isLoading } = useConversation(id || "1");
  const { data: messagesData } = useConversationMessages(id || "1");
  const [activeTab, setActiveTab] = useState<TabType>('gesprek');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isMobile, isTablet } = useDeviceChecks();
  
  // Transform messages to match FlowbiteChatView format
  const messages = (messagesData?.results || []).map((msg) => ({
    id: msg.id,
    text: msg.content,
    time: new Date(msg.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    isOwn: msg.direction === 'outbound',
    senderName: msg.from.naam,
    hasAttachment: msg.attachments && msg.attachments.length > 0,
    status: msg.delivery_status as 'sent' | 'delivered' | 'read' | undefined,
  }));

  const handleArchive = () => {
    toast({
      title: t('inbox.conversationArchived'),
      description: t('inbox.conversationArchivedDesc', { name: conversation?.klant_naam }),
    });
    setArchiveDialogOpen(false);
  };

  const handleDelete = () => {
    toast({
      title: t('inbox.conversationDeleted'),
      description: t('inbox.conversationDeletedDesc', { name: conversation?.klant_naam }),
      variant: "destructive",
    });
    setDeleteDialogOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 px-3 xs:px-4 sm:px-6 py-3 xs:py-4 sm:py-6">
          <Skeleton className="h-16 xs:h-20 w-full mb-3 xs:mb-4" />
          <Skeleton className="h-80 xs:h-96" />
        </div>
      </div>
    );
  }
  
  if (!conversation) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Conversatie niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 xs:px-4 sm:px-6 py-2 xs:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 xs:gap-3 flex-1 min-w-0">
              <Link to="/app/inbox">
                <button className="p-1.5 xs:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ArrowLeft className="h-4 w-4 xs:h-5 xs:w-5" />
                </button>
              </Link>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
                alt={conversation.klant_naam}
                className="w-8 h-8 xs:w-10 xs:h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/app/clients/${conversation.klant_id}`}
                  className={`${responsiveBody.base} font-semibold text-gray-900 dark:text-white hover:text-ka-green transition-colors hover:underline block truncate`}
                >
                  {conversation.klant_naam}
                </Link>
                <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate">{conversation.onderwerp || 'Geen onderwerp'}</p>
              </div>
              {!isMobile && (
                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded flex-shrink-0">
                  {conversation.primary_channel}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 xs:gap-2 flex-shrink-0 ml-2">
              {!isMobile && (
                <>
                  <button 
                    className="p-1.5 xs:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={t('inbox.call')}
                  >
                    <Phone className="h-4 w-4 xs:h-5 xs:w-5" />
                  </button>
                  <button 
                    className="p-1.5 xs:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={t('inbox.videoCall')}
                  >
                    <Video className="h-4 w-4 xs:h-5 xs:w-5" />
                  </button>
                  <button 
                    className="p-1.5 xs:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={t('inbox.sendEmail')}
                  >
                    <Mail className="h-4 w-4 xs:h-5 xs:w-5" />
                  </button>
                </>
              )}
              <button 
                onClick={() => setArchiveDialogOpen(true)}
                className="p-1.5 xs:p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t('actions.archive')}
              >
                <Archive className="h-4 w-4 xs:h-5 xs:w-5" />
              </button>
              <button 
                onClick={() => setDeleteDialogOpen(true)}
                className="p-1.5 xs:p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                title={t('actions.delete')}
              >
                <Trash2 className="h-4 w-4 xs:h-5 xs:w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 xs:gap-4 mt-2 xs:mt-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('gesprek')}
              className={`px-1 py-1.5 xs:py-2 text-xs xs:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'gesprek' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('inbox.conversation')}
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`px-1 py-1.5 xs:py-2 text-xs xs:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'contact' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('inbox.contactInfo')}
            </button>
            <button 
              onClick={() => setActiveTab('geschiedenis')}
              className={`px-1 py-1.5 xs:py-2 text-xs xs:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'geschiedenis' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('inbox.history')}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'gesprek' && (
            <FlowbiteChatView
              conversationName={conversation.klant_naam}
              conversationAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
              channel={normalizeChannelForIcon(conversation.primary_channel)}
              messages={messages}
              isOnline={conversation.status === 'open'}
              clientId={conversation.klant_id}
            />
          )}
          
          {activeTab === 'contact' && (
            <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 sm:py-6 space-y-3 xs:space-y-4 sm:space-y-6 overflow-y-auto h-full bg-white dark:bg-gray-900">
              <div className="max-w-2xl">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>{t('inbox.contactInfo')}</h2>
                
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 xs:gap-3 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="h-4 w-4 xs:h-5 xs:w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`${responsiveBody.small} font-medium text-gray-500 dark:text-gray-400`}>{t('inbox.name')}</p>
                      <p className={`${responsiveBody.base} font-semibold text-gray-900 dark:text-white break-words`}>{conversation.klant_naam}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 xs:gap-3 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="h-4 w-4 xs:h-5 xs:w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`${responsiveBody.small} font-medium text-gray-500 dark:text-gray-400`}>{t('clients.email')}</p>
                      <p className={`${responsiveBody.base} text-gray-900 dark:text-white break-all`}>contact@{conversation.klant_naam.toLowerCase().replace(/\s+/g, '')}.nl</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 xs:gap-3 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Phone className="h-4 w-4 xs:h-5 xs:w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`${responsiveBody.small} font-medium text-gray-500 dark:text-gray-400`}>{t('clients.phone')}</p>
                      <p className={`${responsiveBody.base} text-gray-900 dark:text-white`}>+31 6 1234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 xs:gap-3 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Tag className="h-4 w-4 xs:h-5 xs:w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`${responsiveBody.small} font-medium text-gray-500 dark:text-gray-400 mb-1.5 xs:mb-2`}>{t('inbox.tags')}</p>
                      <div className="flex flex-wrap gap-1.5 xs:gap-2">
                        {conversation.tags && conversation.tags.length > 0 ? (
                          conversation.tags.map((tag) => (
                            <span key={tag} className="px-1.5 xs:px-2 py-0.5 xs:py-1 text-[10px] xs:text-xs font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className={`${responsiveBody.small} text-gray-500 dark:text-gray-400`}>{t('inbox.noTags')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'geschiedenis' && (
            <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 sm:py-6 overflow-y-auto h-full bg-white dark:bg-gray-900">
              <div className="max-w-2xl">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>{t('inbox.conversationHistory')}</h2>
                
                <div className="space-y-3 xs:space-y-4">
                  {messagesData?.results && messagesData.results.length > 0 ? (
                    <div className="space-y-2 xs:space-y-3">
                      {messagesData.results.map((msg, idx) => (
                        <div key={msg.id} className="flex gap-2 xs:gap-3 p-3 xs:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Clock className="h-4 w-4 xs:h-5 xs:w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col xs:flex-row xs:items-center gap-0.5 xs:gap-2 mb-1">
                              <p className={`${responsiveBody.small} font-medium text-gray-900 dark:text-white truncate`}>{msg.from.naam}</p>
                              <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                                {new Date(msg.timestamp).toLocaleString('nl-NL')}
                              </span>
                            </div>
                            <p className={`${responsiveBody.small} text-gray-700 dark:text-gray-300 break-words`}>{msg.content}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <p className="text-[10px] xs:text-xs text-blue-600 dark:text-blue-400 mt-1">📎 {msg.attachments.length} bijlage(n)</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`${responsiveBody.base} text-center text-gray-500 dark:text-gray-400 py-6 xs:py-8`}>{t('inbox.noMessages')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel - Contact Details */}
      <div className="hidden xl:block w-72 lg:w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="text-center">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
              alt={conversation.klant_naam}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full mx-auto mb-2 lg:mb-3"
            />
            <h3 className={`${responsiveHeading.h5} text-gray-900 dark:text-white break-words`}>{conversation.klant_naam}</h3>
            <p className={`${responsiveBody.small} text-gray-500 dark:text-gray-400 break-words`}>{conversation.onderwerp}</p>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-2 lg:space-y-3">
            <h4 className={`${responsiveBody.base} font-semibold flex items-center gap-2 text-gray-900 dark:text-white`}>
              <Tag className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              {t('inbox.tags')}
            </h4>
            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {conversation.tags && conversation.tags.length > 0 ? (
                conversation.tags.map((tag) => (
                  <span key={tag} className="px-1.5 lg:px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                    {tag}
                  </span>
                ))
              ) : (
                <p className={`${responsiveBody.tiny} text-gray-500 dark:text-gray-400`}>{t('inbox.noTags')}</p>
              )}
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-2 lg:space-y-3">
            <h4 className={`${responsiveBody.base} font-semibold text-gray-900 dark:text-white`}>{t('inbox.conversationDetails')}</h4>
            <div className="p-2.5 lg:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`${responsiveBody.tiny} text-gray-500 dark:text-gray-400 space-y-1`}>
                <p><strong>Status:</strong> {conversation.status}</p>
                <p><strong>Prioriteit:</strong> {conversation.priority}</p>
                <p><strong>Toegewezen aan:</strong> {conversation.toegewezen_aan || 'Niet toegewezen'}</p>
                <p><strong>Berichten:</strong> {conversation.message_count}</p>
                {conversation.opvolging_nodig && (
                  <p><strong>Opvolging:</strong> {conversation.opvolging_datum}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('inbox.archiveConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('inbox.archiveDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>{t('actions.archive')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('inbox.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('inbox.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
