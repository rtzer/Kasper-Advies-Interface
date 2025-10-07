import { MessageSquare } from "lucide-react";

interface FlowbiteGenericChannelProps {
  channelName: string;
  icon?: React.ComponentType<any>;
  color?: string;
}

export default function FlowbiteGenericChannel({ 
  channelName, 
  icon: Icon = MessageSquare, 
  color = "text-blue-600" 
}: FlowbiteGenericChannelProps) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 ${color}`}>
          <Icon className="w-10 h-10" />
        </div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          {channelName}
        </h2>
        <p className="max-w-md text-gray-500 dark:text-gray-400">
          De {channelName.toLowerCase()} interface komt binnenkort beschikbaar.
        </p>
      </div>
    </div>
  );
}
