/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponse, Category, PostData, ProfileData , CreatePostData} from "@/types"; // Ajout de ProfileData
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

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

export const createPost = async (data: FormData): Promise<{ message: string; post: PostData }> => {
  const response = await api.post("/post/createPost", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

export const resetPassword = async (data: {
  email: string;
  resetOTP: string;
  newPassword: string;
}): Promise<ApiResponse> => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const getProfile = async (): Promise<ApiResponse> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData: Partial<ProfileData>): Promise<ApiResponse> => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

export const getAllPosts = async (): Promise<PostData[]> => {
  try {
    const response = await api.get("/post");
    if (response.data && Array.isArray(response.data.posts)) {
      return response.data.posts;
    }
    throw new Error("La réponse de l'API ne contient pas un tableau de posts valide");
  } catch (err) {
    console.error("Erreur dans getAllPosts:", err);
    throw err;
  }
};

export const getPostById = async (postId: string): Promise<PostData> => {
  const response = await api.get(`/post/${postId}`);
  return response.data.post;
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
  const response = await api.post("/post/search", data);
  return response.data;
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};

export const updateProfilePicture = async (formData: FormData) => {
  const response = await api.put("/auth/profile/picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const applyToPost = async (postId: string, data: FormData): Promise<ApiResponse> => {
  const response = await api.post(`/post/${postId}/apply`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProfileByUsername = async (username: string) => {
  const response = await axios.get(`${API_URL}/auth/profile/${username}`);
  return response.data;
};
export const updatePost = async (postId: string, data: Partial<CreatePostData>): Promise<{ message: string; post: PostData }> => {
  const formData = new FormData();
  formData.append("title", data.title || "");
  formData.append("description", data.description || "");
  formData.append("skillsRequired", JSON.stringify(data.skillsRequired || []));
  formData.append("budget", data.budget?.toString() || "");
  formData.append("duration", data.duration || "");
  if (data.picture && data.picture instanceof File) {
    formData.append("picture", data.picture);
  }

  const response = await api.put(`/post/${postId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get("/notification");
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.put(`/notification/${notificationId}/read`);
  return response.data;
};
export const markAllAsRead = async (notificationIds: string[]) => {
  const response = await api.put("/notification/mark-all-read", { notificationIds });
  return response.data;
};

export const createNotification = async (data: {
  recipient: string;
  sender: string;
  post: string;
  type: "application_accepted" | "new_application";
  message: string;
}) => {
  const response = await api.post("/notification", data);
  return response.data;
};

export const updateApplicationStatus = async (
  postId: string,
  applicationId: string,
  status: "accepted" | "rejected"
): Promise<ApiResponse> => {
  const response = await api.put(`/post/${postId}/applications/${applicationId}`, { status });
  return response.data;
};

export const getClientStats = async () => {
  const response = await api.get("/stats/client");
  return response.data;
};

export const getUserConversations = async () => {
  const response = await api.get("/message/conversations");
  return response.data;
};

export const getConversation = async (userId: string) => {
  const response = await api.get(`/message/conversation/${userId}`);
  return response.data;
};

export const sendMessage = async (receiverId: string, content: string) => {
  const response = await api.post("/message", { receiverId, content });
  return response.data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await api.delete(`/message/${messageId}`);
  return response.data;
};

export const markMessageAsRead = async (messageId: string) => {
  const response = await api.put(`/message/${messageId}/read`);
  return response.data;
};

export const getClientStatsByUsername = async (username: string) => {
  const response = await api.get(`/stats/client/${username}`);
  return response.data;
};

// Finalisation du projet
export const submitProjectFinalization = async (postId: string, data: FormData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.post(`/post/${postId}/finalize`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptProjectFinalization = async (postId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.put(`/post/${postId}/accept-finalization`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectProjectFinalization = async (postId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await api.put(`/post/${postId}/reject-finalization`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAcceptedPostsForFreelancer = async () => {
  const response = await api.get("/post/accepted");
  return response.data;
};

export const initiatePayment = async (postId: string, amount: number) => {
  if (!postId || typeof postId !== 'string') throw new Error('postId manquant ou invalide');
  if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) throw new Error('amount manquant ou invalide');
  const response = await api.post("/payment/initiate", { postId: String(postId), amount: Number(amount) });
  return response.data;
};

export const verifyPayment = async (paymentId: string, data: any) => {
  const response = await api.post(`/payment/verify`, { paymentId, ...data });
  return response.data;
};

export const getPaymentStatus = async (postId: string) => {
  const response = await api.get(`/payment/${postId}/status`);
  return response.data;
};