/**
 * Brand-aware responsive spacing utilities
 * Based on Kaspers Advies Brand Guide
 * 
 * Consistent spacing scale across all breakpoints
 */

export const spacing = {
  // Section padding - vertical spacing for major sections
  section: {
    sm: "py-6 sm:py-8 lg:py-12",      // Small sections
    md: "py-8 sm:py-12 lg:py-16",     // Standard sections
    lg: "py-12 sm:py-16 lg:py-24",    // Large sections (heroes)
  },
  
  // Container padding - horizontal spacing
  container: {
    sm: "px-4 sm:px-6",               // Tight container
    md: "px-4 sm:px-6 lg:px-8",       // Standard container
    lg: "px-6 sm:px-8 lg:px-12",      // Wide container
  },
  
  // Vertical stacks - space between elements
  stack: {
    xs: "space-y-2 sm:space-y-3",
    sm: "space-y-3 sm:space-y-4",
    md: "space-y-4 sm:space-y-6 lg:space-y-8",
    lg: "space-y-6 sm:space-y-8 lg:space-y-12",
    xl: "space-y-8 sm:space-y-12 lg:space-y-16",
  },
  
  // Grid gaps - spacing in grid layouts
  grid: {
    xs: "gap-2 sm:gap-3",
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-6 lg:gap-8",
    lg: "gap-6 sm:gap-8 lg:gap-12",
  },
  
  // Inline spacing - horizontal spacing between inline elements
  inline: {
    xs: "space-x-1 sm:space-x-2",
    sm: "space-x-2 sm:space-x-3",
    md: "space-x-3 sm:space-x-4",
    lg: "space-x-4 sm:space-x-6",
  },
} as const;

/**
 * Get responsive section padding
 */
export function getSectionPadding(size: 'sm' | 'md' | 'lg' = 'md'): string {
  return spacing.section[size];
}

/**
 * Get responsive container padding
 */
export function getContainerPadding(size: 'sm' | 'md' | 'lg' = 'md'): string {
  return spacing.container[size];
}

/**
 * Get responsive stack spacing
 */
export function getStackSpacing(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  return spacing.stack[size];
}

/**
 * Get responsive grid gap
 */
export function getGridGap(size: 'xs' | 'sm' | 'md' | 'lg' = 'md'): string {
  return spacing.grid[size];
}
