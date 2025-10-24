import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MoreVertical, Phone, Video, Mail, Archive, Tag } from "lucide-react";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { useConversation, useConversationMessages } from "@/lib/api/conversations";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeChannelForIcon } from "@/lib/utils/channelHelpers";

export default function FlowbiteConversationDetail() {
  const { id } = useParams();
  const { data: conversation, isLoading } = useConversation(id || "1");
  const { data: messagesData } = useConversationMessages(id || "1");
  
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
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Phone className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Mail className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Archive className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-3 border-b border-gray-200 dark:border-gray-700">
            <button className="px-1 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Gesprek
            </button>
            <button className="px-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Contact Info
            </button>
            <button className="px-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Geschiedenis
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          <FlowbiteChatView
            conversationName={conversation.klant_naam}
            conversationAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
            channel={normalizeChannelForIcon(conversation.primary_channel)}
            messages={messages}
            isOnline={conversation.status === 'open'}
            clientId={conversation.klant_id}
          />
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
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {conversation.tags && conversation.tags.length > 0 ? (
                conversation.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">Geen tags</p>
              )}
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Conversatie Details</h4>
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
    </div>
  );
}
