/**
 * TypeBadge Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Generic badge for displaying types/categories
 * Uses neutral styling by default, can be customized
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typeBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-ka-gray-100 text-ka-gray-700 border-ka-gray-300 dark:bg-ka-gray-800 dark:text-ka-gray-300 dark:border-ka-gray-600",
        primary: "bg-ka-green/10 text-ka-green border-ka-green/30",
        secondary: "bg-ka-navy/10 text-ka-navy border-ka-navy/30",
        accent: "bg-ka-red/10 text-ka-red border-ka-red/30",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typeBadgeVariants> {
  icon?: React.ReactNode;
}

export function TypeBadge({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: TypeBadgeProps) {
  return (
    <div
      className={cn(typeBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span className="mr-1.5 flex-shrink-0">{icon}</span>}
      {children}
    </div>
  );
}

