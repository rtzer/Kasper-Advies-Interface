/**
 * Kaspers Advies Brand Color Utilities
 * 
 * Centralized color definitions from brand guide
 * Use these instead of hardcoded colors!
 */

export const brandColors = {
  // Primary Colors
  primary: {
    green: 'hsl(var(--ka-green))',           // #7AB547 - Primary buttons, CTAs, active states
    navy: 'hsl(var(--ka-navy))',             // #1E3A5F - Headers, navigation
    red: 'hsl(var(--ka-red))',               // #E62A2A - Accent, logo checkmark, important CTAs
  },
  
  // Primary variants
  greenLight: 'hsl(var(--ka-green-light))',
  greenDark: 'hsl(var(--ka-green-dark))',
  navyLight: 'hsl(var(--ka-navy-light))',
  navyDark: 'hsl(var(--ka-navy-dark))',
  redLight: 'hsl(var(--ka-red-light))',
  redDark: 'hsl(var(--ka-red-dark))',
  
  // Gray scale
  gray: {
    50: 'hsl(var(--ka-gray-50))',   // Page backgrounds
    100: 'hsl(var(--ka-gray-100))', // Card backgrounds
    200: 'hsl(var(--ka-gray-200))', // Borders, dividers
    300: 'hsl(var(--ka-gray-300))', // Disabled states
    400: 'hsl(var(--ka-gray-400))', // Placeholders
    500: 'hsl(var(--ka-gray-500))', // Secondary text
    600: 'hsl(var(--ka-gray-600))', // Secondary text
    700: 'hsl(var(--ka-gray-700))', // Body text
    800: 'hsl(var(--ka-gray-800))', // Dark text
    900: 'hsl(var(--ka-gray-900))', // Headings
  },
  
  // Semantic colors
  semantic: {
    success: '#10B981',  // Green
    warning: '#F59E0B',  // Orange
    error: '#EF4444',    // Red
    info: '#3B82F6',     // Blue
  },
  
  // Channel colors
  channel: {
    whatsapp: 'hsl(var(--channel-whatsapp))',
    email: 'hsl(var(--channel-email))',
    phone: 'hsl(var(--channel-phone))',
    video: 'hsl(var(--channel-video))',
    social: 'hsl(var(--channel-social))',
  },
  
  // Status colors
  status: {
    online: 'hsl(var(--status-online))',
    away: 'hsl(var(--status-away))',
    offline: 'hsl(var(--status-offline))',
  },
} as const;

/**
 * Brand-aware Tailwind classes
 * Pre-built class strings for common use cases
 */
export const brandClasses = {
  // Button variants
  button: {
    primary: 'bg-ka-green hover:bg-ka-green/90 text-white active:scale-95 transition-all',
    secondary: 'bg-ka-navy hover:bg-ka-navy/90 text-white active:scale-95 transition-all',
    accent: 'bg-ka-red hover:bg-ka-red/90 text-white active:scale-95 transition-all',
    outline: 'border-2 border-ka-navy text-ka-navy hover:bg-ka-navy/10 active:scale-95 transition-all',
  },
  
  // Card variants
  card: {
    default: 'bg-card border border-ka-gray-200 dark:border-gray-700 rounded-lg',
    hover: 'bg-card border border-ka-gray-200 dark:border-gray-700 rounded-lg hover:border-ka-green/20 hover:shadow-md transition-all duration-300',
    interactive: 'bg-card border border-ka-gray-200 dark:border-gray-700 rounded-lg hover:border-ka-green/20 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer',
  },
  
  // Badge variants
  badge: {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    primary: 'bg-ka-green/10 text-ka-green border border-ka-green/20',
  },
  
  // Link variants
  link: {
    primary: 'text-ka-green hover:text-ka-green/80 underline-offset-4 hover:underline transition-colors',
    secondary: 'text-ka-navy hover:text-ka-navy/80 transition-colors',
    muted: 'text-muted-foreground hover:text-ka-green transition-colors',
  },
} as const;
