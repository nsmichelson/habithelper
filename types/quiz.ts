export type QuestionType = 'single_choice' | 'multiple_choice' | 'scale' | 'text_input';

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
  category: 'medical' | 'goals' | 'lifestyle' | 'preferences' | 'demographics' | 'learning';
  conditionalOn?: {
    questionId: string;
    values: string[];
  };
  min?: number; // for scale questions
  max?: number; // for scale questions
}

export interface QuizResponse {
  questionId: string;
  value: string | string[] | number;
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  responses: QuizResponse[];
  completed: boolean;
}