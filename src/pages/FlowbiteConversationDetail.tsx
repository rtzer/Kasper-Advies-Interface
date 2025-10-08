import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MoreVertical, Phone, Video, Mail, Archive, Tag } from "lucide-react";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";

const mockConversation = {
  id: "1",
  name: "Rosemary Braun",
  email: "rosemary.braun@example.com",
  phone: "+31 6 12345678",
  company: "Tech Solutions BV",
  location: "Amsterdam, NL",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  tags: ["VIP", "Premium"],
  channel: "whatsapp" as const,
  status: "active",
};

const messages = [
  { id: "1", text: "Hello, I received a damaged product in my order #12345", time: "14:32", isOwn: false, senderName: "Rosemary Braun" },
  { id: "2", text: "I'm very sorry to hear that. Can you send me a photo of the damage?", time: "14:33", isOwn: true, status: "read" as const },
  { id: "3", text: "Sure, here it is", time: "14:35", isOwn: false, senderName: "Rosemary Braun", hasAttachment: true },
  { id: "4", text: "Thank you. We'll send you a replacement immediately.", time: "14:36", isOwn: true, status: "delivered" as const },
];

const conversationHistory = [
  { id: "1", date: "2024-01-15", channel: "email", subject: "Order inquiry", messages: 5 },
  { id: "2", date: "2024-02-03", channel: "whatsapp", subject: "Delivery question", messages: 8 },
  { id: "3", date: "2024-03-10", channel: "phone", subject: "Product support", messages: 3 },
];

export default function FlowbiteConversationDetail() {
  const { id } = useParams();

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/unified-inbox">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <img
                src={mockConversation.avatar}
                alt={mockConversation.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{mockConversation.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{mockConversation.email}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded">
                {mockConversation.channel}
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
            conversationName={mockConversation.name}
            conversationAvatar={mockConversation.avatar}
            channel={mockConversation.channel}
            messages={messages}
            isOnline={true}
          />
        </div>
      </div>

      {/* Side Panel - Contact Details */}
      <div className="hidden xl:block w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <img
              src={mockConversation.avatar}
              alt={mockConversation.name}
              className="w-20 h-20 rounded-full mx-auto mb-3"
            />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{mockConversation.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{mockConversation.company}</p>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Tag className="h-4 w-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {mockConversation.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Eerdere Gesprekken</h4>
            {conversationHistory.map((conv) => (
              <div key={conv.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{conv.subject}</h5>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Datum: {conv.date}</p>
                  <p>Kanaal: {conv.channel}</p>
                  <p>Berichten: {conv.messages}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
