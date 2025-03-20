/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponse, Category, CreatePostData, PostData } from "@/types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ||   "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface SignupData {
  confirmPassword: string;
  username: string;
  email: string;
  password: string;
  isFreelancer: boolean;
}

export const signupUser = async (data: SignupData) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export const verifyOTP = async (data: VerifyOTPData) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data; 
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/auth/check");
    return response.data;
  } catch (e) {
    throw new Error("Non authentifié");
  }
};

export const createPost = async (data: CreatePostData) => {
  const response = await api.post("/post/createPost", data);
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get("/category");
  return response.data;
};

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data: { email: string; resetOTP: string; newPassword: string }): Promise<ApiResponse> => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const getProfile = async (): Promise<ApiResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData: Partial<PostData["profile"]>): Promise<ApiResponse> => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

export const getAllPosts = async (): Promise<PostData[]> => {
  try {
    const response = await api.get("/post");
    console.log("getAllPosts - Response:", response.data);
    if (response.data && Array.isArray(response.data.posts)) {
      return response.data.posts;
    }
    throw new Error("La réponse de l’API ne contient pas un tableau de posts valide");
  } catch (err) {
    console.error("Erreur dans getAllPosts:", err);
    throw err;
  }
};

export const deletePost = async (postId: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/post/${postId}`);
    return response.data;
  } catch (err) {
    console.error("Erreur dans deletePost:", err);
    throw err;
  }
};

export const searchPosts = async (data: { title: string }) => {
  const response = await api.post('/post/search', data);
  return response.data;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};