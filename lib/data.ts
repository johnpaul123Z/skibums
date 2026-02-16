// Example data for the Ski Jobs application
// Use these as templates for your own data

import { Job, Resort } from "./types";

export const sampleJobs: Job[] = [
  {
    id: "job-001",
    title: "Ski Instructor - Level II",
    resort: "Aspen Snowmass",
    location: "Aspen, Colorado",
    salary: "$45,000 - $65,000",
    type: "Full-time Seasonal",
    difficulty: 2,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    featured: true,
    description: "Join our world-class instruction team at Aspen Snowmass. We're seeking passionate, certified instructors to help guests of all levels experience the magic of skiing.",
    requirements: [
      "PSIA Level II certification or equivalent",
      "3+ years teaching experience",
      "Excellent communication skills",
      "First Aid/CPR certified",
    ],
    benefits: [
      "Season pass to all Aspen mountains",
      "Employee housing available",
      "Pro deals on gear",
      "Continuing education credits",
    ],
  },
  {
    id: "job-002",
    title: "Lift Operations Manager",
    resort: "Whistler Blackcomb",
    location: "Whistler, British Columbia",
    salary: "$55,000 - $75,000",
    type: "Full-time",
    difficulty: 3,
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
    featured: true,
    description: "Lead our lift operations team at North America's largest ski resort. This role oversees safety, maintenance, and guest experience across 37+ lifts.",
    requirements: [
      "5+ years lift operations experience",
      "Management experience required",
      "Mechanical aptitude",
      "Valid driver's license",
    ],
    benefits: [
      "Full benefits package",
      "Relocation assistance",
      "Mountain pass + 5 buddy passes",
      "Professional development opportunities",
    ],
  },
  {
    id: "job-003",
    title: "Ski Patrol",
    resort: "Jackson Hole Mountain Resort",
    location: "Teton Village, Wyoming",
    salary: "$50,000 - $70,000",
    type: "Full-time Seasonal",
    difficulty: 3,
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
    featured: false,
    description: "Protect guests on one of the most challenging mountains in North America. This position requires expert skiing and medical skills.",
    requirements: [
      "Advanced/expert skiing ability",
      "OEC certification",
      "Avalanche certification (Level 1+)",
      "Previous patrol experience preferred",
    ],
    benefits: [
      "Season pass",
      "Medical/dental insurance",
      "On-mountain meals",
      "Continuing medical education",
    ],
  },
  {
    id: "job-004",
    title: "Guest Services Representative",
    resort: "Vail Resorts",
    location: "Vail, Colorado",
    salary: "$35,000 - $45,000",
    type: "Full-time Seasonal",
    difficulty: 1,
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    featured: false,
    description: "Be the face of Vail! Help guests with reservations, directions, and creating unforgettable mountain experiences.",
    requirements: [
      "Customer service experience",
      "Multilingual skills a plus",
      "Positive attitude",
      "Computer proficiency",
    ],
    benefits: [
      "Epic Pass",
      "Employee discounts",
      "Flexible scheduling",
      "Career growth opportunities",
    ],
  },
  {
    id: "job-005",
    title: "Snowboard Instructor",
    resort: "Park City Mountain",
    location: "Park City, Utah",
    salary: "$40,000 - $60,000",
    type: "Seasonal",
    difficulty: 1,
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&q=80",
    featured: false,
    description: "Share your passion for snowboarding with riders of all ages and abilities at America's largest ski resort.",
    requirements: [
      "AASI Level 1+ certification",
      "Strong riding skills",
      "Patient teaching style",
      "Weekend availability",
    ],
    benefits: [
      "Season pass",
      "Pro deals",
      "Certification reimbursement",
      "Free lessons for family",
    ],
  },
  {
    id: "job-006",
    title: "Mountain Restaurant Chef",
    resort: "Telluride Ski Resort",
    location: "Telluride, Colorado",
    salary: "$50,000 - $70,000",
    type: "Full-time",
    difficulty: 2,
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=80",
    featured: true,
    description: "Create exceptional dining experiences at 11,000 feet. Lead kitchen operations at our award-winning on-mountain restaurant.",
    requirements: [
      "Culinary degree or equivalent",
      "3+ years chef experience",
      "High-altitude cooking experience",
      "Food safety certified",
    ],
    benefits: [
      "Competitive salary",
      "Season pass",
      "Housing stipend",
      "Creative menu freedom",
    ],
  },
];

export const sampleResorts: Resort[] = [
  {
    id: "resort-001",
    name: "Aspen Snowmass",
    location: "Aspen, Colorado",
    state: "Colorado",
    country: "USA",
    elevation: 12510,
    trailCount: 337,
    annualSnowfall: 300,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80",
    description: "Four mountains, endless possibilities. Aspen Snowmass offers world-class terrain for all abilities.",
    website: "https://www.aspensnowmass.com",
  },
  {
    id: "resort-002",
    name: "Whistler Blackcomb",
    location: "Whistler, BC",
    state: "British Columbia",
    country: "Canada",
    elevation: 7494,
    trailCount: 200,
    annualSnowfall: 469,
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=1200&q=80",
    description: "North America's largest ski resort with over 8,000 acres of legendary terrain.",
    website: "https://www.whistlerblackcomb.com",
  },
  {
    id: "resort-003",
    name: "Jackson Hole Mountain Resort",
    location: "Teton Village, Wyoming",
    state: "Wyoming",
    country: "USA",
    elevation: 10450,
    trailCount: 133,
    annualSnowfall: 459,
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&q=80",
    description: "Legendary steep terrain and the iconic tram accessing 4,139 vertical feet.",
    website: "https://www.jacksonhole.com",
  },
];

// Mock API functions for demonstration

export async function fetchJobs(filters?: {
  difficulty?: number;
  resort?: string;
  featured?: boolean;
}): Promise<Job[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let jobs = [...sampleJobs];

  if (filters?.difficulty) {
    jobs = jobs.filter((job) => job.difficulty === filters.difficulty);
  }

  if (filters?.resort) {
    jobs = jobs.filter((job) =>
      job.resort.toLowerCase().includes(filters.resort!.toLowerCase())
    );
  }

  if (filters?.featured !== undefined) {
    jobs = jobs.filter((job) => job.featured === filters.featured);
  }

  return jobs;
}

export async function fetchJobById(id: string): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return sampleJobs.find((job) => job.id === id) || null;
}

export async function searchJobs(query: string): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const lowerQuery = query.toLowerCase();
  return sampleJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(lowerQuery) ||
      job.resort.toLowerCase().includes(lowerQuery) ||
      job.location.toLowerCase().includes(lowerQuery)
  );
}

export async function fetchResorts(): Promise<Resort[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return sampleResorts;
}

// Utility functions

export function getDifficultyLabel(difficulty: 1 | 2 | 3): string {
  const labels = {
    1: "Entry Level",
    2: "Intermediate",
    3: "Expert",
  };
  return labels[difficulty];
}

export function getDifficultySymbol(difficulty: 1 | 2 | 3): string {
  const symbols = {
    1: "◆",
    2: "◆◆",
    3: "◆◆◆",
  };
  return symbols[difficulty];
}

export function getDifficultyColor(difficulty: 1 | 2 | 3): string {
  const colors = {
    1: "text-green-400",
    2: "text-blue-400",
    3: "text-slate-900",
  };
  return colors[difficulty];
}

export function formatSalary(min: number, max: number): string {
  return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
}

export function getJobTypeLabel(type: string): string {
  return type;
}

// Job categories for filtering
export const jobCategories = [
  "Ski Instructor",
  "Lift Operator",
  "Ski Patrol",
  "Hospitality",
  "Food & Beverage",
  "Retail",
  "Management",
  "Maintenance",
  "Guest Services",
] as const;

// Location suggestions
export const popularLocations = [
  "Aspen, Colorado",
  "Vail, Colorado",
  "Park City, Utah",
  "Jackson Hole, Wyoming",
  "Whistler, BC",
  "Lake Tahoe, California",
  "Mammoth Lakes, California",
  "Telluride, Colorado",
] as const;
