/**
 * ImmersivePageWrapper Component
 * Based on Kaspers Advies Brand Guide
 * 
 * Full-bleed, inbox-style layout for immersive pages.
 * Removes default padding and provides full viewport height.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ImmersivePageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ImmersivePageWrapper({
  children,
  className,
  ...props
}: ImmersivePageWrapperProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col overflow-hidden",
        "bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

