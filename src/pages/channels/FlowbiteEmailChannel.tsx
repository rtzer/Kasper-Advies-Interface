import { useState, useMemo, useEffect } from "react";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { Search, Mail } from "lucide-react";

const conversations = [
  {
    id: "email-1",
    name: "Ronald Richards",
    lastMessage: "Question about invoice #12345",
    timestamp: "15m ago",
    channel: "email" as const,
    unreadCount: 1,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ronald",
  },
  {
    id: "email-2",
    name: "Esther Howard",
    lastMessage: "Re: Order delivery status",
    timestamp: "2h ago",
    channel: "email" as const,
    unreadCount: 0,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
  },
];

export default function FlowbiteEmailChannel() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Email
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Zoek emails..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <FlowbiteConversationItem
                key={conversation.id}
                {...conversation}
                isActive={conversation.id === selectedConversationId}
                onClick={() => setSelectedConversationId(conversation.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Geen emails gevonden
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Thread View */}
      <div className="flex-1 bg-white dark:bg-gray-900 p-8 overflow-y-auto">
        {selectedConversation && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedConversation.lastMessage}
            </h2>

            {/* Email Thread */}
            <div className="space-y-4">
              <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={selectedConversation.avatarUrl}
                      alt={selectedConversation.name}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedConversation.name.toLowerCase().replace(' ', '.')}@example.com
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedConversation.timestamp}
                  </span>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Hi, I have a question about my recent invoice. The amount seems incorrect and I would like to discuss this with someone from your team.
                  </p>
                </div>
              </div>

              {/* Reply Form */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Antwoorden
                </h4>
                <textarea
                  rows={6}
                  className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Typ je antwoord..."
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600"
                  >
                    Annuleren
                  </button>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                  >
                    Versturen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="w-80 bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto p-6">
        <div className="text-center mb-6">
          <img
            className="w-20 h-20 rounded-full mx-auto mb-3"
            src={selectedConversation?.avatarUrl}
            alt={selectedConversation?.name}
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedConversation?.name}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <dt className="mb-1 text-xs text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">
              {selectedConversation?.name.toLowerCase().replace(' ', '.')}@example.com
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-gray-500 dark:text-gray-400">Bedrijf</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">
              Digital Marketing Inc
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
