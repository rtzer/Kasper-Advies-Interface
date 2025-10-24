import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, MessageSquare, Edit, Trash2 } from "lucide-react";

const mockCustomer = {
  id: "1",
  name: "Rosemary Braun",
  email: "rosemary.braun@example.com",
  phone: "+31 6 12345678",
  company: "Tech Solutions BV",
  location: "Amsterdam, Netherlands",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosemary",
  tags: ["VIP", "Premium", "Active"],
  status: "Active Customer",
  firstContact: "Jan 15, 2024",
  lastContact: "2 hours ago",
  totalConversations: 23,
  totalOrders: 12,
  lifetimeValue: "€4,250",
  preferredChannel: "WhatsApp",
};

const recentActivity = [
  { id: "1", type: "message", channel: "whatsapp", description: "Nieuwe conversatie gestart", date: "2 hours ago" },
  { id: "2", type: "order", channel: "email", description: "Order #12345 geplaatst", date: "1 day ago" },
  { id: "3", type: "message", channel: "email", description: "Support ticket #789 opgelost", date: "3 days ago" },
  { id: "4", type: "call", channel: "phone", description: "Telefoongesprek van 15 min", date: "1 week ago" },
];

const notes = [
  { id: "1", author: "Jan van Dijk", content: "VIP klant - altijd prioriteit geven", date: "Jan 20, 2024" },
  { id: "2", author: "Lisa Peters", content: "Geïnteresseerd in premium features", date: "Feb 5, 2024" },
];

export default function FlowbiteCustomerDetail() {
  const { id } = useParams();

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
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
            <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
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
                    src={mockCustomer.avatar}
                    alt={mockCustomer.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{mockCustomer.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{mockCustomer.status}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mockCustomer.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mockCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefoon</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mockCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bedrijf</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mockCustomer.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Locatie</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mockCustomer.location}</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Eerste Contact</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{mockCustomer.firstContact}</p>
                  </div>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Laatste Contact</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{mockCustomer.lastContact}</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Totaal Gesprekken</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockCustomer.totalConversations}</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Totaal Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockCustomer.totalOrders}</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lifetime Value</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">{mockCustomer.lifetimeValue}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Voorkeuren</h3>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Voorkeur Kanaal</p>
                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded">
                  {mockCustomer.preferredChannel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
