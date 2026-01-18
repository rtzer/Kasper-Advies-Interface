/**
 * StatusBadge Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Displays status indicators with semantic colors
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Info, Circle } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-alert-success-bg text-alert-success-text border-alert-success-border",
        warning: "bg-alert-warning-bg text-alert-warning-text border-alert-warning-border",
        error: "bg-alert-error-bg text-alert-error-text border-alert-error-border",
        info: "bg-alert-info-bg text-alert-info-text border-alert-info-border",
        neutral: "bg-ka-gray-100 text-ka-gray-700 border-ka-gray-300 dark:bg-ka-gray-800 dark:text-ka-gray-300 dark:border-ka-gray-600",
        brand: "bg-ka-green/10 text-ka-green border-ka-green/30",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
}

const variantIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  neutral: Circle,
  brand: CheckCircle2,
};

export function StatusBadge({
  className,
  variant,
  size,
  dot,
  icon,
  children,
  ...props
}: StatusBadgeProps) {
  const IconComponent = variant && !icon ? variantIcons[variant] : null;

  return (
    <div
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {IconComponent && !icon && (
        <IconComponent className="h-3 w-3 flex-shrink-0" />
      )}
      {children && <span>{children}</span>}
    </div>
  );
}

