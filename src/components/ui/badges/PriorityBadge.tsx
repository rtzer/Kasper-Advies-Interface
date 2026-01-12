/**
 * PriorityBadge Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Displays priority indicators:
 * - Urgent: Red
 * - Hoog (High): Orange
 * - Normaal: Blue
 * - Laag (Low): Gray
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUp, Minus, ArrowDown } from "lucide-react";

export type Priority = "Urgent" | "Hoog" | "Normaal" | "Laag";

export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  priority: Priority;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
}

const priorityConfig: Record<Priority, {
  colorClass: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = {
  Urgent: {
    colorClass: "text-priority-urgent bg-priority-urgent/10 border-priority-urgent/30",
    icon: AlertCircle,
    label: "Urgent",
  },
  Hoog: {
    colorClass: "text-priority-high bg-priority-high/10 border-priority-high/30",
    icon: ArrowUp,
    label: "Hoog",
  },
  Normaal: {
    colorClass: "text-priority-normal bg-priority-normal/10 border-priority-normal/30",
    icon: Minus,
    label: "Normaal",
  },
  Laag: {
    colorClass: "text-priority-low bg-priority-low/10 border-priority-low/30",
    icon: ArrowDown,
    label: "Laag",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  default: "px-2.5 py-0.5 text-xs gap-1.5",
  lg: "px-3 py-1 text-sm gap-2",
};

const iconSizeClasses = {
  sm: "h-3 w-3",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function PriorityBadge({
  priority,
  showIcon = true,
  size = "default",
  className,
  ...props
}: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.colorClass,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showIcon && <Icon className={cn(iconSizeClasses[size], "flex-shrink-0")} />}
      <span>{config.label}</span>
    </div>
  );
}

