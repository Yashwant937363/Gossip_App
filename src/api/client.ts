import axios from "axios";
import Cookies from "js-cookie";
import { ImageAnalysisResult } from "../types";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

export const getAuthToken = (): string => {
  return Cookies.get("authtoken") || "";
};

export const api = axios.create({
  baseURL: SERVER_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const apiSignUp = async (formData: FormData) => {
  const response = await api.post("/api/auth/signup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const apiSignIn = async (signInData: { email: string; password: string } | FormData) => {
  const response = await api.post("/api/auth/signin", signInData);
  return response.data;
};

export const apiGetUser = async (token?: string) => {
  const authToken = token || getAuthToken();
  const response = await api.post(
    "/api/auth/getuser",
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
};

export const apiSendEmailOtp = async (email: string) => {
  const response = await api.post("/api/auth/send-email-otp", { email });
  return response.data;
};

// Chat APIs
export const apiUploadImage = async (file: File | Blob) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post<{ success: boolean; url: string }>("/api/chat/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const apiGetFriends = async (token?: string) => {
  const authToken = token || getAuthToken();
  const response = await api.post(
    "/api/chat/getFriends",
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
};

// User APIs
export const apiSearchUsers = async (query: string) => {
  const response = await api.get(`/api/user/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// AI APIs
export const apiChatbot = async (data: {
  message: string;
  tone?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}) => {
  const response = await api.post<{ reply: string; tone: string }>("/api/ai/chatbot", data);
  return response.data;
};

export const apiAnalyzeImage = async (data: { url: string; prompt?: string }) => {
  const response = await api.post<{ data: ImageAnalysisResult }>("/api/ai/analyze-image", data);
  return response.data;
};

export const apiTranslate = async (data: {
  messages: Array<{ id: string; text: string }>;
  to: string;
}) => {
  const response = await api.post<{
    messages: Array<{ id: string; translatedText: string }>;
    language: string;
  }>("/api/ai/translate", data);
  return response.data;
};

export const apiSummarize = async (data: {
  conversation: Array<{ username: string; message: string }>;
  format?: "paragraph" | "bullet" | "structured" | string;
}) => {
  const response = await api.post<{ summary: any }>("/api/ai/summarize", data);
  return response.data;
};
