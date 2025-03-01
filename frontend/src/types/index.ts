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
    };
  }

  export interface PostData {
    title: string;
    description: string;
    skillsRequired: string[];
    budget: number;
    duration: "short-term" | "long-term" | "ongoing"; // Enum basé sur postModel.js
    category: string; // Nom de la catégorie
  }
  
  // Interface pour une catégorie (basé sur categoryModel.js)
  export interface Category {
    _id: string;
    name: string;
    description?: string;
    createdAt?: string; // Date en string au format ISO après parsing JSON
  }