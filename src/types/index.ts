// ============================================
// CONVERSATION (Main entity for Communication Hub)
// ============================================
export interface Conversation {
  id: string;
  conversation_nummer: string;           // "CONV-2024-0001"
  
  // Status
  status: 'open' | 'pending' | 'resolved' | 'archived';
  
  // Client relationship
  klant_id: string;
  klant_naam: string;                    // Denormalized
  contactpersoon_id?: string;
  
  // Channel info
  primary_channel: Channel;
  all_channels: Channel[];
  
  // Content
  onderwerp: string;
  tags: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_message_at: string;
  closed_at?: string;
  
  // Assignment
  toegewezen_aan: string;
  team_members: string[];
  
  // Flags
  opvolging_nodig: boolean;
  opvolging_datum?: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  is_unread: boolean;
  
  // Stats
  message_count: number;
  response_time_avg?: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
}

// ============================================
// MESSAGE (Individual message in conversation)
// ============================================
export interface Message {
  id: string;
  conversation_id: string;
  
  // Content
  content: string;
  content_html?: string;
  
  // Metadata
  timestamp: string;
  channel: Channel;
  direction: 'inbound' | 'outbound';
  
  // Participants
  from: MessageParticipant;
  to: MessageParticipant;
  
  // Channel-specific
  channel_metadata: ChannelMetadata;
  
  // Threading
  thread_id?: string;
  reply_to_message_id?: string;
  is_thread_start: boolean;
  
  // Status
  delivery_status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  read_at?: string;
  read_by?: string[];
  
  // Attachments
  attachments: Attachment[];
  
  // AI/Analysis
  sentiment?: 'positive' | 'neutral' | 'negative';
  contains_question: boolean;
  action_required: boolean;
  
  // Internal
  internal_note?: string;
  marked_important: boolean;
}

export interface MessageParticipant {
  id: string;
  naam: string;
  type: 'client' | 'contact_person' | 'team_member';
  channel_identifier?: string;
}

// ============================================
// INTERACTIE (Original Baserow structure)
// ============================================
export interface Interactie {
  // Identificatie
  id: string;
  interaction_nummer: string;
  
  // Tijdstip
  datum: string;                         // "2024-10-23"
  tijd: string;                          // "14:32"
  created_at: string;
  updated_at: string;
  
  // Klant relatie
  klant_id: string;
  klant_naam: string;
  klant_nummer?: string;                 // For display: "K-2021-045"
  gerelateerde_klanten?: string;         // Comma-separated klant namen
  contactpersoon_id?: string;
  contactpersoon?: string;               // Naam als text voor display
  
  // Medewerker
  medewerker: string;                    // "Harm-Jan Kaspers" | "Jan Jansen" | "Linda Prins"
  
  // Kanaal & Type
  kanaal: Channel;
  type: 'Inbound' | 'Outbound';
  duur?: number;                         // Duration in minutes (phone/video)
  
  // Kanaal-specifieke metadata (NIEUW)
  kanaal_metadata?: {
    // Email
    thread_id?: string;                  // Gmail/Outlook thread ID
    message_id?: string;                 // Specifieke message ID
    
    // WhatsApp
    whatsapp_phone_id?: string;          // Telefoonnummer
    whatsapp_message_id?: string;        // WhatsApp Message ID (wamid.xxx)
    
    // Telefoon/Video
    call_id?: string;                    // Unieke call ID (bijv. van Voys)
    call_duration?: number;              // Duur in minuten (alternatief voor duur veld)
    
    // Algemeen
    external_id?: string;                // Voor andere systemen
  };
  
  // Meerdere projecten/taken koppeling (NIEUW)
  gekoppelde_items?: Array<{
    project_id?: string;                 // Project waar het over gaat
    opdracht_id?: string;                // Opdracht waar het over gaat
    taak_ids?: string[];                 // Specifieke taken
    onderwerp: string;                   // Wat werd besproken
    notities?: string;                   // Specifieke notities voor dit onderwerp
  }>;
  
  // Content
  onderwerp: string;
  samenvatting: string;                  // Long text
  
  // Opdracht link (legacy - gebruik gekoppelde_items voor nieuwe data)
  opdracht_id?: string;
  opdracht_naam?: string;
  opdracht?: string;                     // Alias for opdracht_naam (CSV compatibility)
  
  // Status & Opvolging
  status: 'Nieuw' | 'In behandeling' | 'Afgerond';
  opvolging_nodig: boolean;
  opvolging_datum?: string;
  priority: 'Urgent' | 'Hoog' | 'Normaal' | 'Laag';  // Required now
  
  // Categorisatie
  tags: string[];
  sentiment: 'Positief' | 'Neutraal' | 'Negatief';
  
  // Bestanden
  externe_bestanden_id?: string;
  attachments?: Attachment[];
  
  // Read status
  is_read: boolean;
  read_by: string[];
  
  // Thread info (legacy - gebruik kanaal_metadata.thread_id)
  thread_id?: string;
  reply_to_id?: string;
  
  // Linked to inbox conversation (NEW)
  conversatie_id?: string;
}

// ============================================
// KLANT (Client)
// ============================================
export interface Klant {
  // Identificatie
  id: string;
  klant_nummer: string;                  // "KL-2024-0001"
  naam: string;
  
  // Type classificatie
  type_klant: 'Particulier' | 'MKB' | 'ZZP';
  klant_type_details: string;
  
  // Contactgegevens
  email: string;
  telefoonnummer: string;
  mobiel?: string;
  linkedin_url?: string;
  website?: string;
  
  // Adresgegevens (primair)
  adres: string;
  postcode: string;
  plaats: string;
  land: string;                          // Default: "Nederland"
  branche?: string;                      // Bedrijfstak/sector
  
  // Alternatief postadres (voor facturen)
  factuur_adres?: string;
  factuur_postcode?: string;
  factuur_plaats?: string;
  factuur_land?: string;
  
  // Persoonlijke gegevens
  geboortedatum?: string;                // "1985-03-15"
  bsn?: string;                          // Burger Service Nummer (gevoelig!)
  kvk_nummer?: string;                   // Voor ZZP/MKB
  btw_nummer?: string;                   // Voor ondernemers
  
  // Financiële gegevens
  iban?: string;                         // NL91 ABNA 0417 1643 00
  bic?: string;                          // ABNANL2A
  bank_naam?: string;                    // "ABN AMRO"
  alternatief_iban?: string;             // Tweede rekening
  betalingstermijn?: number;             // In dagen (bijv. 30)
  
  // Status
  status: 'Actief' | 'Inactief' | 'Prospect';
  status_historisch: boolean;
  
  // Verantwoordelijkheid
  accountmanager: string;
  facturatie_frequentie?: string;        // "Jaarlijks", "Maandelijks", "Kwartaal"
  
  // Tijdlijn
  sinds_wanneer_klant: string;           // "2020-01-15"
  einddatum_relatie?: string;
  
  // Relaties
  gerelateerde_klanten: string[];        // IDs
  relatie_type?: string;
  
  // Partner (alleen voor Particulier)
  partner_id?: string;                   // Link naar partner klant
  partner_naam?: string;                 // Naam voor display
  is_gezamenlijk?: boolean;              // Gezamenlijke aangifte?
  
  // Externe accountant (voor BV klanten)
  externe_accountant?: string;           // Naam accountant
  accountant_email?: string;
  accountant_telefoonnummer?: string;
  accountant_kantoor?: string;           // Naam accountantskantoor
  samenwerking_sinds?: string;           // Sinds wanneer samenwerking
  
  // Groei & Ontwikkeling (voor MKB/ZZP)
  jaren_actief_als_ondernemer?: number;
  groei_fase?: 'Starter' | 'Groei' | 'Schaal-op' | 'Professionalisering' | 'Digitalisering' | 'Stabiel' | 'Exit' | 'N.V.T.';
  omzet_categorie?: '< 50k' | '50k-250k' | '250k-1M' | '> 1M';
  
  // Tags & Segmentatie
  tags: string[];
  segment?: 'VIP' | 'Premium' | 'Standard';
  
  // Communicatie voorkeuren
  voorkeur_kanaal?: Channel;
  taal_voorkeur: 'nl' | 'en';
  
  // Notities
  notities?: string;
  interne_notities?: string;
  
  // Calculated fields (rollups)
  laatste_contact_datum?: string;
  aantal_interacties?: number;
  aantal_openstaande_opvolgingen?: number;
  totale_omzet?: number;
  aantal_opdrachten?: number;
  aantal_actieve_opdrachten?: number;
  aantal_openstaande_taken?: number;
  jaren_als_klant?: number;
  engagement_score?: number;
}

// ============================================
// OPDRACHT (Assignment) - Parent of Tasks, Child of Project
// ============================================
export interface Opdracht {
  // Identificatie
  id: string;
  opdracht_nummer: string;               // "OPD-2024-0001"
  opdracht_naam: string;
  beschrijving?: string;
  
  // Hiërarchie (UPDATED)
  project_id?: string;                   // Parent Project (NIEUW)
  project_naam?: string;                 // Voor display
  
  // Klant relatie
  klant_id: string;
  klant_naam: string;
  bedrijfsnaam?: string;
  
  // Type & Classificatie
  type_opdracht: OpdrachtType;
  categorie: 'Traditie' | 'Groei' | 'Advies';
  boekjaar_periode?: string;             // "2024", "2025 Q1", "maart 2025"
  bijzonderheden?: string;               // Extra opmerkingen
  
  // Status workflow
  status: 'Intake' | 'In behandeling' | 'Wacht op klant' | 'Gereed voor controle' | 'Afgerond' | 'Ingediend';
  priority: 'Urgent' | 'Hoog' | 'Normaal' | 'Laag';
  
  // Tijdlijn
  start_datum: string;
  deadline: string;
  afgerond_datum?: string;
  ingediend_datum?: string;
  
  // Verantwoordelijkheid & Goedkeuring
  verantwoordelijk: string;              // Hoofdverantwoordelijke (vaak Harm-Jan)
  team_members?: string[];               // Team dat eraan werkt
  goedkeurder?: string;                  // Wie moet aftekenen (vaak Harm-Jan)
  goedgekeurd_door?: string;             // Wie heeft afgetekend
  goedgekeurd_op?: string;               // Wanneer afgetekend
  
  // Uren & Planning
  geschat_aantal_uren: number;
  bestede_uren?: number;
  
  // Financieel
  gefactureerd_bedrag: number;
  betaald: boolean;
  betalings_datum?: string;
  factuur_nummer?: string;
  
  // Documenten
  document_ids: string[];
  externe_bestanden_id?: string;
  
  // Notities
  interne_notities?: string;
  klant_notities?: string;
  
  // Calculated fields
  dagen_tot_deadline?: number;
  is_overdue?: boolean;
  aantal_gerelateerde_interacties?: number;
  laatste_communicatie?: string;
  aantal_taken?: number;
  aantal_openstaande_taken?: number;
  aantal_taken_wacht_goedkeuring?: number; // Taken die wachten op goedkeuring
  voortgang_percentage?: number;         // Percentage taken afgerond
}

export type OpdrachtType = 
  // Traditional services
  | 'IB (Inkomstenbelasting)'
  | 'BTW-aangifte'
  | 'Jaarrekening'
  | 'Vennootschapsbelasting'
  | 'Loonadministratie'
  | 'Toeslag aanvragen'
  | 'Bezwaarschrift'
  | 'Schenking/Erfenis'
  // Growth services
  | 'Groeibegeleiding'
  | 'Startersbegeleiding'
  | 'Procesoptimalisatie'
  | 'Workflow analyse'
  | 'Groeiplan'
  | 'Financieel advies';

// ============================================
// TAAK (Task) - With Workflow Management
// ============================================
export interface Taak {
  // Identificatie
  id: string;
  taak_nummer: string;                   // "TAAK-2024-0001"
  taak_omschrijving: string;
  notities?: string;
  
  // Workflow - Verantwoordelijkheden
  created_by: string;                    // Wie heeft de taak aangemaakt
  toegewezen_aan: string;                // Wie moet de taak uitvoeren
  started_by?: string;                   // Wie is daadwerkelijk gestart
  approved_by?: string;                  // Wie heeft afgetekend (vaak Harm-Jan)
  
  // Goedkeuringsproces
  needs_approval: boolean;               // Moet deze taak goedgekeurd worden?
  approval_status?: 'pending' | 'approved' | 'rejected';
  approval_notes?: string;               // Feedback bij afkeuring
  
  // Relaties (EXPANDED)
  klant_id: string;
  klant_naam: string;
  gerelateerde_interactie_id?: string;
  gerelateerde_interactie?: string;      // Onderwerp/naam voor display (CSV compatibility)
  gerelateerde_opdracht_id?: string;     // Link to parent Opdracht
  opdracht_naam?: string;                // Opdracht naam voor display
  project_id?: string;                   // Link to project
  parent_taak_id?: string;               // For subtasks
  
  // Status & Priority
  status: 'Te doen' | 'In uitvoering' | 'Gereed voor controle' | 'Afgerond' | 'Geblokkeerd';
  priority: 'Urgent' | 'Hoog' | 'Normaal' | 'Laag';
  blocked_reason?: string;
  
  // Tijdlijn
  created_at: string;
  deadline: string;
  started_at?: string;
  completed_at?: string;
  submitted_for_approval_at?: string;    // Wanneer ingediend voor goedkeuring
  approved_at?: string;                  // Wanneer goedgekeurd
  
  // Checklist
  checklist_items?: ChecklistItem[];
  
  // Tags
  tags: string[];
  
  // Calculated fields
  dagen_tot_deadline?: number;
  is_overdue?: boolean;
  dagen_open?: number;
  klant_status?: string;
  wacht_op_goedkeuring?: boolean;        // Handig voor filters
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completed_by?: string;
  completed_at?: string;
}

// ============================================
// CONTACTPERSOON (Contact Person)
// ============================================
export interface ContactPersoon {
  // Identificatie
  id: string;
  naam: string;
  functie: string;
  
  // Klant relatie
  klant_id: string;
  bedrijfsnaam: string;
  primair: boolean;
  
  // Contactgegevens
  email: string;
  telefoonnummer: string;
  mobiel: string;
  
  // Social
  linkedin?: string;
  
  // Dubbele rol
  is_ook_klant_id?: string;
  is_ook_klant?: string;                 // Klant naam voor display (CSV compatibility)
  
  // Notities
  notities?: string;
  
  // Voorkeuren
  voorkeur_communicatie?: 'E-mail' | 'Telefoon' | 'WhatsApp';
  taal_voorkeur?: 'nl' | 'en';
  
  // Calculated fields
  aantal_interacties?: number;
  laatste_contact?: string;
  klant_status?: string;
  klant_type?: string;
}

// ============================================
// SHARED TYPES
// ============================================
export type Channel = 
  | 'Telefoon'
  | 'E-mail'
  | 'WhatsApp'
  | 'Zoom'
  | 'SMS'
  | 'Facebook'
  | 'Instagram'
  | 'LinkedIn';

export interface Attachment {
  id: string;
  filename: string;
  file_type: string;                     // MIME type
  file_size: number;                     // bytes
  url: string;
  thumbnail_url?: string;
  uploaded_at: string;
  uploaded_by: string;
}

export type ChannelMetadata = 
  | WhatsAppMetadata
  | EmailMetadata
  | PhoneMetadata
  | VideoMetadata
  | SMSMetadata
  | SocialMediaMetadata;

export interface WhatsAppMetadata {
  channel: 'WhatsApp';
  whatsapp_message_id: string;
  status: 'sent' | 'delivered' | 'read';
  media_type?: 'image' | 'video' | 'document' | 'audio';
  quoted_message_id?: string;
}

export interface EmailMetadata {
  channel: 'E-mail';
  email_message_id: string;
  subject: string;
  thread_id?: string;
  cc?: string[];
  bcc?: string[];
  in_reply_to?: string;
  references?: string[];
  headers?: Record<string, string>;
}

export interface PhoneMetadata {
  channel: 'Telefoon';
  call_id?: string;
  duration_seconds: number;
  duration_formatted?: string;
  call_type: 'inbound' | 'outbound' | 'missed' | 'completed';
  recording_url?: string;
  transcription?: string;
}

export interface VideoMetadata {
  channel: 'Zoom';
  meeting_id: string;
  meeting_url?: string;
  platform: 'zoom' | 'teams' | 'meet' | 'other';
  duration_minutes?: number;
  duration_formatted?: string;
  scheduled_duration_minutes?: number;
  call_type?: 'completed' | 'missed';
  recording_url?: string;
  participants?: string[];
  summary?: string;
}

export interface SMSMetadata {
  channel: 'SMS';
  sms_message_id: string;
  phone_number: string;
}

export interface SocialMediaMetadata {
  channel: 'Facebook' | 'Instagram' | 'LinkedIn';
  platform_message_id: string;
  post_url?: string;
  is_dm: boolean;
  is_comment: boolean;
}

// ============================================
// PROJECT MANAGEMENT TYPES
// ============================================
export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'BTW' | 'Jaarrekening' | 'Hypotheek' | 'Advies' | 'Other';
  description: string;
  default_duration_days: number;
  task_templates: string; // JSON string
  created_at: string;
  created_by: string;
  is_active: boolean;
  use_count: number;
}

export interface Project {
  id: string;
  project_nummer?: string;               // "PROJ-2024-0001" (NIEUW)
  name: string;
  
  // Klant relatie
  client_id: string;
  client_name: string;
  
  // Type & Classificatie
  category: 'BTW' | 'BTW Bulk' | 'Fiscale begeleiding' | 'Groeibegeleiding' | 'Jaarrekening' | 'Hypotheek' | 'Advies' | 'Other';
  beschrijving?: string;
  
  // Status
  status: 'niet-gestart' | 'in-uitvoering' | 'wacht-op-klant' | 'geblokkeerd' | 'afgerond';
  
  // Tijdlijn
  start_date: string;
  deadline: string;
  completed_date?: string;
  created_at?: string;
  
  // Verantwoordelijkheid
  assigned_to?: string;
  team_members?: string[];
  responsible_team_member?: string;
  responsible_initials?: string;
  
  // Voortgang (legacy compatibility)
  completion_percentage?: number;
  is_overdue?: boolean;
  blocked_reason?: string | null;
  last_reminder_sent?: string | null;
  reminder_count?: number;
  
  // Hiërarchie (NIEUW)
  opdracht_ids?: string[];               // Links naar Opdrachten binnen dit project
  
  // Template (optional)
  template_id?: string;
  
  // Legacy fields (backwards compatibility)
  interactie_id?: string;
  stages?: ProjectStage[];
  taken?: Taak[];
  documenten?: ProjectDocument[];
  tijdregistraties?: TimeEntry[];
  bedrag?: number;
  
  // Calculated fields (NIEUW)
  voortgang_percentage?: number;
  aantal_opdrachten?: number;
  aantal_openstaande_opdrachten?: number;
  totaal_geschatte_uren?: number;
  totaal_bestede_uren?: number;
}

export interface ProjectStage {
  id: number;
  name: string;
  completed: boolean;
  startDate?: string;
  completedDate?: string;
  expectedCompletion?: string;
  checklist: ProjectChecklistItem[];
}

export interface ProjectChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProjectDocument {
  id: string;
  naam: string;
  type: 'Factuur' | 'Bankafschrift' | 'Contract' | 'Aangifte' | 'Overig';
  bestandsnaam: string;
  upload_datum: string;
  uploaded_by: string;
  file_size: number;
  url: string;
}

export interface TimeEntry {
  id: string;
  project_id: string;
  medewerker: string;
  datum: string;
  uren: number;
  beschrijving: string;
  tarief?: number;
  factureerbaar: boolean;
}
