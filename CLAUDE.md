# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server (port 8080)
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Libraries**: shadcn/ui (Radix primitives) + Flowbite React
- **Styling**: Tailwind CSS with custom `ka-*` brand colors (Kaspers Advies)
- **State Management**: Zustand, TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6
- **i18n**: i18next (Dutch primary, English secondary)
- **Backend**: Baserow API (headless database)

## Architecture Overview

### Data Layer
- **Baserow Client** (`src/lib/api/baserowClient.ts`): READ-ONLY API client for Baserow database. Used only for fetching/displaying data. Environment variables `VITE_BASEROW_API_URL` and `VITE_BASEROW_TOKEN` required.
- **API modules** (`src/lib/api/`): Domain-specific API functions (klanten, opdrachten, taken, projects, etc.)
- **Mock data** (`src/lib/mock*.ts`): Used for development/demo purposes

### Data Mutations (Create/Update/Delete)
**IMPORTANT**: All create, update, and delete operations must be sent to n8n webhooks, NOT directly to Baserow.

- n8n handles all data mutations via workflow webhooks
- All webhooks use the same Basic Auth credentials (environment variables)
- The frontend sends mutation requests to n8n webhook endpoints
- n8n workflows process the request and update Baserow

Required environment variables in `.env`:
```
VITE_N8N_WEBHOOK_URL=<webhook-url>
VITE_N8N_USERNAME=<basic-auth-username>
VITE_N8N_PASSWORD=<basic-auth-password>
```

```typescript
// Example pattern for mutations
const response = await fetch(N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${N8N_USERNAME}:${N8N_PASSWORD}`)}`
  },
  body: JSON.stringify({ action: 'create', entity: 'klant', data: {...} })
});
```

### Type System
All domain types are defined in `src/types/index.ts`:
- `Klant` - Client/customer
- `Opdracht` - Assignment (child of Project, parent of Tasks)
- `Taak` - Task with workflow/approval support
- `Project` - Project container
- `Interactie` - Communication interaction
- `Conversation` / `Message` - Unified inbox messaging
- `Prospect` - Sales lead
- `InboxItem` - Unmatched incoming messages queue
- `User` - Team member with roles (Owner/Admin/Employee)

### Layout Structure
- `src/layouts/AppLayout.tsx` - Main app shell with sidebar
- `src/components/layout/AppSidebar.tsx` - Navigation sidebar
- Protected routes wrap pages with `<ProtectedRoute>` and `<AppLayout>`

### Authentication & Authorization
- `AuthContext` (`src/contexts/AuthContext.tsx`) - Auth state management
- `useAuth()` hook - Access current user and login/logout
- `useRole()` hook (`src/hooks/useRole.ts`) - Role-based permissions (isOwner, isAdmin, canAccessBSN, etc.)

### Internationalization
- Config: `src/i18n/config.ts`
- Namespaces: `common`, `navigation`, `translation`
- Locales: `src/i18n/locales/{nl,en}/`

## Import Aliases

Path alias `@/` maps to `src/`:
```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
```

## Key Conventions

- Dutch terminology used in business domain (Klant, Opdracht, Taak, etc.)
- Component files use PascalCase
- shadcn/ui components in `src/components/ui/`
- Feature components organized by domain (clients, projects, inbox, etc.)
- Use `cn()` utility for conditional Tailwind classes
