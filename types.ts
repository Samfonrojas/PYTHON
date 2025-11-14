
export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface Lesson {
  title: string;
  explanation: string;
  starter_code: string;
  objective: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CodeEvaluation {
  is_correct: boolean;
  output: string;
  feedback: string;
}
