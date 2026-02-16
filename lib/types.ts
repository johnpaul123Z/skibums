// Type definitions for the Ski Jobs application

export interface Job {
  id: string;
  title: string;
  resort: string;
  location: string;
  salary: string;
  type: string;
  difficulty: 1 | 2 | 3; // Green, Blue, Black diamond
  image: string;
  featured?: boolean;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  postedDate?: Date;
  applicationDeadline?: Date;
  url?: string;
  company?: 'Vail' | 'Alterra' | 'Boyne';
  housing?: boolean; // Does this job provide housing?
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  state: string;
  country: string;
  elevation: number;
  trailCount: number;
  annualSnowfall: number;
  logo?: string;
  image: string;
  description?: string;
  website?: string;
}

export interface WeatherData {
  temperature: number;
  condition: "Snowing" | "Clear" | "Cloudy" | "Powder Day";
  snowDepth: number;
  resort: string;
  lastUpdated?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  certifications?: string[];
  experience?: number;
  favoriteJobs?: string[];
  appliedJobs?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  appliedAt: Date;
  resume?: string;
  coverLetter?: string;
}

export type Difficulty = 1 | 2 | 3;
export type JobType = "Full-time" | "Part-time" | "Seasonal" | "Contract";
export type JobCategory = 
  | "Ski Instructor"
  | "Lift Operator"
  | "Ski Patrol"
  | "Hospitality"
  | "Food & Beverage"
  | "Retail"
  | "Management"
  | "Maintenance";
