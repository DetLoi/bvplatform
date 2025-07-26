// Move types
export interface Move {
  _id?: string;
  name: string;
  category: MoveCategory;
  level: MoveLevel;
  xp: number;
  videoUrl?: string;
  description?: string;
  difficulty?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MoveCategory = 'Toprock' | 'Footwork' | 'Freezes' | 'Power' | 'Tricks' | 'GoDowns';
export type MoveLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

// User types
export interface User {
  _id?: string;
  username: string;
  email: string;
  profileImage?: string;
  coverPhoto?: string;
  xp: number;
  level: number;
  masteredMoves: string[];
  badges: Badge[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Badge types
export interface Badge {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  category: string;
  requirement: string;
  image: string;
  level?: string;
  rarity?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Style data for radar chart
export interface StyleData {
  category: MoveCategory;
  score: number;
}

// Level summary data
export interface LevelSummary {
  level: MoveLevel;
  total: number;
  mastered: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Theme types
export type Theme = 'dark' | 'light';

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
} 