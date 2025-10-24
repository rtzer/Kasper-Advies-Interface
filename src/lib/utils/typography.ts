/**
 * Brand-aware responsive typography utilities
 * Based on Kaspers Advies Brand Guide
 * 
 * Font: Inter (Google Fonts)
 * Weights: 300, 400, 500, 600, 700
 */

export const responsiveHeading = {
  h1: "text-2xl sm:text-3xl lg:text-4xl font-bold text-ka-navy dark:text-white",
  h2: "text-xl sm:text-2xl lg:text-3xl font-bold text-ka-navy dark:text-white",
  h3: "text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white",
  h4: "text-base sm:text-lg font-semibold text-foreground",
  h5: "text-sm sm:text-base font-semibold text-foreground",
} as const;

export const responsiveBody = {
  large: "text-base sm:text-lg text-foreground",
  base: "text-base text-foreground",
  small: "text-sm text-muted-foreground",
  tiny: "text-xs text-muted-foreground",
} as const;

export const fontWeights = {
  light: "font-light",      // 300 - Rarely used
  regular: "font-normal",   // 400 - Body text default
  medium: "font-medium",    // 500 - Semi-emphasis
  semibold: "font-semibold", // 600 - Headers, buttons
  bold: "font-bold",        // 700 - Strong emphasis, H1
} as const;

/**
 * Get responsive heading class by level
 */
export function getHeading(level: 1 | 2 | 3 | 4 | 5): string {
  return responsiveHeading[`h${level}` as keyof typeof responsiveHeading];
}

/**
 * Get responsive body text class by size
 */
export function getBodyText(size: 'large' | 'base' | 'small' | 'tiny'): string {
  return responsiveBody[size];
}
