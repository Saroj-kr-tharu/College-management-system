import type {
  IChangePassword,
  ILoginData,
  ISignupData,
} from "../types/auth.types";
import api from "./";

export const login = async (data: ILoginData) => {
  try {
    const response = await api.post(`/auth/login`, data);
    return response.data.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const signup = async (data: ISignupData) => {
  try {
    const response = await api.post(`/auth/signup`, data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/auth/me", {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const ChangePassword = async (data: IChangePassword) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/auth/change-password", data, {
      headers: {
        "x-access-token": token,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await api.post(`/auth/logout`);
    localStorage.removeItem("token");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await api.post(`/auth/forgot-password`, data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
