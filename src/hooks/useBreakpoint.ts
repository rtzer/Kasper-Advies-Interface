import { useState, useEffect } from 'react';

/**
 * Breakpoint types based on Tailwind config
 * Optimized for Dutch market (360px focus)
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Device categories for easier conditional rendering
 */
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

/**
 * Hook to get current breakpoint
 * Returns the active breakpoint based on window width
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 360) {
        setBreakpoint('xs');
      } else if (width < 640) {
        setBreakpoint('sm');
      } else if (width < 768) {
        setBreakpoint('md');
      } else if (width < 1024) {
        setBreakpoint('lg');
      } else if (width < 1280) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook to get device category (mobile/tablet/desktop)
 * Useful for major layout decisions
 */
export function useDeviceCategory(): DeviceCategory {
  const breakpoint = useBreakpoint();
  
  if (['xs', 'sm'].includes(breakpoint)) {
    return 'mobile';
  } else if (['md', 'lg'].includes(breakpoint)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Hook for specific device checks
 */
export function useDeviceChecks() {
  const breakpoint = useBreakpoint();
  
  return {
    isMobileSmall: breakpoint === 'xs',           // < 360px (edge case)
    isMobile: ['xs', 'sm'].includes(breakpoint),  // < 640px (primary mobile)
    isPhablet: breakpoint === 'sm',               // 360-640px
    isTabletPortrait: breakpoint === 'md',        // 768-1024px
    isTabletLandscape: breakpoint === 'lg',       // 1024-1280px
    isTablet: ['md', 'lg'].includes(breakpoint),  // 768-1280px
    isDesktop: ['xl', '2xl'].includes(breakpoint), // 1280px+
    isLargeDesktop: breakpoint === '2xl',         // 1536px+
  };
}

/**
 * Hook to get touch target size based on device
 * Mobile requires larger touch targets (min 48px)
 */
export function useTouchTargetSize(): 'default' | 'lg' {
  const { isMobile } = useDeviceChecks();
  return isMobile ? 'lg' : 'default';
}
