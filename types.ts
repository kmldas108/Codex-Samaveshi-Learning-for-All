export enum AppMode {
  HOME = 'HOME',
  ONBOARDING = 'ONBOARDING',
  HEAR_IMAGES = 'HEAR_IMAGES',
  SEE_SOUND = 'SEE_SOUND',
  EASY_READ = 'EASY_READ',
  CLASS_PACK = 'CLASS_PACK',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  SETTINGS = 'SETTINGS',
  CAMERA = 'CAMERA'
}

export enum UserDisability {
  NONE = 'NONE',
  VISUAL = 'VISUAL',
  HEARING = 'HEARING',
  DYSLEXIA = 'DYSLEXIA'
}

export interface UserPreferences {
  name: string;
  grade: string;
  language: string;
  location: string;
  disability: UserDisability;
  culturalContext: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface EducationalContent {
  // Common
  mode: AppMode;
  topic: string;
  
  // Mode 1: Hear Images
  spatialDescription?: string;
  tactileModelSuggestion?: string;
  
  // Mode 2: See Sound
  transcript?: string; // With visual cues
  summary?: string;
  emotionalTone?: string;
  keyTerms?: string[];
  
  // Mode 3: Easy Read
  simplifiedText?: string; // Chunked/Bullet points
  analogies?: string;
  quiz?: QuizQuestion[];
  
  // Mode 4: Class Pack
  studentNotes?: string;
  parentSummary?: string; // For WhatsApp
  
  // Legacy/General
  followUpSuggestions: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ToolConfig {
  voiceName?: string;
}