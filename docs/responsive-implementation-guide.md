# Responsive Implementation Guide
## Kaspers Advies CRM - Brand-First Responsive Strategy

---

## 🎯 Overview

This guide explains how to implement responsive, brand-consistent components across all breakpoints, with special focus on the Dutch market (360px devices).

---

## 📱 Breakpoint Strategy

### Tailwind Breakpoints
```typescript
'xs':  '360px'   // Extra small - Nederlandse budget phones 🇳🇱
'sm':  '640px'   // Small - Large phones, phablets
'md':  '768px'   // Medium - Tablets portrait
'lg':  '1024px'  // Large - Tablets landscape, small laptops
'xl':  '1280px'  // Extra large - Desktops
'2xl': '1536px'  // 2X large - Large desktops
```

### Device Categories
- **Mobile**: xs, sm (< 640px) - 22% NL users on 360px!
- **Tablet**: md, lg (640-1280px)
- **Desktop**: xl, 2xl (≥ 1280px)

---

## 🎨 Brand Guidelines

### Colors (ALWAYS use CSS variables!)
```tsx
// ✅ CORRECT
<Button className="bg-ka-green hover:bg-ka-green/90">

// ❌ WRONG
<Button className="bg-green-500 hover:bg-green-600">
```

### Primary Colors
- `ka-green` - #7AB547 - Primary buttons, CTAs, active states
- `ka-navy` - #1E3A5F - Headers, navigation
- `ka-red` - #E62A2A - Accent, important CTAs

### Typography
- Font: Inter (Google Fonts) - weights: 300, 400, 500, 600, 700
- Mobile: Minimum 16px (prevents iOS zoom!)
- Desktop: Can be larger for better readability

---

## 🛠️ Utilities

### 1. Typography Utilities
```tsx
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';

// Headings - automatically responsive
<h1 className={responsiveHeading.h1}>Page Title</h1>
// Output: text-2xl sm:text-3xl lg:text-4xl font-bold text-ka-navy

<h2 className={responsiveHeading.h2}>Section Title</h2>
<h3 className={responsiveHeading.h3}>Subsection</h3>

// Body text
<p className={responsiveBody.large}>Important text</p>
<p className={responsiveBody.base}>Standard text</p>
<p className={responsiveBody.small}>Helper text</p>
```

### 2. Spacing Utilities
```tsx
import { spacing } from '@/lib/utils/spacing';

// Section padding
<section className={spacing.section.md}>
  // Output: py-8 sm:py-12 lg:py-16
</section>

// Container padding
<div className={spacing.container.md}>
  // Output: px-4 sm:px-6 lg:px-8
</div>

// Vertical stacks
<div className={spacing.stack.md}>
  // Output: space-y-4 sm:space-y-6 lg:space-y-8
</div>

// Grid gaps
<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.grid.md}`}>
  // Output: gap-4 sm:gap-6 lg:gap-8
</div>
```

### 3. Breakpoint Hooks
```tsx
import { useBreakpoint, useDeviceCategory, useDeviceChecks, useTouchTargetSize } from '@/hooks/useBreakpoint';

// Get current breakpoint
const breakpoint = useBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Get device category
const deviceCategory = useDeviceCategory(); // 'mobile' | 'tablet' | 'desktop'

// Device checks
const { isMobile, isTablet, isDesktop, isMobileSmall } = useDeviceChecks();

// Touch target size (lg on mobile, default on desktop)
const touchSize = useTouchTargetSize();
<Button size={touchSize}>Click me</Button>
```

### 4. Brand Color Utilities
```tsx
import { brandColors, brandClasses } from '@/lib/utils/brandColors';

// Pre-built button classes
<Button className={brandClasses.button.primary}>Primary Action</Button>
<Button className={brandClasses.button.accent}>Important CTA</Button>

// Pre-built card classes
<Card className={brandClasses.card.hover}>Hover effect</Card>
<Card className={brandClasses.card.interactive}>Clickable card</Card>

// Badge classes
<Badge className={brandClasses.badge.success}>Success</Badge>
<Badge className={brandClasses.badge.primary}>Active</Badge>
```

---

## 📋 Implementation Checklist

### For Every Component/Page:

#### 1. Mobile-First Layout
```tsx
✅ Single column on mobile (<640px)
✅ 2-3 columns on tablet (640-1024px)
✅ 3-4 columns on desktop (≥1024px)

// Example:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
```

#### 2. Brand Colors
```tsx
✅ Use CSS variables (ka-green, ka-navy, ka-red)
✅ Use brandClasses for common patterns
❌ NO hardcoded colors (bg-green-500, etc)
```

#### 3. Typography
```tsx
✅ Use responsiveHeading utilities
✅ Mobile ≥ 16px (prevent zoom)
✅ Proper hierarchy (H1 > H2 > H3)
```

#### 4. Touch Targets (Mobile!)
```tsx
✅ Buttons ≥ 48x48px on mobile
✅ Use Button size="lg" or size="xl" for mobile
✅ Icon buttons: size="icon" (44x44px minimum)

// Example:
const touchSize = useTouchTargetSize();
<Button size={touchSize}>Action</Button>
```

#### 5. Spacing
```tsx
✅ Use spacing utilities (consistent!)
✅ Tighter spacing on mobile
✅ More generous on desktop
```

#### 6. Navigation
```tsx
✅ Bottom nav on mobile (<768px)
✅ Sidebar on tablet/desktop
✅ Hamburger menu option
```

---

## 🎨 Component Patterns

### Responsive Card
```tsx
import { brandClasses } from '@/lib/utils/brandColors';
import { spacing } from '@/lib/utils/spacing';

<Card className={`${brandClasses.card.hover} ${spacing.container.sm}`}>
  <CardHeader>
    <CardTitle className={responsiveHeading.h3}>Title</CardTitle>
  </CardHeader>
  <CardContent className={spacing.stack.md}>
    <p className={responsiveBody.base}>Content</p>
  </CardContent>
</Card>
```

### Responsive Grid
```tsx
<div className={`
  grid 
  grid-cols-1      // Mobile: 1 column
  sm:grid-cols-2   // Small: 2 columns
  lg:grid-cols-3   // Desktop: 3 columns
  ${spacing.grid.md}
`}>
  {items.map(item => <GridItem key={item.id} />)}
</div>
```

### Responsive Button Group
```tsx
import { useTouchTargetSize } from '@/hooks/useBreakpoint';
import { brandClasses } from '@/lib/utils/brandColors';

const touchSize = useTouchTargetSize();

<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <Button 
    size={touchSize} 
    className={brandClasses.button.brand}
  >
    Primary Action
  </Button>
  <Button 
    size={touchSize} 
    variant="outline"
  >
    Secondary
  </Button>
</div>
```

### Responsive Modal/Sheet
```tsx
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const isMobile = useIsMobile();

{isMobile ? (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetContent side="bottom">
      {/* Content */}
    </SheetContent>
  </Sheet>
) : (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      {/* Content */}
    </DialogContent>
  </Dialog>
)}
```

---

## 🚫 Common Mistakes

### ❌ DON'T
```tsx
// Hardcoded colors
<Button className="bg-green-500">

// Fixed sizes (not responsive)
<h1 className="text-4xl">

// Small touch targets on mobile
<Button size="sm">

// Direct color values
style={{ backgroundColor: '#7AB547' }}

// Sequential breakpoints (mobile-last)
<div className="grid-cols-3 sm:grid-cols-1">
```

### ✅ DO
```tsx
// Use brand colors
<Button className="bg-ka-green hover:bg-ka-green/90">

// Responsive typography
<h1 className={responsiveHeading.h1}>

// Mobile-optimized touch targets
const touchSize = useTouchTargetSize();
<Button size={touchSize}>

// CSS variables
className="bg-ka-green"

// Mobile-first approach
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

---

## 📊 Testing Checklist

### Per Component/Page:
- [ ] Test on 360px (Chrome DevTools)
- [ ] Test on 768px (iPad)
- [ ] Test on 1280px (Desktop)
- [ ] Brand colors correct? (color picker)
- [ ] Touch targets ≥ 48px? (measure in DevTools)
- [ ] Font size ≥ 16px on mobile?
- [ ] Spacing consistent?
- [ ] Dark mode works?

---

## 🎯 Quick Reference

### Common Responsive Patterns
```tsx
// Container
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

// Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

// Stack
<div className="flex flex-col space-y-4 sm:space-y-6">

// Inline (horizontal)
<div className="flex flex-wrap gap-2 sm:gap-3">

// Hide on mobile
<div className="hidden sm:block">

// Show only on mobile
<div className="block sm:hidden">

// Responsive text
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
```

---

## 📞 Questions?

Contact the development team or refer to:
- Brand Guide: `/brand-guide`
- Extended Brand Guide: `/brand-guide-extended`
- This document: `docs/responsive-implementation-guide.md`
