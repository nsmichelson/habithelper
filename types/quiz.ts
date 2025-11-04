export type QuestionType = 'single_choice' | 'multiple_choice' | 'scale' | 'text_input' | 'text';

export interface QuizOption {
  value: string;
  label: string;
  icon?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuizOption[];
  required: boolean;
  helpText?: string;
  category: 'medical' | 'goals' | 'lifestyle' | 'preferences' | 'demographics' | 'learning' | 'food personality' | 'experience' | 'skills' | 'personality' | 'challenges' | 'motivation' | 'context';
  conditionalOn?: {
    questionId: string;
    values: string[];
  };
  min?: number; // for scale questions
  max?: number; // for scale questions
  placeholder?: string; // for text input questions
}

export interface QuizResponse {
  questionId: string;
  values: string[]; // Always store as array for consistency
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  responses: QuizResponse[];
  completed: boolean;
}