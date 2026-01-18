# Kaspers Advies CRM - Brand Guide & Design System

> **Version:** 1.0  
> **Last Updated:** January 2026  
> **Status:** Production-Ready

---

## Table of Contents

1. [Introduction](#introduction)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Responsive Breakpoints](#responsive-breakpoints)
6. [Components](#components)
7. [Interactive States](#interactive-states)
8. [Accessibility](#accessibility)
9. [Logo & Icons](#logo--icons)
10. [Dark Mode](#dark-mode)
11. [Layout Components](#layout-components)
12. [Guidelines (Do's & Don'ts)](#guidelines-dos--donts)
13. [Quick Reference](#quick-reference)
14. [File References](#file-references)

---

## Introduction

### Brand Overview

Kaspers Advies is a Dutch accounting and advisory firm serving ZZP'ers (freelancers) and MKB (SMEs). The design system reflects professionalism, trustworthiness, and approachability while maintaining accessibility standards.

### Design System Architecture

The system uses a **3-layer token architecture**:

1. **Primitive Tokens** - Raw color values (`--ka-green: 89 44% 49%`)
2. **Semantic Tokens** - Purpose-based tokens (`--primary: var(--ka-green)`)
3. **Component Tokens** - Component-specific tokens (`--button-primary-bg: var(--primary)`)

### Key Features

- ✅ WCAG 2.1 AA Compliant (Score: 9.2/10)
- ✅ Dark Mode Support (Automatic via semantic tokens)
- ✅ Dutch Market Optimized Breakpoints
- ✅ Neurodiverse-Optimized Channel Colors
- ✅ In-App Documentation at `/brand-guide`

---

## Color System

### Primary Brand Colors

| Color | HSL Value | Hex | Usage |
|-------|-----------|-----|-------|
| **Kaspers Green** | `hsl(89 44% 49%)` | `#7AB547` | Primary buttons, CTAs, active states, success indicators |
| **Kaspers Navy** | `hsl(213 52% 25%)` | `#1E3A5F` | Headers, navigation, body text emphasis, secondary actions |
| **Kaspers Red** | `hsl(0 85% 52%)` | `#E62A2A` | Accent color (from logo checkmark), alerts, destructive actions |

### CSS Variable Usage

```css
/* Primary colors - always use HSL format */
--ka-green: 89 44% 49%;
--ka-navy: 213 52% 25%;
--ka-red: 0 85% 52%;

/* Usage in components */
background-color: hsl(var(--ka-green));
color: hsl(var(--primary));
```

### Gray Scale

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--ka-gray-50` | `#F9FAFB` | - | Subtle backgrounds |
| `--ka-gray-100` | `#F3F4F6` | - | Card backgrounds |
| `--ka-gray-200` | `#E5E7EB` | - | Borders, dividers |
| `--ka-gray-300` | `#D1D5DB` | - | Disabled states |
| `--ka-gray-400` | `#9CA3AF` | - | Placeholder text |
| `--ka-gray-500` | `#6B7280` | - | Secondary text |
| `--ka-gray-600` | `#4B5563` | - | Body text |
| `--ka-gray-700` | `#374151` | - | Headings |
| `--ka-gray-800` | `#1F2937` | - | Primary text |
| `--ka-gray-900` | `#111827` | - | High emphasis |

### Semantic Colors

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| **Success** | Green | `#10B981` | Completed tasks, confirmations |
| **Warning** | Amber | `#F59E0B` | Deadlines approaching, cautions |
| **Error** | Red | `#EF4444` | Errors, overdue items |
| **Info** | Blue | `#3B82F6` | Information, tips |

### Alert Tokens (Feedback UI)

```css
/* Success */
--alert-success-bg: 142 76% 95%;
--alert-success-text: 142 76% 30%;
--alert-success-border: 142 76% 80%;

/* Warning */
--alert-warning-bg: 38 92% 95%;
--alert-warning-text: 38 92% 30%;
--alert-warning-border: 38 92% 75%;

/* Error */
--alert-error-bg: 0 84% 95%;
--alert-error-text: 0 84% 35%;
--alert-error-border: 0 84% 80%;

/* Info */
--alert-info-bg: 217 91% 95%;
--alert-info-text: 217 91% 35%;
--alert-info-border: 217 91% 80%;
```

### Channel Colors (Neurodiverse-Optimized)

**Design Principle:** Maximum 2 colors to reduce cognitive load.

| Channel | Color | Hex | Rationale |
|---------|-------|-----|-----------|
| **WhatsApp** | Green | `#25D366` | Universally recognized, maintains brand identity |
| **All Others** | Navy | `#1E3A5F` | Neutral, consistent, reduces visual noise |

```typescript
// src/lib/utils/channelConfig.ts
export const channelStyles = {
  whatsapp: {
    bg: 'bg-[#25D366]/10',
    text: 'text-[#25D366]',
    border: 'border-[#25D366]/30',
  },
  // All other channels use ka-navy
  email: {
    bg: 'bg-ka-navy/10',
    text: 'text-ka-navy',
    border: 'border-ka-navy/30',
  },
  // ... phone, video, sms, etc.
};
```

### Priority Colors

| Priority | Color | Class | Usage |
|----------|-------|-------|-------|
| **Urgent** | Red | `text-priority-urgent` | Immediate attention required |
| **Hoog (High)** | Orange | `text-priority-high` | Important, time-sensitive |
| **Normaal** | Blue | `text-priority-normal` | Standard priority |
| **Laag (Low)** | Gray | `text-priority-low` | Can wait, low urgency |

---

## Typography

### Font Family

**Primary Font:** Inter (Google Fonts)

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Rarely used, decorative only |
| Regular | 400 | Body text default |
| Medium | 500 | Semi-emphasis, labels |
| Semibold | 600 | Headers, buttons |
| Bold | 700 | Strong emphasis, H1 |

### Responsive Headings

```typescript
// src/lib/utils/typography.ts
export const responsiveHeading = {
  h1: "text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground",
  h2: "text-xl sm:text-2xl lg:text-3xl font-bold text-foreground",
  h3: "text-lg sm:text-xl lg:text-2xl font-semibold text-foreground",
  h4: "text-base sm:text-lg font-semibold text-foreground",
  h5: "text-sm sm:text-base font-semibold text-foreground",
};

// Usage
import { responsiveHeading, getHeading } from '@/lib/utils/typography';

<h1 className={responsiveHeading.h1}>Page Title</h1>
<h2 className={getHeading(2)}>Section Title</h2>
```

### Body Text

```typescript
export const responsiveBody = {
  large: "text-base sm:text-lg text-foreground",
  base: "text-base text-foreground",
  small: "text-sm text-muted-foreground",
  tiny: "text-xs text-muted-foreground",
};

// Usage
import { responsiveBody, getBodyText } from '@/lib/utils/typography';

<p className={responsiveBody.base}>Regular paragraph</p>
<span className={getBodyText('small')}>Helper text</span>
```

### Type Scale Reference

| Element | Mobile | Tablet (sm) | Desktop (lg) | Weight |
|---------|--------|-------------|--------------|--------|
| H1 | 24px | 30px | 36px | Bold (700) |
| H2 | 20px | 24px | 30px | Bold (700) |
| H3 | 18px | 20px | 24px | Semibold (600) |
| H4 | 16px | 18px | 18px | Semibold (600) |
| H5 | 14px | 16px | 16px | Semibold (600) |
| Body Large | 16px | 18px | 18px | Regular (400) |
| Body Base | 16px | 16px | 16px | Regular (400) |
| Body Small | 14px | 14px | 14px | Regular (400) |
| Body Tiny | 12px | 12px | 12px | Regular (400) |

---

## Spacing System

### Section Padding (Vertical)

```typescript
// src/lib/utils/spacing.ts
export const spacing = {
  section: {
    sm: "py-6 sm:py-8 lg:py-12",      // Small sections
    md: "py-8 sm:py-12 lg:py-16",     // Standard sections
    lg: "py-12 sm:py-16 lg:py-24",    // Large sections (heroes)
  },
};

// Usage
import { spacing, getSectionPadding } from '@/lib/utils/spacing';

<section className={spacing.section.md}>Content</section>
<section className={getSectionPadding('lg')}>Hero</section>
```

### Container Padding (Horizontal)

```typescript
container: {
  sm: "px-4 sm:px-6",               // Tight container
  md: "px-4 sm:px-6 lg:px-8",       // Standard container
  lg: "px-6 sm:px-8 lg:px-12",      // Wide container
},
```

### Stack Spacing (Vertical between elements)

```typescript
stack: {
  xs: "space-y-2 sm:space-y-3",
  sm: "space-y-3 sm:space-y-4",
  md: "space-y-4 sm:space-y-6 lg:space-y-8",
  lg: "space-y-6 sm:space-y-8 lg:space-y-12",
  xl: "space-y-8 sm:space-y-12 lg:space-y-16",
},
```

### Grid Gaps

```typescript
grid: {
  xs: "gap-2 sm:gap-3",
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-6 lg:gap-8",
  lg: "gap-6 sm:gap-8 lg:gap-12",
},
```

### Inline Spacing (Horizontal between elements)

```typescript
inline: {
  xs: "space-x-1 sm:space-x-2",
  sm: "space-x-2 sm:space-x-3",
  md: "space-x-3 sm:space-x-4",
  lg: "space-x-4 sm:space-x-6",
},
```

---

## Responsive Breakpoints

### Dutch Market Optimized Breakpoints

| Breakpoint | Width | Target Device |
|------------|-------|---------------|
| `xs` | 360px | Mobile small (common in NL market) |
| `sm` | 640px | Phablet / Large mobile |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / Small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large monitors |

### useBreakpoint Hook

```typescript
// src/hooks/useBreakpoint.ts
import { useBreakpoint } from '@/hooks/useBreakpoint';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useBreakpoint();
  
  if (isMobile) {
    return <MobileLayout />;
  }
  
  return <DesktopLayout />;
}
```

### Tailwind Usage

```html
<!-- Mobile-first responsive design -->
<div class="px-4 sm:px-6 lg:px-8">
  <h1 class="text-2xl sm:text-3xl lg:text-4xl">Responsive Title</h1>
</div>

<!-- Hide/show at breakpoints -->
<nav class="hidden md:flex">Desktop Nav</nav>
<nav class="flex md:hidden">Mobile Nav</nav>
```

---

## Components

### Buttons

| Variant | Class | Usage |
|---------|-------|-------|
| **Primary** | `bg-primary text-primary-foreground hover:bg-primary/90` | Main CTAs, submit actions |
| **Secondary** | `bg-secondary text-secondary-foreground hover:bg-secondary/80` | Secondary actions |
| **Ghost** | `hover:bg-accent hover:text-accent-foreground` | Tertiary actions, icons |
| **Destructive** | `bg-destructive text-destructive-foreground hover:bg-destructive/90` | Delete, cancel dangerous |
| **Outline** | `border border-input bg-background hover:bg-accent` | Alternative to ghost |
| **Link** | `text-primary underline-offset-4 hover:underline` | Inline links |

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="link">Learn more</Button>
```

### Badges

```tsx
import { StatusBadge } from '@/components/ui/badges/StatusBadge';

<StatusBadge variant="success">Completed</StatusBadge>
<StatusBadge variant="warning">Pending</StatusBadge>
<StatusBadge variant="error">Overdue</StatusBadge>
<StatusBadge variant="info">In Progress</StatusBadge>
<StatusBadge variant="neutral">Draft</StatusBadge>
<StatusBadge variant="brand">Featured</StatusBadge>

// With dot indicator
<StatusBadge variant="success" dot>Active</StatusBadge>

// With icon
<StatusBadge variant="info" icon={<Clock className="w-3 h-3" />}>
  Scheduled
</StatusBadge>
```

### Channel Badge

```tsx
import { ChannelBadge } from '@/components/ui/badges/ChannelBadge';

<ChannelBadge channel="whatsapp" />
<ChannelBadge channel="email" showLabel={false} />
<ChannelBadge channel="phone" />
```

### Deadline Badge

```tsx
import { DeadlineBadge } from '@/components/ui/badges/DeadlineBadge';

<DeadlineBadge daysLeft={-2} />  // "2d te laat" (red)
<DeadlineBadge daysLeft={0} />   // "Vandaag" (yellow)
<DeadlineBadge daysLeft={5} />   // "5d" (gray)
```

### Priority Badge

```tsx
import { PriorityBadge } from '@/components/ui/badges/PriorityBadge';

<PriorityBadge priority="Urgent" />
<PriorityBadge priority="Hoog" showIcon={false} />
<PriorityBadge priority="Normaal" size="sm" />
<PriorityBadge priority="Laag" />
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>

// Interactive card
<Card className="cursor-pointer hover:shadow-md transition-shadow">
  ...
</Card>
```

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 2px | Small elements |
| `rounded` | 4px | Default |
| `rounded-md` | 6px | Cards, inputs |
| `rounded-lg` | 8px | Large cards |
| `rounded-xl` | 12px | Modals |
| `rounded-2xl` | 16px | Feature cards |
| `rounded-full` | 9999px | Avatars, pills |

---

## Interactive States

### Button States

| State | Style | Notes |
|-------|-------|-------|
| Default | Base colors | - |
| Hover | `hover:bg-primary/90` | Slightly darker |
| Active | `active:scale-[0.98]` | Subtle press effect |
| Focus | `focus-visible:ring-2 focus-visible:ring-ring` | Visible outline |
| Disabled | `opacity-50 cursor-not-allowed` | Reduced opacity |
| Loading | Spinner + disabled state | Show loading indicator |

### Input States

| State | Style |
|-------|-------|
| Default | `border-input bg-background` |
| Focus | `ring-2 ring-ring ring-offset-2` |
| Error | `border-destructive focus:ring-destructive` |
| Success | `border-green-500 focus:ring-green-500` |
| Disabled | `opacity-50 cursor-not-allowed bg-muted` |
| Read-only | `bg-muted cursor-default` |

### Transition Timings

| Speed | Duration | Usage |
|-------|----------|-------|
| Fast | 150ms | Hovers, small UI changes |
| Normal | 300ms | Page transitions, modals |
| Slow | 500ms | Complex animations |

```css
/* CSS transitions */
transition: all 150ms ease-in-out;
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Current Score:** 9.2/10

### Color Contrast Requirements

| Text Type | Minimum Ratio | Our Implementation |
|-----------|---------------|-------------------|
| Normal text | 4.5:1 | ✅ All text passes |
| Large text (18px+) | 3:1 | ✅ Headers pass |
| UI components | 3:1 | ✅ All interactive elements pass |

**Color Contrast Check:**
- `ka-green` on white: ~3.8:1 (use for large text only)
- `ka-navy` on white: ~8:1 (safe for all text)
- `ka-green` on `ka-navy`: ~4.8:1 (passes AA)

### Focus States

```css
/* Global focus-visible system */
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: hsl(var(--background));
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Touch Targets

```css
/* Minimum touch target size: 44px x 44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile buttons */
@media (max-width: 640px) {
  button, a {
    min-height: 44px;
    padding: 12px 16px;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ARIA Labels

```tsx
// Icon-only buttons must have aria-label
<Button variant="ghost" size="icon" aria-label="Open menu">
  <Menu className="w-5 h-5" />
</Button>

// Loading states
<Button disabled aria-busy="true">
  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
  <span>Loading...</span>
</Button>

// Decorative icons
<CheckCircle className="w-4 h-4" aria-hidden="true" />
```

---

## Logo & Icons

### Logo Variants

| Variant | Usage | File |
|---------|-------|------|
| Primary | Light backgrounds | `src/assets/logo-kaspers-advies.jpg` |
| Inverted | Dark backgrounds | (create if needed) |

### Logo Sizing

| Context | Minimum Size |
|---------|-------------|
| Print | 25mm width |
| Digital | 32px height |
| Web header | 120px width |
| Favicon | 32x32px |

### Icon Library

**Primary:** Lucide React

```tsx
import { 
  Check, 
  X, 
  ChevronDown, 
  Menu, 
  Search,
  Settings,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
```

### Icon Sizes

| Context | Size | Class |
|---------|------|-------|
| Inline (with text) | 16px | `w-4 h-4` |
| Standalone | 20px | `w-5 h-5` |
| Card icons | 24px | `w-6 h-6` |
| Large/Hero | 32px | `w-8 h-8` |
| Feature icons | 48px | `w-12 h-12` |

### Icon Color

```tsx
// Inherit text color (recommended)
<Check className="w-4 h-4" />

// Specific color
<Check className="w-4 h-4 text-green-500" />

// Muted
<Settings className="w-4 h-4 text-muted-foreground" />
```

---

## Dark Mode

### Automatic via Semantic Tokens

Dark mode is handled automatically through CSS variables. No manual `dark:` prefixes needed.

```css
/* src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 89 44% 49%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 89 44% 49%;
  /* ... */
}
```

### Usage in Components

```tsx
// Always use semantic tokens - dark mode is automatic
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    Content
  </Card>
</div>

// DON'T do this:
<div className="bg-white dark:bg-gray-900">
```

### Theme Toggle

```tsx
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';

// In header/settings
<ThemeSwitcher />
```

---

## Layout Components

### ImmersivePageWrapper

Full-bleed, inbox-style layout for immersive pages.

```tsx
import { ImmersivePageWrapper } from '@/components/layout/ImmersivePageWrapper';

function InboxPage() {
  return (
    <ImmersivePageWrapper>
      <div className="flex h-full">
        <ConversationList />
        <ChatView />
      </div>
    </ImmersivePageWrapper>
  );
}
```

### StickyHeader

Persistent header with user context and actions.

```tsx
import { StickyHeader } from '@/components/layout/StickyHeader';

<StickyHeader
  title="Inbox"
  subtitle="12 ongelezen berichten"
  actions={
    <Button variant="ghost" size="icon">
      <Settings className="w-5 h-5" />
    </Button>
  }
/>
```

### SplitPanel

Multi-panel layouts (list + detail, master-detail).

```tsx
import { SplitPanel } from '@/components/layout/SplitPanel';

<SplitPanel
  left={<ItemList />}
  right={<ItemDetail />}
  leftWidth="w-1/3"
  rightWidth="w-2/3"
/>
```

---

## Guidelines (Do's & Don'ts)

### Colors

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use semantic tokens: `text-foreground`, `bg-background`, `bg-primary` | Use hardcoded colors: `text-white`, `bg-black`, `#7AB547` |
| Use brand tokens: `text-ka-navy`, `bg-ka-green/10` | Mix color systems randomly |
| Define new colors in `index.css` first | Add hex colors directly in components |

### Typography

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use `responsiveHeading.h1` etc. | Use inline font sizes |
| Follow heading hierarchy (H1 → H2 → H3) | Skip heading levels |
| Use `font-medium` for labels, `font-semibold` for headers | Use extreme weights (100, 900) |
| Use `text-muted-foreground` for helper text | Use ALL CAPS for body text |

### Spacing

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use spacing utilities: `spacing.section.md` | Use arbitrary values: `py-[47px]` |
| Be consistent within a page/section | Mix spacing scales randomly |
| Use responsive spacing: `py-6 sm:py-8 lg:py-12` | Use fixed spacing everywhere |

### Components

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use shadcn/ui components from `@/components/ui` | Create custom components from scratch |
| Use existing badge variants: `StatusBadge`, `ChannelBadge` | Create one-off badge styles |
| Extend components via CVA variants | Override with `!important` |
| Use `Button` component with variants | Create custom button styles |

### Accessibility

| ✅ DO | ❌ DON'T |
|-------|----------|
| Add `aria-label` to icon-only buttons | Rely on color alone for meaning |
| Use semantic HTML (`<nav>`, `<main>`, `<article>`) | Use `<div>` for everything |
| Ensure 44px touch targets on mobile | Make tiny click targets |
| Test with keyboard navigation | Ignore focus states |

---

## Quick Reference

| Need | Solution |
|------|----------|
| Page title | `className={responsiveHeading.h1}` |
| Section header | `className={responsiveHeading.h2}` |
| Body text | `className={responsiveBody.base}` |
| Helper text | `className={responsiveBody.small}` |
| Section spacing | `className={spacing.section.md}` |
| Container padding | `className={spacing.container.md}` |
| Card spacing | `className={spacing.stack.sm}` |
| Primary button | `<Button>Action</Button>` |
| Secondary button | `<Button variant="secondary">` |
| Success badge | `<StatusBadge variant="success">` |
| Channel indicator | `<ChannelBadge channel="whatsapp">` |
| Priority indicator | `<PriorityBadge priority="Urgent">` |
| Deadline indicator | `<DeadlineBadge daysLeft={3}>` |
| Check breakpoint | `const { isMobile } = useBreakpoint()` |

---

## File References

### Design Tokens

| File | Purpose |
|------|---------|
| `src/index.css` | Primary design tokens (colors, spacing, etc.) |
| `src/styles/tokens.css` | Additional/extended tokens |
| `tailwind.config.ts` | Tailwind configuration |

### Utility Functions

| File | Purpose |
|------|---------|
| `src/lib/utils/brandColors.ts` | Brand color utilities and pre-built classes |
| `src/lib/utils/typography.ts` | Responsive typography utilities |
| `src/lib/utils/spacing.ts` | Responsive spacing utilities |
| `src/lib/utils/channelConfig.ts` | Channel color/icon configuration |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useBreakpoint.ts` | Responsive breakpoint detection |
| `src/hooks/useTheme.ts` | Theme management |

### Layout Components

| File | Purpose |
|------|---------|
| `src/components/layout/ImmersivePageWrapper.tsx` | Full-bleed page wrapper |
| `src/components/layout/StickyHeader.tsx` | Persistent header |
| `src/components/layout/SplitPanel.tsx` | Multi-panel layouts |

### Badge Components

| File | Purpose |
|------|---------|
| `src/components/ui/badges/StatusBadge.tsx` | Status indicators |
| `src/components/ui/badges/ChannelBadge.tsx` | Channel indicators |
| `src/components/ui/badges/DeadlineBadge.tsx` | Deadline indicators |
| `src/components/ui/badges/PriorityBadge.tsx` | Priority indicators |
| `src/components/ui/badges/TypeBadge.tsx` | Type indicators |

### Documentation

| File | Purpose |
|------|---------|
| `src/pages/BrandGuidePage.tsx` | In-app brand guide |
| `docs/DESIGN_SYSTEM_COMPLIANCE_REPORT.md` | Compliance audit |
| `docs/responsive-implementation-guide.md` | Responsive patterns |

### Golden Standard Reference

For V2 page implementation, refer to:
- `src/pages/UnifiedInboxPageV2.tsx`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial brand guide documentation |

---
