export type EventType =
  | 'wedding'
  | 'birthday'
  | 'anniversary'
  | 'corporate'
  | 'community'
  | 'other';

export type EventStyle =
  | 'Traditional'
  | 'Modern'
  | 'Luxury'
  | 'Minimalist'
  | 'Eco-friendly';

export type IndoorOutdoorPreference = 'Indoor' | 'Outdoor' | 'Both / Flexible';

export interface EventFormData {
  eventType: EventType;
  customEventType?: string;
  eventName?: string;
  eventDate: string;
  eventLocation: string;
  guestCount: number;
  totalBudget: number; // in INR
  eventStyle: EventStyle;
  indoorOutdoor: IndoorOutdoorPreference;
  foodPreferences: string;
  additionalRequirements: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface DecorationIdea {
  title: string;
  description: string;
  focalArea: string;
}

export interface EventConcept {
  themeTitle: string;
  tagline: string;
  story: string;
  colorPalette: ColorSwatch[];
  decorationIdeas: DecorationIdea[];
  personalizedSuggestions: string[];
}

export interface BudgetItem {
  id: string;
  category:
    | 'Venue'
    | 'Catering'
    | 'Decoration'
    | 'Photography'
    | 'Entertainment'
    | 'Invitations'
    | 'Transportation'
    | 'Miscellaneous';
  allocatedAmount: number;
  percentage: number;
  description: string;
  costSavingTip: string;
}

export interface BudgetBreakdown {
  totalBudget: number;
  allocatedTotal: number;
  items: BudgetItem[];
  summaryNote: string;
}

export interface PrepPhase {
  phase: string; // e.g., "30 Days Before", "15 Days Before", "7 Days Before", "1-2 Days Before"
  tasks: string[];
}

export interface ScheduleItem {
  time: string;
  title: string;
  activity: string;
  responsible: string;
  notes?: string;
}

export interface EventTimeline {
  prepTimeline: PrepPhase[];
  daySchedule: ScheduleItem[];
}

export interface VendorChecklistItem {
  id: string;
  category:
    | 'Venue'
    | 'Catering'
    | 'Decoration'
    | 'Photography'
    | 'Entertainment'
    | 'Stylist & Makeup'
    | 'Invitations & Favors'
    | 'Logistics';
  task: string;
  estimatedCost: number;
  deadline: string;
  completed: boolean;
  notes?: string;
  recommendedRole?: string;
}

export interface FoodMenu {
  welcomeDrinks: string[];
  appetizers: string[];
  mainCourse: string[];
  desserts: string[];
  signatureSpecial: string;
}

export interface GameOrActivity {
  name: string;
  targetAudience: string;
  description: string;
}

export interface EntertainmentIdea {
  title: string;
  description: string;
  vibe: string;
}

export interface GuestExperienceItem {
  touchpoint: string;
  idea: string;
}

export interface CostSavingSuggestion {
  area: string;
  suggestion: string;
  potentialSavings: number;
}

export interface Recommendations {
  foodMenu: FoodMenu;
  gamesAndActivities: GameOrActivity[];
  entertainmentIdeas: EntertainmentIdea[];
  guestExperience: GuestExperienceItem[];
  costSavingSuggestions: CostSavingSuggestion[];
}

export interface EventPlan {
  id: string;
  createdAt: string;
  formData: EventFormData;
  concept: EventConcept;
  budget: BudgetBreakdown;
  timeline: EventTimeline;
  vendorChecklist: VendorChecklistItem[];
  recommendations: Recommendations;
  aiNotes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  planChangesApplied?: string[];
}
