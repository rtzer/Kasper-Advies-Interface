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
  contactpersoon_id?: string;
  
  // Medewerker
  medewerker: string;                    // "Harm-Jan Kaspers" | "Jan Jansen" | "Linda Prins"
  
  // Kanaal & Type
  kanaal: Channel;
  type: 'Inbound' | 'Outbound';
  duur?: number;                         // Duration in minutes (phone/video)
  
  // Content
  onderwerp: string;
  samenvatting: string;                  // Long text
  
  // Opdracht link
  opdracht_id?: string;
  opdracht_naam?: string;
  
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
  
  // Thread info
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
  
  // Tijdlijn
  sinds_wanneer_klant: string;           // "2020-01-15"
  einddatum_relatie?: string;
  
  // Relaties
  gerelateerde_klanten: string[];        // IDs
  relatie_type?: string;
  
  // Groei & Ontwikkeling (voor MKB/ZZP)
  jaren_actief_als_ondernemer?: number;
  groei_fase?: 'Starter' | 'Groei' | 'Stabiel' | 'Exit' | 'N.V.T.';
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
// OPDRACHT (Assignment)
// ============================================
export interface Opdracht {
  // Identificatie
  id: string;
  opdracht_nummer: string;               // "OPD-2024-0001"
  opdracht_naam: string;
  beschrijving?: string;
  
  // Klant relatie
  klant_id: string;
  klant_naam: string;
  bedrijfsnaam?: string;
  
  // Type & Classificatie
  type_opdracht: OpdrachtType;
  categorie: 'Traditie' | 'Groei' | 'Advies';
  
  // Status workflow
  status: 'Intake' | 'In behandeling' | 'Wacht op klant' | 'Gereed' | 'Afgerond' | 'Ingediend';
  priority: 'Urgent' | 'Hoog' | 'Normaal' | 'Laag';
  
  // Tijdlijn
  start_datum: string;
  deadline: string;
  afgerond_datum?: string;
  ingediend_datum?: string;
  
  // Verantwoordelijkheid
  verantwoordelijk: string;
  team_members?: string[];
  
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
// TAAK (Task)
// ============================================
export interface Taak {
  // Identificatie
  id: string;
  taak_nummer: string;                   // "TAAK-2024-0001"
  taak_omschrijving: string;
  notities?: string;
  
  // Verantwoordelijkheid
  toegewezen_aan: string;
  created_by: string;
  
  // Relaties (EXPANDED)
  klant_id: string;
  klant_naam: string;
  gerelateerde_interactie_id?: string;
  gerelateerde_opdracht_id?: string;
  project_id?: string;                   // NEW: Link to project
  parent_taak_id?: string;               // NEW: For subtasks
  
  // Status & Priority
  status: 'Te doen' | 'In uitvoering' | 'Geblokkeerd' | 'Afgerond';
  priority: 'Urgent' | 'Hoog' | 'Normaal' | 'Laag';
  blocked_reason?: string;
  
  // Tijdlijn
  created_at: string;
  deadline: string;
  started_at?: string;
  completed_at?: string;
  
  // Checklist
  checklist_items?: ChecklistItem[];
  
  // Tags
  tags: string[];
  
  // Calculated fields
  dagen_tot_deadline?: number;
  is_overdue?: boolean;
  dagen_open?: number;
  klant_status?: string;
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
  call_type: 'inbound' | 'outbound' | 'missed';
  recording_url?: string;
  transcription?: string;
}

export interface VideoMetadata {
  channel: 'Zoom';
  meeting_id: string;
  meeting_url?: string;
  platform: 'zoom' | 'teams' | 'meet' | 'other';
  duration_minutes: number;
  recording_url?: string;
  participants: string[];
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
  name: string;
  template_id: string;
  client_id: string;
  client_name: string;
  category: 'BTW' | 'Jaarrekening' | 'Hypotheek' | 'Advies' | 'Other';
  status: 'niet-gestart' | 'in-uitvoering' | 'wacht-op-klant' | 'geblokkeerd' | 'afgerond';
  start_date: string;
  deadline: string;
  completion_percentage: number;
  responsible_team_member: string;
  responsible_initials: string;
  is_overdue: boolean;
  blocked_reason: string | null;
  last_reminder_sent: string | null;
  reminder_count: number;
  created_at: string;
  
  // NEW FIELDS
  interactie_id?: string;                // Link to original interaction
  stages?: ProjectStage[];               // Project stages with checklists
  taken?: Taak[];                        // Related tasks
  documenten?: ProjectDocument[];        // Related documents
  tijdregistraties?: TimeEntry[];        // Time tracking
  beschrijving?: string;                 // Project description
  bedrag?: number;                       // Project amount
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
