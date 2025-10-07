import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";
type ChannelFilterType = ChannelType | "all";
type StatusType = "active" | "pending" | "resolved" | "all";

interface ConversationFiltersProps {
  selectedChannels: ChannelFilterType[];
  selectedStatus: StatusType;
  onChannelChange: (channels: ChannelFilterType[]) => void;
  onStatusChange: (status: StatusType) => void;
  activeFiltersCount: number;
}

const channels: { value: ChannelType; label: string }[] = [
  { value: "whatsapp" as const, label: "WhatsApp" },
  { value: "email" as const, label: "Email" },
  { value: "phone" as const, label: "Telefoon" },
  { value: "sms" as const, label: "SMS" },
  { value: "facebook" as const, label: "Facebook" },
  { value: "instagram" as const, label: "Instagram" },
];

const statuses = [
  { value: "active" as const, label: "Actief" },
  { value: "pending" as const, label: "In afwachting" },
  { value: "resolved" as const, label: "Opgelost" },
];

export const ConversationFilters = ({
  selectedChannels,
  selectedStatus,
  onChannelChange,
  onStatusChange,
  activeFiltersCount,
}: ConversationFiltersProps) => {
  const toggleChannel = (channel: ChannelType) => {
    if (selectedChannels.includes(channel)) {
      const newChannels = selectedChannels.filter((c) => c !== channel);
      onChannelChange(newChannels.length === 0 ? ["all"] : newChannels);
    } else {
      const newChannels = selectedChannels.filter((c) => c !== "all") as ChannelFilterType[];
      onChannelChange([...newChannels, channel]);
    }
  };

  const clearFilters = () => {
    onChannelChange(["all"]);
    onStatusChange("all");
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {statuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={selectedStatus === status.value}
              onCheckedChange={() => onStatusChange(status.value)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Kanalen</DropdownMenuLabel>
          {channels.map((channel) => (
            <DropdownMenuCheckboxItem
              key={channel.value}
              checked={selectedChannels.includes(channel.value)}
              onCheckedChange={() => toggleChannel(channel.value)}
            >
              {channel.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          {activeFiltersCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={clearFilters}
              >
                Filters wissen
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
