import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, MessageSquare, Users, Clock } from "lucide-react";

export default function FlowbiteAnalytics() {
  return (
    <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/">
            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </button>
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Analytics & Rapportage</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Inzicht in je communicatie performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Totaal Gesprekken
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs vorige periode</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gem. Reactietijd
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2m 34s</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">-8%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">sneller</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actieve Klanten
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">856</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">meer actief</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tevredenheid
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+0.2</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">hoger</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Gesprekken per Kanaal
            </h3>
            <div className="space-y-4">
              {[
                { channel: "WhatsApp", count: 523, percentage: 42, color: "bg-green-600" },
                { channel: "Email", count: 345, percentage: 28, color: "bg-blue-600" },
                { channel: "Facebook", count: 234, percentage: 19, color: "bg-indigo-600" },
                { channel: "Instagram", count: 132, percentage: 11, color: "bg-pink-600" },
              ].map((item) => (
                <div key={item.channel}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.channel}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.count} gesprekken
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Team Performance
            </h3>
            <div className="space-y-4">
              {[
                { name: "Jan van Dijk", conversations: 234, avgTime: "2m 10s", rating: 4.9 },
                { name: "Lisa Peters", conversations: 198, avgTime: "2m 45s", rating: 4.7 },
                { name: "Tom de Vries", conversations: 176, avgTime: "3m 20s", rating: 4.6 },
              ].map((member) => (
                <div key={member.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.conversations} gesprekken
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.avgTime}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ⭐ {member.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
