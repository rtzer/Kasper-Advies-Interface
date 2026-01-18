/**
 * StickyHeader Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Persistent header with user context and actions.
 * Sticks to top of viewport with shadow for depth.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StickyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function StickyHeader({
  title,
  subtitle,
  actions,
  className,
  ...props
}: StickyHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex items-center justify-between",
        "h-14 px-4 sm:px-6",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-b border-border",
        "shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

