/**
 * DeadlineBadge Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Displays deadline indicators:
 * - Negative days: "Xd te laat" (red)
 * - 0 days: "Vandaag" (yellow)
 * - Positive days: "Xd" (gray)
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface DeadlineBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  daysLeft: number;
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  default: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

export function DeadlineBadge({
  daysLeft,
  size = "default",
  className,
  ...props
}: DeadlineBadgeProps) {
  const { t } = useTranslation(['common']);

  const getConfig = () => {
    if (daysLeft < 0) {
      // Overdue - red
      return {
        label: t('tasks.daysLate', { count: Math.abs(daysLeft) }) || `${Math.abs(daysLeft)}d te laat`,
        className: "bg-alert-error-bg text-alert-error-text border-alert-error-border",
      };
    }
    if (daysLeft === 0) {
      // Today - yellow/warning
      return {
        label: t('tasks.deadlineToday') || "Vandaag",
        className: "bg-alert-warning-bg text-alert-warning-text border-alert-warning-border",
      };
    }
    // Future - gray
    return {
      label: `${daysLeft}d`,
      className: "bg-ka-gray-100 text-ka-gray-700 border-ka-gray-300 dark:bg-ka-gray-800 dark:text-ka-gray-300 dark:border-ka-gray-600",
    };
  };

  const config = getConfig();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.className,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {config.label}
    </div>
  );
}

