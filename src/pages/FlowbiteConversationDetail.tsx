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
        <div className="flex-1 p-6">
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
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
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
                alt={conversation.klant_naam}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <Link 
                  to={`/clients/${conversation.klant_id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-ka-green transition-colors hover:underline"
                >
                  {conversation.klant_naam}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.onderwerp || 'Geen onderwerp'}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded">
                {conversation.primary_channel}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t('inbox.call')}
              >
                <Phone className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t('inbox.videoCall')}
              >
                <Video className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t('inbox.sendEmail')}
              >
                <Mail className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setArchiveDialogOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={t('actions.archive')}
              >
                <Archive className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setDeleteDialogOpen(true)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                title={t('actions.delete')}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-3 border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('gesprek')}
              className={`px-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'gesprek' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('inbox.conversation')}
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              className={`px-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'contact' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t('inbox.contactInfo')}
            </button>
            <button 
              onClick={() => setActiveTab('geschiedenis')}
              className={`px-1 py-2 text-sm font-medium transition-colors ${
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
            <div className="p-6 space-y-6 overflow-y-auto h-full bg-white dark:bg-gray-900">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('inbox.contactInfo')}</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('inbox.name')}</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{conversation.klant_naam}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('clients.email')}</p>
                      <p className="text-base text-gray-900 dark:text-white">contact@{conversation.klant_naam.toLowerCase().replace(/\s+/g, '')}.nl</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('clients.phone')}</p>
                      <p className="text-base text-gray-900 dark:text-white">+31 6 1234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Tag className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('inbox.tags')}</p>
                      <div className="flex flex-wrap gap-2">
                        {conversation.tags && conversation.tags.length > 0 ? (
                          conversation.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('inbox.noTags')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'geschiedenis' && (
            <div className="p-6 overflow-y-auto h-full bg-white dark:bg-gray-900">
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('inbox.conversationHistory')}</h2>
                
                <div className="space-y-4">
                  {messagesData?.results && messagesData.results.length > 0 ? (
                    <div className="space-y-3">
                      {messagesData.results.map((msg, idx) => (
                        <div key={msg.id} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.from.naam}</p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(msg.timestamp).toLocaleString('nl-NL')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{msg.content}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">📎 {msg.attachments.length} bijlage(n)</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('inbox.noMessages')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel - Contact Details */}
      <div className="hidden xl:block w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
              alt={conversation.klant_naam}
              className="w-20 h-20 rounded-full mx-auto mb-3"
            />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{conversation.klant_naam}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.onderwerp}</p>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Tag className="h-4 w-4" />
              {t('inbox.tags')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {conversation.tags && conversation.tags.length > 0 ? (
                conversation.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('inbox.noTags')}</p>
              )}
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">{t('inbox.conversationDetails')}</h4>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
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
