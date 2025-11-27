import { Globe, Users, Linkedin, Phone, Calendar, Share2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProspectBron } from '@/types';

interface ProspectSourceIconProps {
  bron: ProspectBron;
  showLabel?: boolean;
  className?: string;
}

const bronConfig: Record<ProspectBron, { 
  icon: React.ElementType; 
  colorClass: string;
}> = {
  'Website': { icon: Globe, colorClass: 'text-blue-600' },
  'Referral': { icon: Users, colorClass: 'text-ka-green' },
  'LinkedIn': { icon: Linkedin, colorClass: 'text-[#0A66C2]' },
  'Telefoon': { icon: Phone, colorClass: 'text-amber-600' },
  'Event': { icon: Calendar, colorClass: 'text-purple-600' },
  'Netwerk': { icon: Share2, colorClass: 'text-cyan-600' },
  'Anders': { icon: HelpCircle, colorClass: 'text-gray-500' },
};

export function ProspectSourceIcon({ bron, showLabel = false, className }: ProspectSourceIconProps) {
  const config = bronConfig[bron];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Icon className={cn('w-4 h-4', config.colorClass)} />
      {showLabel && <span className="text-sm text-muted-foreground">{bron}</span>}
    </div>
  );
}
