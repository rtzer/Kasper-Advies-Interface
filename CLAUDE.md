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
- **Baserow Client** (`src/lib/api/baserowClient.ts`): API client for Baserow database. Routes through `/api/baserow/` proxy for security.
- **API modules** (`src/lib/api/`): Domain-specific API functions (klanten, opdrachten, taken, projects, etc.)
- **Mock data** (`src/lib/mock*.ts`): Used for development/demo purposes

### Security Architecture (API Proxies)

**IMPORTANT**: All API calls (Baserow and n8n) MUST go through server-side proxies to keep secrets secure.

#### Why Proxies?
- Secrets (tokens, passwords, webhook URLs) are NEVER exposed to the browser
- All sensitive credentials are stored as server-side environment variables (without `VITE_` prefix)
- The frontend only calls `/api/*` endpoints, which forward requests with proper authentication

#### Baserow Proxy (`/api/baserow/`)
All Baserow API calls are routed through `api/baserow/[...path].ts`:
```typescript
// Frontend calls the proxy (no secrets needed)
const response = await fetch('/api/baserow/rows/table/764/?user_field_names=true');

// The proxy adds the token server-side and forwards to Baserow
```

#### N8N Webhook Proxy (`/api/n8n/webhook`)
All n8n webhook calls MUST use the secure proxy with a `webhookType` parameter:

```typescript
// ✅ CORRECT: Use the proxy with webhookType
const response = await fetch('/api/n8n/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    webhookType: 'create-client',  // Required: identifies which webhook to call
    // ... your payload data
  }),
});

// ❌ WRONG: Never call webhooks directly from frontend
const response = await fetch('https://n8n.example.com/webhook/xxx', {
  headers: { 'Authorization': `Basic ${btoa(...)}` }  // NEVER expose credentials!
});
```

#### Available Webhook Types
| webhookType | Purpose | Server Variable |
|-------------|---------|-----------------|
| `auth` | User authentication | `N8N_AUTH_WEBHOOK_URL` |
| `create-client` | Create new client | `N8N_CREATE_CLIENT_WEBHOOK_URL` |
| `update-client` | Update existing client | `N8N_UPDATE_CLIENT_WEBHOOK_URL` |
| `client-action` | Focus/archive/delete client | `N8N_CLIENT_ACTION_WEBHOOK_URL` |
| `create-prospect` | Create new prospect | `N8N_CREATE_PROSPECT_WEBHOOK_URL` |
| `update-prospect` | Update prospect | `N8N_UPDATE_PROSPECT_WEBHOOK_URL` |
| `prospect-lost` | Mark prospect as lost | `N8N_PROSPECT_LOST_WEBHOOK_URL` |

#### Adding a New Webhook
1. Add the webhook URL to Vercel environment variables: `N8N_YOUR_NEW_WEBHOOK_URL`
2. Add the mapping in `api/n8n/webhook.ts`:
   ```typescript
   const WEBHOOK_URLS: Record<string, string | undefined> = {
     // ... existing webhooks
     'your-new-type': process.env.N8N_YOUR_NEW_WEBHOOK_URL,
   };
   ```
3. Call it from frontend:
   ```typescript
   await fetch('/api/n8n/webhook', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ webhookType: 'your-new-type', ...data }),
   });
   ```

### Environment Variables

#### Client-side (`.env` with `VITE_` prefix)
Safe to expose in browser - no secrets:
```
VITE_SESSION_DURATION_DAYS=30
VITE_BASEROW_TABLE_CUSTOMERS=764
VITE_BASEROW_TABLE_PROSPECTS=765
VITE_BASEROW_TABLE_PROJECTS=768
VITE_APP_NAME=Kaspers Advies Communication Hub
```

#### Server-side (Vercel Dashboard - NO `VITE_` prefix)
**NEVER commit these to git or expose to frontend:**
```
BASEROW_API_URL=https://baserow.example.com
BASEROW_TOKEN=<secret-token>
N8N_AUTH_USERNAME=<username>
N8N_AUTH_PASSWORD=<password>
N8N_AUTH_WEBHOOK_URL=https://n8n.example.com/webhook/...
N8N_CREATE_CLIENT_WEBHOOK_URL=...
N8N_UPDATE_CLIENT_WEBHOOK_URL=...
N8N_CLIENT_ACTION_WEBHOOK_URL=...
N8N_CREATE_PROSPECT_WEBHOOK_URL=...
N8N_UPDATE_PROSPECT_WEBHOOK_URL=...
N8N_PROSPECT_LOST_WEBHOOK_URL=...
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
