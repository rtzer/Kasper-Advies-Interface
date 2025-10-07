import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { Search, Filter, Plus } from "lucide-react";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

const conversations = [
  {
    id: "1",
    name: "Rosemary Braun",
    lastMessage: "Hello, I received a damaged product...",
    timestamp: "2m ago",
    channel: "whatsapp" as ChannelType,
    unreadCount: 2,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  },
  {
    id: "2",
    name: "Ronald Richards",
    lastMessage: "Question about invoice #12345",
    timestamp: "15m ago",
    channel: "email" as ChannelType,
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
  },
  {
    id: "3",
    name: "Cameron Williams",
    lastMessage: "Thanks for the quick response!",
    timestamp: "1h ago",
    channel: "whatsapp" as ChannelType,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
  },
  {
    id: "4",
    name: "Esther Howard",
    lastMessage: "Order delivery status",
    timestamp: "2h ago",
    channel: "email" as ChannelType,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
  },
];

const messages = [
  { id: "1", text: "Hello, I received a damaged product in my order #12345", time: "14:32", isOwn: false, senderName: "Rosemary Braun" },
  { id: "2", text: "I'm very sorry to hear that. Can you send me a photo of the damage?", time: "14:33", isOwn: true, status: "read" as const },
  { id: "3", text: "Sure, here it is", time: "14:35", isOwn: false, hasAttachment: true },
  { id: "4", text: "Thank you. We'll send you a replacement immediately.", time: "14:36", isOwn: true, status: "delivered" as const },
];

export default function FlowbiteUnifiedInbox() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation List */}
      <div className="w-96 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Gesprekken
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-3 py-1.5 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Zoek gesprekken..."
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <Link key={conversation.id} to={`/unified-inbox/conversation/${conversation.id}`}>
                <FlowbiteConversationItem
                  {...conversation}
                  isActive={conversation.id === selectedConversationId}
                  onClick={() => setSelectedConversationId(conversation.id)}
                />
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
              <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Geen gesprekken gevonden
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Probeer een andere zoekterm
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && (
          <FlowbiteChatView
            conversationName={selectedConversation.name}
            conversationAvatar={selectedConversation.avatarUrl}
            channel={selectedConversation.channel}
            messages={messages}
            isOnline={selectedConversation.id === "1"}
          />
        )}
      </div>

      {/* Customer Info Panel */}
      <div className="w-80 bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
        <div className="p-6">
          {/* Customer Header */}
          <div className="text-center mb-6">
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4"
              src={selectedConversation?.avatarUrl}
              alt={selectedConversation?.name}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {selectedConversation?.name}
            </h3>
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
              Actieve klant
            </span>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Contact Informatie
            </h4>
            <dl className="text-sm text-gray-900 dark:text-white divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="font-semibold">rosemary.braun@example.com</dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-gray-500 dark:text-gray-400">Telefoon</dt>
                <dd className="font-semibold">+31 6 12345678</dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-gray-500 dark:text-gray-400">Bedrijf</dt>
                <dd className="font-semibold">Tech Solutions BV</dd>
              </div>
            </dl>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Statistieken
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <dt className="mb-1 text-xs text-gray-500 dark:text-gray-400">Gesprekken</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">23</dd>
              </div>
              <div className="col-span-1">
                <dt className="mb-1 text-xs text-gray-500 dark:text-gray-400">Orders</dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">12</dd>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                VIP
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                Premium
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
