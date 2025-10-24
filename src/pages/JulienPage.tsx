import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Database, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Users,
  Building2,
  Heart,
  CreditCard,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BaserowTask {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  table: string;
  fields: BaserowField[];
  testPage?: string;
  notes?: string;
}

interface BaserowField {
  name: string;
  type: string;
  config?: string;
  required: boolean;
  example?: string;
}

const baserowTasks: BaserowTask[] = [
  {
    id: 'task-1',
    title: 'Gerelateerde klanten linken',
    description: 'Enable multiple client relationships per client',
    priority: 'critical',
    table: 'Klanten',
    fields: [
      {
        name: 'gerelateerde_klanten',
        type: 'Link to Klanten table (allow multiple)',
        required: true,
        example: 'Hans Mulder (particulier) → links to → Installatiebedrijf Mulder BV'
      },
      {
        name: 'relatie_type',
        type: 'Single select',
        config: 'Options: "Eigenaar van", "Vennoot", "Partner van", "Eigendom van", "Gelieerd aan"',
        required: false,
        example: '"Eigenaar van"'
      }
    ],
    testPage: '/clients/1',
    notes: 'CSV field "Gerelateerde klanten" is text - needs manual linking during import. Convert company names to actual record links.'
  },
  {
    id: 'task-2',
    title: 'Partner relaties (gezamenlijk)',
    description: 'Link partners for joint tax returns',
    priority: 'high',
    table: 'Klanten',
    fields: [
      {
        name: 'partner',
        type: 'Link to Klanten table (single)',
        required: false,
        example: 'Peter Bakker → partner: Maria Bakker-Smit'
      },
      {
        name: 'is_gezamenlijk',
        type: 'Checkbox',
        required: false,
        example: 'TRUE for couples filing jointly'
      }
    ],
    testPage: '/clients/5',
    notes: 'Only relevant for "Particulier" type clients. Both partners should link to each other.'
  },
  {
    id: 'task-3',
    title: 'Externe accountant velden',
    description: 'Track external accountants for BV clients',
    priority: 'high',
    table: 'Klanten',
    fields: [
      {
        name: 'externe_accountant',
        type: 'Text',
        required: false,
        example: 'Petra de Vries RA'
      },
      {
        name: 'accountant_email',
        type: 'Email',
        required: false,
        example: 'p.devries@bakkeraccount.nl'
      },
      {
        name: 'accountant_telefoonnummer',
        type: 'Phone',
        required: false,
        example: '+31-50-1234567'
      },
      {
        name: 'accountant_kantoor',
        type: 'Text',
        required: false,
        example: 'Bakker Accountants & Adviseurs'
      },
      {
        name: 'samenwerking_sinds',
        type: 'Date',
        required: false,
        example: '2021-03-15'
      }
    ],
    testPage: '/clients/2',
    notes: 'Only shown for MKB clients. Harm-Jan works with different accountants per client.'
  },
  {
    id: 'task-4',
    title: 'Bankgegevens & betalingstermijn',
    description: 'Add financial details for invoicing',
    priority: 'medium',
    table: 'Klanten',
    fields: [
      {
        name: 'iban',
        type: 'Text',
        required: false,
        example: 'NL91 ABNA 0417 1643 00'
      },
      {
        name: 'bic',
        type: 'Text',
        required: false,
        example: 'ABNANL2A'
      },
      {
        name: 'bank_naam',
        type: 'Text',
        required: false,
        example: 'Rabobank'
      },
      {
        name: 'betalingstermijn',
        type: 'Number',
        config: 'Default value: 30',
        required: false,
        example: '30 (days)'
      }
    ],
    testPage: '/clients/2',
    notes: 'IBAN will be masked in UI for security (NL91 ABNA **** **43 00). BSN is already in CSV.'
  },
  {
    id: 'task-5',
    title: 'Factuuradres velden',
    description: 'Separate invoice address if different from main address',
    priority: 'medium',
    table: 'Klanten',
    fields: [
      {
        name: 'factuur_adres',
        type: 'Text',
        required: false
      },
      {
        name: 'factuur_postcode',
        type: 'Text',
        required: false
      },
      {
        name: 'factuur_plaats',
        type: 'Text',
        required: false
      },
      {
        name: 'factuur_land',
        type: 'Text',
        config: 'Default value: "Nederland"',
        required: false
      }
    ],
    testPage: '/clients/1',
    notes: 'Only shown in UI when invoice address differs from main address. Useful for companies with separate billing departments.'
  },
  {
    id: 'task-6',
    title: 'Contactpersonen: "Is ook klant" link',
    description: 'Link contact persons who are also clients',
    priority: 'medium',
    table: 'ContactPersonen',
    fields: [
      {
        name: 'is_ook_klant',
        type: 'Link to Klanten table (single)',
        required: false,
        example: 'Hans Mulder (contact) → links to → Hans Mulder (particulier) as client'
      }
    ],
    testPage: '/clients/2',
    notes: 'CSV field "Is ook klant" is text - needs manual linking. Example: Hans Mulder is contact for BV AND private client.'
  },
  {
    id: 'task-7',
    title: 'Opdrachten: Goedkeurder velden',
    description: 'Track who needs to approve assignments (usually Harm-Jan)',
    priority: 'critical',
    table: 'Opdrachten',
    fields: [
      {
        name: 'goedkeurder',
        type: 'Text',
        required: false,
        example: 'Harm-Jan Kaspers'
      },
      {
        name: 'goedgekeurd_door',
        type: 'Text',
        required: false,
        example: 'Harm-Jan Kaspers'
      },
      {
        name: 'goedgekeurd_op',
        type: 'Date',
        required: false,
        example: '2025-04-28T10:00:00Z'
      }
    ],
    testPage: '/assignments',
    notes: 'Critical for workflow! Opdracht status "Gereed voor controle" means waiting for approval. Usually Harm-Jan signs off before reports go out.'
  },
  {
    id: 'task-8',
    title: 'Taken: Goedkeuringsworkflow',
    description: 'Full task lifecycle with approval process',
    priority: 'critical',
    table: 'Taken',
    fields: [
      {
        name: 'needs_approval',
        type: 'Checkbox',
        required: true,
        example: 'TRUE for tasks that need sign-off'
      },
      {
        name: 'approval_status',
        type: 'Single select',
        config: 'Options: "pending", "approved", "rejected"',
        required: false,
        example: '"pending"'
      },
      {
        name: 'started_by',
        type: 'Text',
        required: false,
        example: 'Jan Jansen'
      },
      {
        name: 'approved_by',
        type: 'Text',
        required: false,
        example: 'Harm-Jan Kaspers'
      },
      {
        name: 'approved_at',
        type: 'Date',
        required: false
      },
      {
        name: 'submitted_for_approval_at',
        type: 'Date',
        required: false
      },
      {
        name: 'approval_notes',
        type: 'Long text',
        required: false,
        example: 'Feedback bij afkeuring'
      }
    ],
    testPage: '/tasks',
    notes: 'CRITICAL WORKFLOW: Task lifecycle: Created → Assigned → In uitvoering → Gereed voor controle (submitted) → Approved → Afgerond. Harm-Jan must approve tasks before reports can be sent.'
  },
  {
    id: 'task-9',
    title: 'Contact Moment Tracking System',
    description: 'Track all client interactions with channel-specific IDs and multi-project linking',
    priority: 'critical',
    table: 'Interacties + Interactie_Koppelingen',
    fields: [
      {
        name: '📊 TABLE 1: Interacties',
        type: '---',
        required: false,
        example: 'Main interactions table'
      },
      {
        name: 'id',
        type: 'Auto-number with prefix',
        config: 'Prefix: "INT-", Format: INT-2024-001',
        required: true,
        example: 'INT-2024-001'
      },
      {
        name: 'klant_id',
        type: 'Link to Klanten table',
        required: true,
        example: 'Link to Hans Mulder'
      },
      {
        name: 'datum',
        type: 'DateTime',
        required: true,
        example: '2024-03-15T10:30:00'
      },
      {
        name: 'type',
        type: 'Single select',
        config: 'Options: "email", "whatsapp", "telefoongesprek", "videogesprek", "sms", "brief"',
        required: true,
        example: '"telefoongesprek"'
      },
      {
        name: 'onderwerp',
        type: 'Text',
        required: true,
        example: 'Meerdere fiscale vragen'
      },
      {
        name: 'samenvatting',
        type: 'Long Text',
        required: false,
        example: 'Hans belde met vragen over zijn privé IB, Maria\'s aangifte en BTW voor de slagerij'
      },
      {
        name: 'richting',
        type: 'Single select',
        config: 'Options: "Inkomend", "Uitgaand"',
        required: true,
        example: '"Inkomend"'
      },
      {
        name: 'behandeld_door',
        type: 'Text',
        required: false,
        example: 'Harm-Jan Kaspers'
      },
      {
        name: '--- EMAIL FIELDS ---',
        type: '---',
        required: false,
        example: 'For Outlook integration (future)'
      },
      {
        name: 'thread_id',
        type: 'Text',
        required: false,
        example: 'THREAD-1234567890abcdef'
      },
      {
        name: 'message_id',
        type: 'Text',
        required: false,
        example: 'MSG-abc123def456'
      },
      {
        name: '--- WHATSAPP FIELDS ---',
        type: '---',
        required: false,
        example: 'For WhatsApp Business API'
      },
      {
        name: 'whatsapp_phone_id',
        type: 'Phone',
        required: false,
        example: '+31612345678'
      },
      {
        name: 'whatsapp_message_id',
        type: 'Text',
        required: false,
        example: 'wamid.HBgNMzE2MTIzNDU2Nzg...'
      },
      {
        name: '--- PHONE/VIDEO FIELDS ---',
        type: '---',
        required: false,
        example: 'For Voys VoIP integration'
      },
      {
        name: 'call_id',
        type: 'Text',
        required: false,
        example: 'CALL-20240315-103045'
      },
      {
        name: 'call_duration',
        type: 'Number',
        config: 'Duration in minutes',
        required: false,
        example: '25'
      },
      {
        name: '📊 TABLE 2: Interactie_Koppelingen',
        type: '---',
        required: false,
        example: 'Links interactions to projects/assignments/tasks'
      },
      {
        name: 'id',
        type: 'Auto-number',
        required: true,
        example: '1, 2, 3...'
      },
      {
        name: 'interactie_id',
        type: 'Link to Interacties table',
        required: true,
        example: 'Link to INT-2024-001'
      },
      {
        name: 'project_id',
        type: 'Link to Projecten table',
        required: false,
        example: 'Link to PROJ-HM-IB24'
      },
      {
        name: 'opdracht_id',
        type: 'Link to Opdrachten table',
        required: false,
        example: 'Link to OPD-SLAGERIJ-BTW-Q1'
      },
      {
        name: 'taak_ids',
        type: 'Link to Taken table (multiple)',
        required: false,
        example: 'Link to TAAK-BALANS-2024'
      },
      {
        name: 'onderwerp',
        type: 'Text',
        required: true,
        example: 'BTW aangifte Q1 slagerij'
      },
      {
        name: 'notities',
        type: 'Long Text',
        required: false,
        example: 'Vraag over aftrek BTW op nieuwe koelinstallatie'
      }
    ],
    testPage: '/clients/1',
    notes: `🔴 CRITICAL SYSTEM FOR THREAD CONTINUITY & MULTI-PROJECT TRACKING

WHY THIS STRUCTURE?
- Email: Gmail/Outlook thread_id preserves conversation continuity (future integration)
- WhatsApp: WhatsApp Business API provides phone_id + message_id for tracking
- Phone/Video: Voys VoIP system generates unique call_ids via n8n integration
- Multi-linking: One conversation can cover multiple projects (e.g., Hans talks about private tax, partner's tax, AND business BTW in one call)

INTEGRATION ROADMAP:
1. ✅ WhatsApp Business API - ACTIVE (provides message_id per message)
2. 🔄 Voys VoIP + n8n - ACTIVE (call_id generation via n8n automation)
3. ⏳ Outlook API - FUTURE (thread_id + message_id for email tracking)

TWO TABLE APPROACH:
Table 1 (Interacties) = The conversation itself with channel metadata
Table 2 (Interactie_Koppelingen) = What was discussed in that conversation (1 conversation → multiple topics)

EXAMPLE USE CASE:
Hans Mulder calls (1 interaction = INT-2024-001, call_id = CALL-20240315-103045)
→ Koppeling 1: His private income tax (project: PROJ-HM-IB24)
→ Koppeling 2: Partner Maria's income tax (project: PROJ-MARIA-IB24)  
→ Koppeling 3: Business BTW Q1 (opdracht: OPD-SLAGERIJ-BTW-Q1)

All 3 topics in ONE phone call, properly tracked across 3 different projects.

n8n INTEGRATION NOTES:
- Voys VoIP webhook can trigger n8n workflow
- n8n can auto-create Interactie record with call_id
- n8n has good Baserow integration for automated record creation
- See Voys documentation for webhook setup: https://www.voys.nl/webservice/

WHATSAPP BUSINESS API:
- Each message has unique wamid (WhatsApp Message ID)
- Thread tracking via phone number + conversation_id
- Can be integrated via n8n WhatsApp Business node
- See: https://developers.facebook.com/docs/whatsapp/cloud-api`
  },
  {
    id: 'task-10',
    title: '🔴 CRITICAL: Project → Opdracht → Taak Hierarchy',
    description: 'Implement 3-level hierarchy: Klant → Project → Opdracht → Taak',
    priority: 'critical',
    table: 'Projecten + Opdrachten + Taken',
    fields: [
      {
        name: '📊 NEW TABLE: Projecten',
        type: '---',
        required: false,
        example: 'High-level container for multiple Opdrachten'
      },
      {
        name: 'project_nummer',
        type: 'Auto-number with prefix',
        config: 'Prefix: "PROJ-", Format: PROJ-2024-001',
        required: true,
        example: 'PROJ-2024-001'
      },
      {
        name: 'name',
        type: 'Text',
        required: true,
        example: 'Fiscale begeleiding Hans Mulder 2024'
      },
      {
        name: 'client_id',
        type: 'Link to Klanten table',
        required: true,
        example: 'Link to Hans Mulder'
      },
      {
        name: 'category',
        type: 'Single select',
        config: 'Options: "Fiscale begeleiding", "Groeibegeleiding", "BTW Bulk", "Jaarrekening", "Hypotheek", "Advies", "Other"',
        required: true,
        example: '"Fiscale begeleiding"'
      },
      {
        name: 'status',
        type: 'Single select',
        config: 'Options: "niet-gestart", "in-uitvoering", "wacht-op-klant", "geblokkeerd", "afgerond"',
        required: true,
        example: '"in-uitvoering"'
      },
      {
        name: 'start_date',
        type: 'Date',
        required: true,
        example: '2024-01-01'
      },
      {
        name: 'deadline',
        type: 'Date',
        required: true,
        example: '2024-12-31'
      },
      {
        name: 'assigned_to',
        type: 'Text',
        required: true,
        example: 'Harm-Jan Kaspers'
      },
      {
        name: 'beschrijving',
        type: 'Long Text',
        required: false,
        example: 'Volledige fiscale begeleiding inclusief IB, BTW en groeibegeleiding'
      },
      {
        name: '📊 UPDATED TABLE: Opdrachten',
        type: '---',
        required: false,
        example: 'Add link to parent Project'
      },
      {
        name: 'project_id',
        type: 'Link to Projecten table',
        required: false,
        example: 'Link to PROJ-2024-001'
      },
      {
        name: 'project_naam',
        type: 'Lookup from Projecten',
        config: 'Lookup field from project_id → name',
        required: false,
        example: 'Fiscale begeleiding Hans Mulder 2024'
      },
      {
        name: '📊 NO CHANGES: Taken',
        type: '---',
        required: false,
        example: 'Taken table already links to Opdrachten via gerelateerde_opdracht_id'
      }
    ],
    testPage: '/projects',
    notes: `🔴 CRITICAL HIERARCHY CHANGE

STRUCTURE:
Klant (Hans Mulder)
  └─ Project (Fiscale begeleiding 2024)
       ├─ Opdracht 1: IB 2024
       │    ├─ Taak: Gegevens verzamelen
       │    └─ Taak: Balans opstellen
       └─ Opdracht 2: BTW Q1
            └─ Taak: BTW aangifte indienen

WHY THIS STRUCTURE?
- Project = long-term container (e.g., "Fiscale begeleiding 2024")
- Opdracht = specific deliverable (e.g., "IB 2024", "BTW Q1")
- Taak = concrete action by team member

BASEROW IMPLEMENTATION:
1. Create NEW table "Projecten" with fields above
2. Add "project_id" link field to EXISTING "Opdrachten" table
3. Link from Opdrachten → Projecten (many-to-one)
4. Taken already link to Opdrachten (no changes needed)

EXAMPLE DATA:
Project: "Fiscale begeleiding Hans Mulder 2024" (PROJ-2024-001)
  ├─ Opdracht: "IB-aangifte 2024" (OPD-2024-001) → project_id = PROJ-2024-001
  └─ Opdracht: "Groeibegeleiding Q2-Q4" (OPD-2024-002) → project_id = PROJ-2024-001

NAVIGATION IN LOVABLE:
- /projects → All projects
- /projects/:id → Project detail (shows all linked Opdrachten)
- /opdrachten → All opdrachten (can filter by project)
- /opdrachten/:id → Opdracht detail (shows parent project + all tasks)

MIGRATION STRATEGY:
1. Create Projecten table first
2. For each existing Opdracht, decide if it needs a parent Project
3. Some Opdrachten can exist WITHOUT project (standalone)
4. project_id is OPTIONAL - backward compatible`
  }
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Badge className="bg-red-500 text-white">🔴 Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-500 text-white">🟡 High</Badge>;
    case 'medium':
      return <Badge className="bg-blue-500 text-white">🔵 Medium</Badge>;
    default:
      return <Badge variant="outline">Low</Badge>;
  }
};

const getIcon = (table: string) => {
  switch (table) {
    case 'Klanten':
      return <Users className="w-5 h-5" />;
    case 'ContactPersonen':
      return <Building2 className="w-5 h-5" />;
    case 'Opdrachten':
      return <FileText className="w-5 h-5" />;
    case 'Taken':
      return <CheckCircle2 className="w-5 h-5" />;
    default:
      return <Database className="w-5 h-5" />;
  }
};

export default function JulienPage() {
  const criticalTasks = baserowTasks.filter(t => t.priority === 'critical');
  const highTasks = baserowTasks.filter(t => t.priority === 'high');
  const mediumTasks = baserowTasks.filter(t => t.priority === 'medium');

  return (
    <div className="min-h-screen bg-ka-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-ka-navy to-ka-blue p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <Database className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Baserow Configuration Guide
              </h1>
              <p className="text-white/80 mt-2">
                Configuration tasks for Julien - Kaspers Advies CRM Implementation
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <div className="text-white/60 text-sm mb-1">Critical Tasks</div>
                <div className="text-3xl font-bold text-white">{criticalTasks.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <div className="text-white/60 text-sm mb-1">High Priority</div>
                <div className="text-3xl font-bold text-white">{highTasks.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="pt-6">
                <div className="text-white/60 text-sm mb-1">Total Tasks</div>
                <div className="text-3xl font-bold text-white">{baserowTasks.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-100 font-semibold">
            Important Notes for Implementation
          </AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-200 space-y-2">
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>CSV Import:</strong> Many text fields need to be converted to actual links (e.g., "Installatiebedrijf Mulder BV" → link to record)</li>
              <li><strong>Security:</strong> BSN and IBAN fields contain sensitive data - ensure proper access restrictions</li>
              <li><strong>Workflow:</strong> The approval process is critical - tasks must go through: Created → Assigned → In uitvoering → Gereed voor controle → Approved → Afgerond</li>
              <li><strong>Testing:</strong> Each task has a test page link - check the UI after configuration to verify data shows correctly</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Tasks by Priority */}
        {[
          { priority: 'critical', tasks: criticalTasks, title: '🔴 Critical Tasks', description: 'Must be completed for MVP' },
          { priority: 'high', tasks: highTasks, title: '🟡 High Priority Tasks', description: 'Needed for full functionality' },
          { priority: 'medium', tasks: mediumTasks, title: '🔵 Medium Priority Tasks', description: 'Can be added later if needed' }
        ].map(({ priority, tasks, title, description }) => (
          <div key={priority}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-ka-navy dark:text-white">{title}</h2>
              <p className="text-ka-gray-600 dark:text-gray-400">{description}</p>
            </div>

            <div className="space-y-6">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-ka-navy/10 dark:bg-ka-green/10 flex items-center justify-center">
                          {getIcon(task.table)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{task.title}</CardTitle>
                          <CardDescription className="mt-1">{task.description}</CardDescription>
                        </div>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>Table: {task.table}</span>
                      </Badge>
                      {task.testPage && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3" />
                          <Link to={task.testPage} className="hover:underline">
                            Test: {task.testPage}
                          </Link>
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Fields Table */}
                    <div>
                      <h4 className="font-semibold text-ka-navy dark:text-white mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Fields to Configure
                      </h4>
                      <div className="space-y-3">
                        {task.fields.map((field, idx) => (
                          <Card key={idx} className="bg-ka-gray-50 dark:bg-gray-800">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
                                    {field.name}
                                  </code>
                                  {field.required && (
                                    <Badge variant="destructive" className="text-xs">Required</Badge>
                                  )}
                                </div>
                                <Badge variant="secondary" className="text-xs">{field.type}</Badge>
                              </div>
                              
                              {field.config && (
                                <div className="text-sm text-orange-600 dark:text-orange-400 mb-2">
                                  ⚙️ Config: {field.config}
                                </div>
                              )}
                              
                              {field.example && (
                                <div className="text-sm text-ka-gray-600 dark:text-gray-400">
                                  Example: <span className="italic">{field.example}</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Implementation Notes */}
                    {task.notes && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Implementation Notes</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">
                          {task.notes}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Test Button */}
                    {task.testPage && (
                      <div className="flex justify-end">
                        <Button asChild>
                          <Link to={task.testPage}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Test in Lovable
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <Card className="bg-ka-green text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">Ready to implement?</h3>
                <p className="text-white/80 mt-1">
                  Complete these tasks in order of priority. Test each change using the provided test pages in Lovable.
                  Contact the development team if you have questions about any configuration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
