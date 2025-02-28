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