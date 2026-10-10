export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'MODERATE' | 'LOW_HOME_CARE';

export interface TriageResponse {
  summary: string;
  urgencyLevel: UrgencyLevel;
  urgencyTitle: string;
  urgencyRationale: string;
  warningSigns: string[];
  recommendedNextSteps: string[];
  ruralCareTips: string[];
  questionsForDoctor: string[];
  potentialCategories?: string[];
  disclaimer: string;
}

export interface TriageFormState {
  age: string;
  gender: string;
  duration: string;
  symptoms: string;
  temperature: string;
  existingConditions: string;
  warningSigns: string[];
  language: string;
}

export interface PresetScenario {
  id: string;
  label: string;
  tag: string;
  age: string;
  duration: string;
  symptoms: string;
  warningSigns: string[];
  temperature?: string;
  conditions?: string;
}
