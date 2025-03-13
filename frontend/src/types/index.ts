//frontend\src\types\index.ts
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
    firstName?: string;
    lastName?: string;
    bio?: string;
    skills?: string[]; // Références aux IDs des compétences, mais ici on utilisera des chaînes pour simplifier
    companyName?: string;
    webSite?: string;
    isFreelancer?: boolean;
  }

  export interface PostData {
    _id: string; 
    title: string; 
    description: string; 
    skillsRequired: string[]; 
    budget: number; 
    duration: "short-term" | "long-term" | "ongoing"; 
    client: {
      _id: string; 
      username: string; 
      email?: string; 
    } | null; 
    status: "open" | "in-progress" | "completed"; 
    createdAt: string; 
    updatedAt?: string; 
    applications: {
      freelancer: string; 
      cv: string; 
      coverLetter: string; 
      bidAmount: number; 
      status: "pending" | "accepted" | "rejected"; 
      _id: string; 
      appliedAt: string; 
    }[]; 
    category?:string ; 
    profile?: ProfileData;
    __v?: number; 
  }
  
  export interface Category {
    _id: string;
    name: string;
    description?: string;
    createdAt?: string; 
    slug?: string;
  }