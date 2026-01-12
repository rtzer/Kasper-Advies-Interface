/**
 * SplitPanel Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Multi-panel layouts (list + detail, master-detail).
 * Responsive: stacks on mobile, side-by-side on desktop.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDeviceChecks } from "@/hooks/useBreakpoint";

export interface SplitPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string;
  rightWidth?: string;
  divider?: boolean;
}

export function SplitPanel({
  left,
  right,
  leftWidth = "w-full md:w-1/3",
  rightWidth = "w-full md:w-2/3",
  divider = true,
  className,
  ...props
}: SplitPanelProps) {
  const { isMobile } = useDeviceChecks();

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row h-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex-shrink-0 overflow-y-auto",
          isMobile ? "w-full border-b" : leftWidth,
          divider && !isMobile && "border-r border-border"
        )}
      >
        {left}
      </div>
      <div
        className={cn(
          "flex-1 overflow-y-auto",
          isMobile ? "w-full" : rightWidth
        )}
      >
        {right}
      </div>
    </div>
  );
}

