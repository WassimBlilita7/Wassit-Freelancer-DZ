// frontend\src\types\index.ts
export interface SignupData {
  username: string;
  email: string;
  password: string;
  isFreelancer: boolean;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse {
  message: string;
  token?: string;
  userData?: {
    id: string;
    username: string;
    email: string;
    isFreelancer: boolean;
    profile?: ProfileData;
  };
}

export interface ProfileData {
  github: any;
  linkedIn: any;
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string[];
  companyName?: string;
  webSite?: string;
  isFreelancer?: boolean;
  profilePicture?: string; // Ajouté ici
}

export interface CreatePostData {
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number;
  duration: string; 
  category: string;
  picture?: File;
}

export interface PostData {
  _id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  budget: number;
  duration: '1j' | '7j' | '15j' | '1mois' | '3mois' | '6mois' | '+1an';
  client: {
    _id: string;
    username: string;
    email?: string;
  } | null;
  status: "open" | "in-progress" | "completed";
  createdAt: string;
  updatedAt?: string;
  applications: {
    freelancer: string | MinimalUser;
    cv: string;
    coverLetter: string;
    bidAmount: number;
    status: "pending" | "accepted" | "rejected";
    _id: string;
    appliedAt: string;
  }[];
  category?: Category;
  profile?: ProfileData;
  picture?: string;
  __v?: number;
  paid?: boolean;
  reviewed?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  slug: string;
}

export interface ApplyToPostData {
  cv: string;
  coverLetter: string;
  bidAmount: number;
}

export interface PaymentData {
  _id: string;
  postId: string | {
    _id: string;
    title: string;
    budget: number;
    client?: any;
    freelancerId?: any;
    status?: string;
  };
  clientId: string | {
    _id: string;
    username: string;
    email?: string;
    profile?: { profilePicture?: string };
  };
  freelancerId: string | {
    _id: string;
    username: string;
    email?: string;
    profile?: { profilePicture?: string };
  };
  amount: number;
  status: "pending" | "succeeded" | "failed";
  provider: "stripe" | "paypal" | "mock";
  createdAt: string;
}

export interface PaymentStatus {
  status: "pending" | "succeeded" | "failed";
  paymentId?: string;
  paid?: boolean;
}

export interface ReviewData {
  _id?: string;
  client: string;
  freelancer: string;
  post: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface ReviewResponse {
  message: string;
  review?: ReviewData;
}

export interface FreelancerStats {
  totalProjects: number;
  completedProjects: number;
  satisfactionRate: number;
  totalReviews: number;
  averageResponseTime: number;
  totalClients: number;
}

export interface MinimalUser {
  _id: string;
  username: string;
  email?: string;
  profile?: ProfileData;
}